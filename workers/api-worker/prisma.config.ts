import { defineConfig } from '@prisma/config';
import fs from 'fs';
import path from 'path';

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const parentEnvPath = path.resolve(process.cwd(), '../../.env');
    const localEnvPath = path.resolve(process.cwd(), '.env');
    const envPath = fs.existsSync(localEnvPath) ? localEnvPath : parentEnvPath;
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)/);
      if (match) {
        databaseUrl = match[1];
      }
    }
  } catch (e) {}
}

export default defineConfig({
  schema: '../../prisma/schema.prisma',
  datasource: {
    url: databaseUrl || 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
});
