# Database Migrations

This document explains how to work with database migrations in the nest-workflows project.

## Prerequisites

Make sure you have PostgreSQL running locally with the following configuration:
- Host: localhost
- Port: 5432
- Username: macbook
- Database: workflows_db

## Migration Commands

### 1. Run Migrations
To apply all pending migrations to the database:
```bash
npm run migration:run
```

### 2. Generate New Migration
To generate a new migration based on entity changes:
```bash
npm run migration:generate libs/shared-models/src/lib/migrations/MigrationName
```

### 3. Revert Last Migration
To revert the most recent migration:
```bash
npm run migration:revert
```

### 4. Show Migration Status
To see which migrations have been applied:
```bash
npm run migration:show
```

## Using with Nx

You can also run these commands using Nx:

```bash
# Run migrations
npx nx run-many --target=migration:run

# Generate migration
npx nx run-many --target=migration:generate --args="libs/shared-models/src/lib/migrations/MigrationName"

# Revert migration
npx nx run-many --target=migration:revert

# Show migration status
npx nx run-many --target=migration:show
```

## Current Migration Status

✅ **CreateUserTable1700000000000** - Successfully applied
- Creates the initial user table with id, name, email, and password columns
- Email column has unique constraint

## Migration Files

Migrations are stored in `libs/shared-models/src/lib/migrations/` and follow the naming convention:
`{timestamp}-{MigrationName}.ts`

## Important Notes

1. Always backup your database before running migrations in production
2. Test migrations on a development database first
3. Never modify existing migration files that have been applied to production
4. The `synchronize: false` setting in the TypeORM config ensures migrations are used instead of auto-synchronization

## Current Migrations

- `1700000000000-CreateUserTable.ts` - Creates the initial user table with id, name, email, and password columns 