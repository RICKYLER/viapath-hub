import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getPrisma } from './db';

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Health Check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'ViaPathHub Main API', timestamp: new Date().toISOString() });
});

// ================= AUTHENTICATION =================

// Register a new User (and Worker Profile if role is 'worker')
app.post('/api/auth/register', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const { email, fullName, role, avatarUrl, location, title, category, hourlyRate, bio, locationLat, locationLng } = body;

    if (!email || !fullName || !role) {
      return c.json({ error: 'Missing required user fields' }, 400);
    }

    // Use a transaction to ensure atomic User + Worker creation
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email,
          fullName,
          role,
          avatarUrl,
          location,
        },
      });

      // 2. If User is a worker, create Worker Profile
      if (role === 'worker') {
        if (!title || !category || hourlyRate === undefined) {
          throw new Error('Missing required worker profile fields (title, category, hourlyRate)');
        }
        const worker = await tx.worker.create({
          data: {
            id: user.id,
            title,
            category,
            hourlyRate: parseFloat(hourlyRate),
            bio: bio || '',
            locationLat: locationLat ? parseFloat(locationLat) : null,
            locationLng: locationLng ? parseFloat(locationLng) : null,
          },
        });
        return { user, worker };
      }

      return { user };
    });

    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Login (fetch user info by email)
app.post('/api/auth/login', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        worker: true,
      },
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ================= WORKERS =================

// GET all workers with user information
app.get('/api/workers', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const workers = await prisma.worker.findMany({
      include: {
        user: true,
      },
    });
    return c.json(workers);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET worker by ID
app.get('/api/workers/:id', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const id = c.req.param('id');
  try {
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        user: true,
        reviews: {
          include: {
            reviewer: true,
          },
        },
      },
    });
    if (!worker) {
      return c.json({ error: 'Worker not found' }, 404);
    }
    return c.json(worker);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ================= JOBS / BOOKINGS =================

// Create a Job Booking
app.post('/api/jobs', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const { clientId, workerId, description, scheduledFor, price } = body;

    if (!clientId || !workerId || !description || !scheduledFor || price === undefined) {
      return c.json({ error: 'Missing required job parameters' }, 400);
    }

    const job = await prisma.job.create({
      data: {
        clientId,
        workerId,
        description,
        scheduledFor: new Date(scheduledFor),
        price: parseFloat(price),
      },
    });

    return c.json(job, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET jobs for a User (queries by client or worker)
app.get('/api/jobs', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const clientId = c.req.query('clientId');
  const workerId = c.req.query('workerId');

  try {
    if (clientId) {
      const clientJobs = await prisma.job.findMany({
        where: { clientId },
        include: {
          worker: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return c.json(clientJobs);
    }

    if (workerId) {
      const workerJobs = await prisma.job.findMany({
        where: { workerId },
        include: {
          client: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return c.json(workerJobs);
    }

    return c.json({ error: 'Must provide clientId or workerId query parameter' }, 400);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Update Job Status
app.patch('/api/jobs/:id/status', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const { status } = body; // "pending" | "accepted" | "in_progress" | "completed" | "cancelled"

    if (!status) {
      return c.json({ error: 'Status is required' }, 400);
    }

    const job = await prisma.job.update({
      where: { id },
      data: { status },
    });

    return c.json(job);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ================= REVIEWS =================

// Add a Review and update worker ratings
app.post('/api/reviews', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const { jobId, reviewerId, workerId, rating, comment } = body;

    if (!jobId || !reviewerId || !workerId || rating === undefined) {
      return c.json({ error: 'Missing required review fields' }, 400);
    }

    const numericRating = parseInt(rating);
    if (numericRating < 1 || numericRating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Review
      const review = await tx.review.create({
        data: {
          jobId,
          reviewerId,
          workerId,
          rating: numericRating,
          comment,
        },
      });

      // 2. Fetch all reviews for this worker to calculate new average
      const workerReviews = await tx.review.findMany({
        where: { workerId },
        select: { rating: true },
      });

      const totalReviews = workerReviews.length;
      const avgRating = workerReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews;

      // 3. Update Worker rating and reviewCount
      await tx.worker.update({
        where: { id: workerId },
        data: {
          rating: avgRating,
          reviewCount: totalReviews,
        },
      });

      return review;
    });

    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ================= MESSAGING =================

// GET messages for a job/chat
app.get('/api/messages/:jobId', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const jobId = c.req.param('jobId');
  try {
    const messages = await prisma.message.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });
    return c.json(messages);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST message
app.post('/api/messages', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const { jobId, senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return c.json({ error: 'Missing required message parameters' }, 400);
    }

    const message = await prisma.message.create({
      data: {
        jobId: jobId || null,
        senderId,
        receiverId,
        content,
      },
    });

    return c.json(message, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
