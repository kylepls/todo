# Todo App

A modern, feature-rich todo application built with Next.js, TypeORM, and Mantine UI.

## Features

- Create and manage todo items with titles and descriptions
- Set priority levels (Low, Medium, High, Critical)
- Track status (Created, Pending, Work in progress, Blocked by, Completed)
- Add comments to todo items
- Set need-by dates for todos
- Link todos together with blocked-by relationships
- View completion statistics with a 7-day chart
- Fast initial page loads with aggressive caching
- Background data updates for always-fresh information
- Beautiful dark theme UI with shadcn styling

### Production Features

- Structured JSON logging with Pino
- OpenMetrics/Prometheus metrics endpoint
- Environment variable configuration
- Configurable data directory
- Request timing and operation metrics
- Health check endpoints

See [PRODUCTION.md](./PRODUCTION.md) for production deployment guide.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with TypeORM
- **UI Components**: Mantine UI with custom shadcn theme
- **Charts**: Recharts for completion visualization
- **Styling**: CSS Modules with Mantine theming
- **Date Handling**: dayjs
- **Logging**: Pino (structured JSON logging)
- **Metrics**: prom-client (Prometheus/OpenMetrics)

## Getting Started

### 1. Install Dependencies

See DEPENDENCIES.md for the complete installation command:

```bash
yarn add @mantine/core @mantine/hooks @mantine/notifications recharts typeorm better-sqlite3 reflect-metadata dayjs
```

### 2. Configure Environment (Optional)

Copy the example environment file and customize:

```bash
cp .env.example .env.local
```

Available environment variables:
- `DATA_DIR` - Directory where SQLite database is stored (default: current directory)
- `LOG_LEVEL` - Logging level: debug, info, warn, error (default: info)
- `NODE_ENV` - Environment: development or production
- `PORT` - Server port (default: 3000)

### 3. Run the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Build for Production

```bash
yarn build
yarn start
```

For production deployment instructions, see [PRODUCTION.md](./PRODUCTION.md).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── todos/              # Todo CRUD endpoints
│   │   └── stats/              # Statistics endpoints
│   ├── todos/[id]/             # Todo detail page
│   ├── theme.ts                # Mantine theme configuration
│   ├── cssVariableResolver.ts  # CSS variables for theming
│   ├── styles.css              # Custom component styles
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Main todo list page
└── lib/
    ├── entities/
    │   ├── Todo.ts             # Todo entity
    │   └── Comment.ts          # Comment entity
    └── data-source.ts          # TypeORM configuration

```

## Database Schema

### Todo
- id (auto-increment)
- title (string)
- description (string)
- status (enum)
- priority (enum)
- need_by_date (date, nullable)
- blocked_by_id (foreign key, nullable)
- completed_at (datetime, nullable)
- created_at (auto-timestamp)
- updated_at (auto-timestamp)

### Comment
- id (auto-increment)
- todo_id (foreign key)
- content (string)
- created_at (auto-timestamp)

## API Endpoints

### Todo Operations
- `GET /api/todos` - List all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get todo details with comments
- `PATCH /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

### Comments
- `POST /api/todos/[id]/comments` - Add a comment to a todo
- `PATCH /api/todos/[id]/comments/[commentId]` - Update a comment
- `DELETE /api/todos/[id]/comments/[commentId]` - Delete a comment

### Statistics & Monitoring
- `GET /api/stats/completion?days=7` - Get completion statistics
- `GET /api/metrics` - Prometheus/OpenMetrics endpoint

## Caching Strategy

The app implements aggressive caching for blazing fast initial loads:

1. Data is cached in localStorage on first load
2. Cached data is displayed immediately
3. Fresh data is fetched in the background
4. UI updates seamlessly when fresh data arrives

This ensures the app feels instant while always staying up to date.
