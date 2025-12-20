import 'dotenv/config'
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: process.env.DB_PRISMA_URL || env('DB_PRISMA_URL'),
  },
});