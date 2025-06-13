# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server with turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Apply migrations in development
- `npx prisma studio` - Open Prisma Studio for database management

## Architecture

This is a Next.js 15 recipe management application with:

- **Frontend**: React 19 with TypeScript, Tailwind CSS 4, and shadcn/ui components
- **Backend**: Next.js App Router API routes
- **Database**: PostgreSQL with Prisma ORM
- **Forms**: React Hook Form with Zod validation

### Key Components

**Database Schema (prisma/schema.prisma)**:
- `Recipe` - Main recipe model with title, description, times, servings, tags
- `Ingredient` - Recipe ingredients with name, amount, unit, notes
- `Instruction` - Step-by-step cooking instructions
- `Category` - Recipe categorization (optional)

**API Structure**:
- `/api/recipes` - GET (list all), POST (create new)
- `/api/recipes/[id]` - GET, PUT, DELETE for individual recipes

**Form Validation**:
All recipe data is validated using Zod schema in `src/lib/validations.ts`. The schema enforces required fields and data types for recipes, ingredients, and instructions.

**Database Connection**:
Prisma client is initialized in `src/lib/prisma.ts` with proper singleton pattern for development hot reloading.

### Component Structure

- `src/components/recipe-*` - Recipe-specific components
- `src/components/ui/` - shadcn/ui components
- All components use TypeScript and follow React 19 patterns