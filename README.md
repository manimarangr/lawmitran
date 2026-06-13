# Lawmitran

**Legal Help, Simplified.**

Lawmitran is a responsive legal services marketplace that connects customers with verified lawyers, online consultations, legal document support, reviews, and admin moderation tools.

## Stack

- Angular 20, Angular Material, Tailwind CSS, RxJS
- NestJS, TypeScript, REST APIs, JWT authentication, role-based access control
- PostgreSQL with Prisma ORM
- S3-compatible storage metadata support
- Docker and Docker Compose

## Project Structure

```text
apps/
  api/                 NestJS backend
    prisma/            Prisma schema and seed data
    src/               Feature modules, guards, DTOs, controllers
  web/                 Angular frontend
    src/app/           Routed standalone components and services
docker-compose.yml     Postgres, MinIO, API, and web services
.env.example           Local environment template
```

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:generate
docker compose up -d postgres minio
npm run db:migrate
npm run db:seed
npm run api:dev
npm run web:dev
```

Frontend: `http://localhost:4200`

API: `http://localhost:3000/api/v1`

Swagger docs: `http://localhost:3000/api/docs`

## Demo Accounts

All seeded users use `Password123!`.

- Admin: `admin@lawmitran.test`
- Customer: `customer@lawmitran.test`
- Lawyers: `rohan@lawmitran.test`, `nisha@lawmitran.test`, `kabir@lawmitran.test`

## Main Features

- Customer signup/login, lawyer search, lawyer profiles, consultation booking, document metadata, reviews
- Lawyer registration role, professional profile, practice areas, education, experience, availability
- Admin dashboard metrics, user listing, lawyer verification, review moderation hooks
- Public homepage with hero, filters, practice areas, featured lawyers, documents, process, and testimonials
- Lazy-loaded Angular routes and JWT interceptor
- Prisma seed data for practice areas, verified lawyers, reviews, and accounts

## Docker

```bash
cp .env.example .env
docker compose up --build
```

The API container expects migrations to be applied for a fresh database. For local development, run:

```bash
npm run db:migrate
npm run db:seed
```

## Verification

The codebase has been compiled locally with:

```bash
npm run db:generate
npm run api:build
npm run web:build
```

`npm audit` currently reports transitive dependency advisories from the installed ecosystem packages; review with `npm audit` before production release.
