# Presight Frontend Exercise

Build a small full-stack user directory application. The goal is to evaluate how you design a searchable, filterable, paginated UI backed by persisted data and clear API boundaries.

The application should include:

- A React client.
- A Node.js API server.
- A SQLite database used as the source of truth for user data.
- Docker configuration for running the application locally.

## Scenario

Users need to browse a large directory of people, search by name, and narrow results by nationality and hobbies. The filter sidebar should help users discover useful filters based on the result set they are currently viewing.

## Requirements

### Data Model

Seed a SQLite database with enough records to make pagination, infinite scroll, search, and filter counts meaningful.

Each user should have:

- `avatar`
- `first_name`
- `last_name`
- `age`
- `nationality`
- `hobbies`, from 0 to 10 hobbies per user

Choose a data model that supports the required behavior.

SQLite must be the persisted source of user data.

### API

Expose an API that supports:

- Paginated user results.
- Text filtering from user input across `first_name` and `last_name`.
- Filtering by one or more nationalities.
- Filtering by one or more hobbies.
- Sorting by `first_name`, `last_name`, `age`, and `nationality`.
- Pagination metadata so the client can determine whether more results are available.
- Top 20 hobbies for the active text filter and filter state, including `{ value, count }`.
- Top 20 nationalities for the active text filter and filter state, including `{ value, count }`.

The top 20 values and counts must reflect the currently applied text filter and selected filters, not the global dataset.

Filter semantics:

- Multiple selected hobbies should match users who have all selected hobbies.
- Multiple selected nationalities should match users from any selected nationality.
- Text, hobby, and nationality filters should apply together.

Sorting semantics:

- Sorted results must be deterministic. Use `id` as a final tie-breaker when values are equal.
- Pagination must respect the active sort without duplicate or missing users.

### Client

Build a React interface that includes:

- A text filter input for `first_name` and `last_name`.
- A virtualized, infinitely scrolling list of user cards.
- A sidebar containing the top 20 hobbies and top 20 nationalities for the current result set, including counts.
- Controls for applying and removing hobby and nationality filters.
- Controls for choosing sort field and sort direction.
- Loading, empty, and error states.
- A responsive layout that remains usable on desktop and mobile.

User cards should follow this structure:

```text
|----------------------------------|
| avatar      first_name+last_name |
|             nationality      age |
|                                  |
|             (2 hobbies) (+n)     |
|----------------------------------|
```

Show up to 2 hobbies on the card. If the user has more hobbies, display the remaining count as `+n`.

Use a virtual scroll implementation for the list.

When the text filter or selected filters change, the client must refresh both:

- The paginated user list.
- The top 20 hobbies and nationalities in the sidebar.

The text filter value, selected hobbies, selected nationalities, sort field, and sort direction must be reflected in the URL query string. Reloading or sharing the URL should restore the same view state.

## Implementation Notes

- Keep the database setup easy to run locally.
- Include seed logic or a documented command that creates the SQLite database.
- Include a `Dockerfile` and `docker-compose.yml` that can run the application locally.

## Evaluation Focus

We will pay particular attention to:

- Correct data persistence and API behavior.
- Correct filtering, sorting, pagination, and top 20 counts.
- Smooth infinite scrolling with virtualization.
- URL-synced state.
- Clear loading, empty, and error states.
- Easy local and Docker-based setup.

## Deliverables

Please provide:

- Source code for the React client and Node.js server.
- A `Dockerfile` and `docker-compose.yml`.
- Instructions for running with Docker Compose.

## Implementation Overview

The repository is a Yarn workspace containing:

- `client`: React 19, TypeScript, Vite, `react-virtuoso`, and `nuqs`.
- `server`: Express 5, TypeScript, Zod request validation, and `better-sqlite3`.
- `server/db`: dbmate migrations, the seeded SQLite database, and 1,000 local
  SVG avatars.
- `avatar-generator`: the DiceBear-based script used to generate the checked-in
  avatars.

The database uses normalized `users`, `hobbies`, and `user_hobbies` tables.
The API serves JSON and avatar files, while the production server also serves
the built React application.

## API Reference

The API is available at `http://localhost:3000` by default. All user endpoints
return JSON. No authentication is required.

### List Users

`GET /api/users`

Returns an unfiltered page ordered by `id` ascending.

| Query parameter | Type | Default | Constraints |
| --- | --- | --- | --- |
| `page` | integer | `1` | Greater than `0` |
| `limit` | integer | `20` | From `1` to `100` |

```bash
curl "http://localhost:3000/api/users?page=1&limit=20"
```

### Query Users

`POST /api/users/query`

Accepts a JSON body with pagination, filters, and sorting:

```json
{
  "page": 1,
  "limit": 20,
  "name": "aisha rah",
  "nationalities": ["Emirati", "Indian"],
  "hobbies": ["Reading", "Chess"],
  "sortBy": {
    "lastName": "ASC"
  }
}
```

| Field | Type | Default | Constraints and behavior |
| --- | --- | --- | --- |
| `page` | integer | `1` | Greater than `0` |
| `limit` | integer | `20` | From `1` to `100` |
| `name` | string | omitted | Up to 200 characters; case-insensitive substring match against the combined first and last name |
| `nationalities` | string array | omitted | Up to 100 non-empty values; a user may match any selected value |
| `hobbies` | string array | omitted | Up to 100 non-empty values; a user must have every selected value |
| `sortBy` | object | omitted | Keys are `firstName`, `lastName`, `age`, or `nationality`; values are `ASC` or `DESC` |

Empty filter arrays have no effect. If multiple sort keys are supplied, they
are applied in this order: `firstName`, `lastName`, `age`, `nationality`.
Every result sort ends with `id ASC` as a deterministic tie-breaker. With no
`sortBy`, results are ordered by `id ASC`.

```bash
curl -X POST "http://localhost:3000/api/users/query" \
  -H "Content-Type: application/json" \
  -d '{"page":1,"limit":20,"name":"aisha","hobbies":["Reading"],"sortBy":{"firstName":"ASC"}}'
```

Both user-list endpoints return the same response shape:

```json
{
  "users": [
    {
      "id": 1,
      "avatar": "/avatars/1.svg",
      "first_name": "Aisha",
      "last_name": "Rahman",
      "age": 34,
      "nationality": "Emirati",
      "hobbies": ["Chess", "Reading"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3,
    "hasNextPage": true
  }
}
```

### Get Filter Options

`POST /api/users/filter-options`

Accepts the same `name`, `nationalities`, and `hobbies` fields as the query
endpoint. Pagination and sorting are not used. The response contains up to 20
hobbies and 20 nationalities among users matching the complete active filter
state.

```bash
curl -X POST "http://localhost:3000/api/users/filter-options" \
  -H "Content-Type: application/json" \
  -d '{"name":"aisha","nationalities":["Emirati"]}'
```

```json
{
  "hobbies": [
    {"value": "Reading", "count": 12},
    {"value": "Chess", "count": 9}
  ],
  "nationalities": [
    {"value": "Emirati", "count": 18}
  ]
}
```

Facet values are ordered by count descending and then value ascending. Counts
are not global: text, hobby, and nationality filters are all applied before
the facets are calculated.

### Avatars and Errors

Avatar paths returned on users are served from `GET /avatars/:id.svg`.

Invalid query parameters or request bodies return HTTP `400`:

```json
{
  "error": "Invalid request.",
  "issues": {}
}
```

Unexpected server errors return HTTP `500` with
`{"error":"Internal server error."}`.

## Run With Docker

Docker Compose is the supported way to run the application. It builds and
starts the React client and Express API as a single container; no local Node.js
installation or database setup is required.

From the repository root, build and start the application:

```bash
docker compose up --build
```

or

to reset cached scripts
```bash
docker compose up --build --force-recreate
```

Open http://localhost:3000. Express serves the Vite client, API, and avatar
files from the same origin, so no client API URL configuration is needed.

Run in the background with `docker compose up --build -d`, view logs with
`docker compose logs -f`, and stop the application with `docker compose down`.

## Run Locally

Local development requires Node.js 22 and Yarn. Install all workspace
dependencies from the repository root:

```bash
yarn install --frozen-lockfile
```

Build and start the API in one terminal:

```bash
yarn workspace presight-server build
yarn workspace presight-server start
```

Start the Vite development server in another terminal:

```bash
yarn workspace client dev
```

Open http://localhost:5173. The development client uses `client/.env` to send
API requests to `http://localhost:3000`; CORS is enabled by the API.

### Configuration

| Variable | Used by | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | API | `3000` | Express listen port |
| `DATABASE_PATH` | API | `db/app.sqlite3` | SQLite path, relative to `server` when not absolute |
| `DATABASE_URL` | dbmate | `sqlite:db/app.sqlite3` in `server/.env` | Migration database URL |
| `VITE_API_URI` | Client | Empty in production | API origin; an empty value uses the current origin |

The Docker image sets production values itself; no environment file is needed
for the Compose workflow.

## URL State

The client stores its active view in the browser query string:

- `name`: text search.
- `sort`: `firstName`, `lastName`, `age`, or `nationality`.
- `direction`: `ASC` or `DESC`.
- `hobby`: repeat the parameter to select multiple hobbies.
- `nationality`: repeat the parameter to select multiple nationalities.

For example:

```text
http://localhost:3000/?name=aisha&sort=age&direction=DESC&hobby=Reading&hobby=Chess&nationality=Emirati
```

## Database Migrations

The server supports database migrations through dbmate. The migration scripts
are in `server/db/migrations` and include both the schema and seed data.

Run migration commands from the repository root:

```bash
yarn workspace presight-server db:status
yarn workspace presight-server db:migrate
yarn workspace presight-server db:rollback
```

The checked-in SQLite database at `server/db/app.sqlite3` was already created
and populated by these migrations. Docker copies that ready-to-use database,
along with the 1,000 avatar files, into the image during the build, so no
migration or seed command is needed to run the application.

The seed migration creates 1,000 users with 0 to 10 hobbies each. Seed values
are randomized when the migration runs, while avatar paths remain aligned to
user IDs.

## Checks

The repository currently provides build checks for both TypeScript
applications and ESLint for the client:

```bash
yarn workspace presight-server build
yarn workspace client build
yarn workspace client lint
```
