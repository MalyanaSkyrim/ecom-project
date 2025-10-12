# Turbo Stack CLI

**Turbo Stack CLI** is a command-line tool to bootstrap a preconfigured monorepo architecture optimized for modern development workflows. It provides a robust foundation for building scalable applications with a focus on developer experience and code maintainability.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

## Features

- **[TurboRepo](https://turbo.build/repo) Integration**: A high-performance build system that leverages intelligent caching and parallel execution to significantly reduce build times. It automatically tracks dependencies between packages and apps to ensure efficient rebuilds.

- **Apps**

  - **[Next.js](https://nextjs.org/) Web Application**: A feature-rich React framework application preconfigured with:
    - Server-side rendering
    - API routes
    - File-based routing
    - Built-in optimization features
  - **[Storybook](https://storybook.js.org/) Workshop**: An isolated UI development environment that allows you to:
    - Develop components in isolation
    - Test edge cases easily
    - Document component usage
    - Share components across teams

- **Reusable Packages**:

  - **UI Package**: A collection of reusable UI components optionally based on [ShadCN UI](https://shadcn.dev/), providing:
    - Consistent design language
    - Accessibility-first components
    - Customizable theming
    - Type-safe props
  - **Database Package**: [Prisma](https://www.prisma.io/) ORM setup with [TSUP](https://tsup.egoist.dev/) for building, offering:
    - Type-safe database queries
    - Auto-generated migrations
    - Database schema management
    - Efficient TypeScript/JavaScript compilation
  - **Config Package**: Centralized configuration for:
    - [Prettier](https://prettier.io/) - Consistent code formatting
    - [ESLint](https://eslint.org/) - Code quality enforcement
    - [TypeScript](https://www.typescriptlang.org/) - Type safety and developer tooling

- **Continuous Integration**: Predefined [GitHub Actions](https://github.com/features/actions) workflow that:

  - Validates code quality
  - Ensures type safety
  - Verifies build integrity
  - Maintains consistent coding standards

- **Developer Tooling**:
  - [VSCode](https://code.visualstudio.com/) settings for consistent development experience
  - Integrated debugging configurations
  - Recommended extensions

## Tech Stack

### Core Technologies

- **[TurboRepo](https://turbo.build/repo)**: An incremental bundler and build system optimized for JavaScript and TypeScript monorepos. It handles the complexity of managing multiple packages and applications within a single repository.

- **[Next.js](https://nextjs.org/)**: A powerful React framework that provides a robust foundation for building web applications with features like server-side rendering, static site generation, and API routes.

- **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that enhances developer productivity through better tooling and error catching.

- **[Prisma](https://www.prisma.io/)**: A modern database toolkit that provides a type-safe and intuitive way to interact with your database through generated queries.

- **[Storybook](https://storybook.js.org/)**: A UI development environment for building, documenting, and testing components in isolation.

### Environment Management

- **[@t3-oss/env-core](https://github.com/t3-oss/t3-env)**: A library for managing type-safe environment variables across your entire monorepo.

- **[@t3-oss/env-nextjs](https://github.com/t3-oss/t3-env)**: Next.js-specific environment variable validation and typing, ensuring type safety for environment variables in your Next.js applications.

### Development Tools

- **[ESLint](https://eslint.org/)**: A pluggable linting utility that helps maintain code quality and consistency.

- **[Prettier](https://prettier.io/)**: An opinionated code formatter that ensures consistent code style across your project.

- **[cspell](https://cspell.org/)**: A spell checker for code that helps catch spelling errors in identifiers, strings, and comments.

## Project Structure

```
.
├── .github/                  # CI workflows
├── .turbo/                   # TurboRepo configuration
├── .vscode/                  # VSCode settings
├── apps/
│   ├── web/                 # Next.js application
│   └── workshop/            # Storybook application
├── packages/
│   ├── config/             # Shared configurations
│   ├── database/           # Prisma setup
│   └── ui/                 # UI components
├── docker-compose.yml       # Docker services configuration
├── cockroach-data/         # CockroachDB data directory
└── [Configuration Files]
```

### Key Directories and Files

#### `.github/workflows`

Contains CI workflows that perform:

- Spell checking using cspell to maintain code quality
- Linting with ESLint to ensure code consistency
- Type checking with TypeScript to prevent type-related errors
- Build verification to ensure all packages and apps build successfully

#### `apps/web`

Next.js application featuring:

- Type-safe environment variables using @t3-oss/env-nextjs
- Integration with shared UI components
- Scalable architecture for enterprise applications
- Performance optimizations out of the box

#### `apps/workshop`

Storybook application providing:

- Isolated component development environment
- Interactive component testing
- Comprehensive documentation
- Visual regression testing capabilities

#### `packages/`

Shared packages containing:

- `ui`: Reusable component library with optional ShadCN UI integration
- `database`: Prisma ORM configuration and database utilities
- `config`: Centralized tooling configuration for consistent development experience

## Environment Setup

### Development Services

The project uses [Docker](https://www.docker.com/) to manage development services, including the database. The configuration is defined in `docker-compose.yml`:

```yaml
services:
  cockroach:
    container_name: monorepo-starter-cockroach-dev
    image: cockroachdb/cockroach:latest
    restart: always
    ports:
      - '26258:26257'
      - '8082:8080'
    command: start-single-node --insecure
    volumes:
      - '${PWD}/cockroach-data/crdb:/cockroach/cockroach-data'
```

Managing services is simple with the provided scripts:

```bash
# Start the database and other services
pnpm db:start

# Stop all services
pnpm db:stop
```

Service access points:

- CockroachDB UI: http://localhost:8082
- Database port: 26258

You can extend the `docker-compose.yml` to include additional services needed for your development environment, such as Redis, Elasticsearch, or other databases.

### Environment Variables

The project uses [t3-env](https://github.com/t3-oss/t3-env) for type-safe environment variables. Create a `.env` file in the root directory with the following variables:

```bash
# Database connection URL
DATABASE_URL="postgresql://..."

# Add other variables as needed
```

The type safety is enforced through schema definitions:

```typescript
// Schema definition example
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
  },
  runtimeEnv: process.env,
})
```

For Next.js applications, you can use [@t3-oss/env-nextjs](https://github.com/t3-oss/t3-env) which provides additional Next.js-specific validations:

```typescript
// apps/web/env.ts
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  // ... configuration
})
```

## Getting Started

1. Create a new monorepo:

   ```bash
   npx monorepo-starter init
   ```

2. Navigate to project directory:

   ```bash
   cd my-monorepo
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

5. Start development servers:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Prerequisites

- Node.js version >= 22
- Yarn version >= 1.22
- [Docker](https://www.docker.com/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/) (usually included with Docker Desktop)

### Starting Development Environment

1. Start the database:

   ```bash
   pnpm db:start
   ```

2. Start the development servers:

   ```bash
   # Start all apps
   pnpm dev

   # Or start a specific app
   pnpm dev --filter=web
   pnpm dev --filter=workshop
   ```

3. Access services:
   - CockroachDB UI: http://localhost:8082
   - Database port: 26258

### Building Packages

Build all packages and applications:

```bash
pnpm build
```

This command:

- Compiles TypeScript code
- Bundles assets
- Generates necessary files
- Respects dependencies between packages

### Type Checking

Run type checking across the entire monorepo:

```bash
pnpm typecheck
```

### Linting

Lint all files in the monorepo:

```bash
pnpm lint
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

Ensure all workflows pass locally before submitting.

## License

MIT License
