# Gujarati Learning Server

## Database Setup

### Prerequisites
- PostgreSQL installed and running
- Node.js and pnpm installed

### Setup Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Generate Prisma Client:**
   ```bash
   pnpm db:generate
   ```

4. **Push schema to database:**
   ```bash
   pnpm db:push
   ```
   Or create a migration:
   ```bash
   pnpm db:migrate
   ```

5. **Seed the database:**
   ```bash
   pnpm db:seed
   ```

### Database Commands

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database (dev)
- `pnpm db:migrate` - Create a new migration
- `pnpm db:migrate:deploy` - Apply migrations (production)
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:studio` - Open Prisma Studio (database GUI)

### Development

Start the development server:
```bash
pnpm dev
```

The server will run on `http://localhost:3001` by default.

### Production

Build and start:
```bash
pnpm build
pnpm start
```

