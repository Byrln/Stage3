# TripSaaS - Tour Management System

TripSaaS is a comprehensive multi-tenant SaaS platform for tour operators, built with Next.js 15, Prisma, and Tailwind CSS.

## Features

- **Multi-tenancy**: Isolated data and branding for each tour operator.
- **Booking Management**: Real-time availability, capacity enforcement, and booking workflows.
- **Tour Management**: Create and manage tour itineraries, pricing, and media.
- **Role-Based Access Control**: Granular permissions for Super Admin, Admin, Guide, and Customer roles.
- **Internationalization**: Full support for multiple languages and currencies.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tripsaas
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.

   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

Run the test suite with Vitest:

```bash
# Run unit and integration tests
npm test

# Run tests with UI
npm run test:ui

# Check test coverage
npm run test:coverage
```

## Deployment

The project is configured for seamless deployment on Vercel.

1. Push your code to a Git repository.
2. Import the project in Vercel.
3. Configure environment variables in the Vercel dashboard.
4. Deploy!

See `vercel.json` for specific deployment configurations including headers and cron jobs.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities, database queries, and business logic.
- `src/messages`: i18n translation files.
- `tests`: Unit and integration tests.

## License

MIT
