import { useMemo } from "react";
import { CalendarRange, CircleCheckBig, DollarSign, UsersRound, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import { BookingCard } from "@/components/BookingCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";
import { Switch } from "@/components/ui/switch";

export function WorkerDashboardPage() {
  const { user, workerBookings, getBookingsByStatus, transactions, getWorkerById, updateWorkerProfile, getActiveAnnouncements } = useAppContext();
  const workerProfile = user?.workerId ? getWorkerById(user.workerId) : undefined;
  const acceptingBookings = workerProfile?.acceptingBookings !== false;
  const activeAnnouncements = getActiveAnnouncements("workers");

  const toggleAvailability = (checked: boolean) => {
    updateWorkerProfile({ acceptingBookings: checked });
  };

  // Pending Earnings: sum of accepted/pending jobs
  const pendingBookings = workerBookings.filter(b => b.status === 'accepted' || b.status === 'pending');
  const pendingEarnings = pendingBookings.reduce((sum, b) => sum + (b.price ?? 400), 0);

  // Cleared Earnings: sum of completed jobs
  const completedBookings = workerBookings.filter(b => b.status === 'completed');
  const clearedEarnings = completedBookings.reduce((sum, b) => sum + (b.price ?? 400), 0);

  // MoM Earning trends
  const monthlyData = useMemo(() => {
    const earningsMap: Record<string, number> = {
      Jan: 1200,
      Feb: 1800,
      Mar: 2500,
      Apr: clearedEarnings > 0 ? clearedEarnings : 1500,
      May: 0,
      Jun: 0,
    };

    completedBookings.forEach((b) => {
      const dateObj = new Date(b.date);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthNames[dateObj.getMonth()]?.slice(0, 3);
      if (monthName && monthName in earningsMap) {
        earningsMap[monthName] += (b.price ?? 400);
      }
    });

    return Object.entries(earningsMap).map(([name, amount]) => ({
      name,
      amount,
    }));
  }, [clearedEarnings, completedBookings]);

  // Mock payouts
  const workerTransactions = transactions.map(tx => ({
    ...tx,
    type: 'payout' as const,
    counterpartName: 'ViaPathHub Payout'
  }));

  return (
    <DashboardShell
      eyebrow="Worker dashboard"
      title={`Welcome, ${user?.name ?? "Worker"}`}
      description="Manage incoming client requests, stay on top of accepted jobs, and keep your profile ready for more bookings."
      aside={
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pending Requests</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{getBookingsByStatus("pending").length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Payout Earnings</p>
            <p className="mt-1 text-2xl font-bold text-success">₱{clearedEarnings.toLocaleString()}</p>
          </div>
        </div>
      }
    >
      {/* Announcement banners */}
      {activeAnnouncements.length > 0 && <AnnouncementBanner announcements={activeAnnouncements} />}

      {/* Availability Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border/80 px-5 py-4 rounded-[1.5rem] shadow-soft">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-foreground">Booking Status</h2>
          <p className="text-xs text-muted-foreground">Control your marketplace availability. Going offline disables booking triggers on your cards.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface border border-border/60 px-4 py-2 rounded-full">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${acceptingBookings ? "text-success" : "text-muted-foreground"}`}>
            {acceptingBookings ? "Online & Booking" : "Offline / On Break"}
          </span>
          <Switch
            checked={acceptingBookings}
            onCheckedChange={toggleAvailability}
            className="cursor-pointer"
          />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="stat-tile">
          <UsersRound className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Active client requests</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{workerBookings.length}</p>
        </article>
        <article className="stat-tile">
          <DollarSign className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Pending Earnings</p>
          <p className="mt-2 text-3xl font-bold text-foreground">₱{pendingEarnings.toLocaleString()}</p>
        </article>
        <article className="stat-tile">
          <CircleCheckBig className="text-success" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Cleared Payouts</p>
          <p className="mt-2 text-3xl font-bold text-foreground">₱{clearedEarnings.toLocaleString()}</p>
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Monthly Earnings Trends Chart */}
          <div className="surface-panel p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Monthly Earnings Trends</h3>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.014 88 / 40%)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.54 0.03 222)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.54 0.03 222)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'oklch(0.995 0.004 90)', 
                      borderColor: 'oklch(0.9 0.014 88)', 
                      borderRadius: '0.8rem', 
                      color: 'oklch(0.28 0.03 228)',
                      boxShadow: 'var(--shadow-soft)'
                    }}
                    cursor={{ fill: 'oklch(0.95 0.01 95 / 40%)' }}
                  />
                  <Bar dataKey="amount" fill="oklch(0.58 0.16 197)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Incoming bookings</h2>
            <div className="grid gap-4">
              {workerBookings.length ? (
                workerBookings.map((booking) => <BookingCard key={booking.id} booking={booking} perspective="worker" />)
              ) : (
                <div className="surface-panel p-6 text-sm text-muted-foreground">No incoming bookings yet.</div>
              )}
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <TransactionHistory transactions={workerTransactions} title="Earnings History" />
        </section>
      </div>
    </DashboardShell>
  );
}
