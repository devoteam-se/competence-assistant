# Server

The system design is heavily inspired by [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) and [Layered Architecture](https://en.wikipedia.org/wiki/Multitier_architecture) concepts.

![sysarch](https://user-images.githubusercontent.com/7569192/194871740-3dfcc7b0-055c-4385-aca6-98a077570e05.png)

- **Controller** - Handling requests, parsing and data validation.
- **Service** - Contains the business logic.
- **Repository** - Data layer managing communication with the database.

## Folder structure

```typescript
├── src
│   ├── app  // application configuration, DI and setup
│   ├── core // holds all domain packages
│   │   ├── domain1
│   │   │   ├── http      // transport/presenter layer handling data I/O, validation and routing.
│   │   │   ├── repo      // data layer managing data fetching from db, cache etc.
│   │   │   ├── mocks     // mocks for testing
│   │   │   ├── service   // buisness logic layer
│   │   │   └── domain.ts // domain entities, interfaces and type definitions
│   │   ├── domain2
│   │   └── ...
│   ├── pkg // foundation packages for supporting core packages with db, logging, auth etc.
│   │   ├── db          // db connection, migrations and helpers
│   │   ├── error       // internal error definitions
│   │   ├── logger      // logger setup
│   │   ├── middleware  // middlewares handling permissions, logging, auth etc.
│   │   ├── web         // response renderer for processing responses
│   │   └── ...
│   ├── cli.ts   // cli for creating users and generating jwts for server side development
│   └── index.ts // application entrypoint
└── README.md
```

## Requirements

- [pnpm](https://pnpm.io/)
- [Node](https://nodejs.org/) v20 (LTS)
- [dbmate](https://github.com/amacneil/dbmate) (Optional)

## Database

### Seup

### Migrations

Database migrations is handled using [dbmate](https://github.com/amacneil/dbmate) and can be run using cli or docker. Migration files can be found in `src/pkg/db/migrations`.

#### Using dbmate cli

Migrate to latest database version

```sh
pnpm migrate up
```

Rollback one version

```sh
pnpm migrate rollback
```

Create new migration file

```sh
pnpm migrate new <name>
```

#### Using Docker

```sh
docker run --rm -it --network=host -v "$(pwd)/src/pkg/db:/db" --env-file=.env ghcr.io/amacneil/dbmate:1 --no-dump-schema <COMMAND>
```

### Access Prod DB

Prod database can be accessed using the gcloud cli by installing the following component

```sh
gcloud components install cloud_sql_proxy
```

**WARNING**: This is the production database and should not be manipulated manually

```sh
cloud_sql_proxy -instances=<your-gcp-project-id>:<gcp-region>:prod=tcp:5432
```
