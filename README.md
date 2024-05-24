# Competence Assistant

Competence Assistant is a tool to manage competence events. Admins can create events and schedules. Other users can create and vote for sessions.

## Documentation

- [Server](server/README.md)
- [Client](client/README.md)
- [infra](terraform/README.md)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v20 (LTS)
- [pnpm](https://pnpm.io/) v7
- [PostgreSQL](https://www.postgresql.org/) v14
- [dbmate](https://github.com/amacneil/dbmate) (optional)

### Getting Started

#### 1. Install Dependencies

Run in project root:

```sh
pnpm install
```

#### 2. Set Up Database

1. Copy [`server/.env.example`](server/.env.example) to `server/.env`.

2. Edit the username, password, and/or database name in `.env`.

   - **Note:** Make sure `DATABASE_URL` reflects the `POSTGRES_*` values.
   - **Note:** The password must be at least 1 character long.

3. Start the PostgreSQL server.
   A docker-compose file is provided in the `server` directory including PostgreSQL and adminer. To start the database run:

   ```sh
   cd server
   docker compose up -f db.compose.yml -d
   ```

4. Create a user with the name and password in your `.env` file, if one does not exist.
   <details>
   <summary>CLI example</summary>

   ```sh
   psql --dbname=postgres --command="CREATE USER <username> WITH PASSWORD '<password>' CREATEDB;"
   ```

   _(Replace `<username>` and `<password>` with the username and password, respectively.)_
   </details>

5. Create the database if needed and set up the schema. Run in project root:

   ```sh
   pnpm migrate up
   ```

6. Populate the database with mock data. Run in project root:

   ```sh
   pnpm --filter server cli mock
   ```

#### 3. Configure the Frontend

The frontend uses Vite as the build tool, which in turn injects environment variables using [build modes](https://vitejs.dev/guide/env-and-mode#modes)

1. Copy [`client/.env.example`](client/.env.example) to `client/.env.local`.
2. Add your Firebase project variables for `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_AUTH_DOMAIN`.
3. Change the value of `VITE_API_URL` in `.env.local` to `http://localhost:3000/api/`.

#### 4. Run the App

1. Run in project root to start firebase auth emulator, server and client:

   ```sh
   pnpm dev
   ```

2. Open a browser to <http://localhost:5173>.

---

### Useful Scripts

Run firebase auth emulator and server

```sh
pnpm dev:server
```

Run client against remote prod api

```sh
pnpm dev:client:prod
```

### Deployment

The application is packaged as a docker image and deployed to Google Cloud Run using Terraform.

The deplyment steps below assume that:

- The first time setup outlined in the [Terraform README](terraform/README.md) is completed.
- You are using Google Cloud Artifact Registry to store the docker images.

#### 1. Configure frontend for production

Copy [`client/.env.example`](client/.env.example) to `client/.env.production`and specify the production variables.

_**Note**: If you are using a custom domain you need to set the `VITE_API_URL` to `https://<your-domain>/api/`. If not it should be set to the Cloud Run url, which unfortunately is not known until after the deployment. This means that you will have to update the `.env.production` file after the deployment, and do another deployment._

#### 2. Build & push the application docker image

```sh
docker build --tag <region>-docker.pkg.dev/<gcp-project-id>/<docker-repo>/<app-image> --build-arg BUILD_MODE=production .
docker push <region>-docker.pkg.dev/<gcp-project-id>/<docker-repo>/<app-image>
```

#### 2. build & push the db migration docker image

```sh
cd server
docker build --tag <region>-docker.pkg.dev/<gcp-project-id>/<docker-repo>/<db-image> -f db.Dockerfile .
docker push <region>-docker.pkg.dev/<gcp-project-id>/<docker-repo>/<db-image>
```

#### 3. Deploy the application

```sh
cd terraform/cd
terraform apply
```

### GitHub Actions

Example workflows for CI/CD are located in the `.github/workflows` directory. In order to trigger a deployment on a push to the main branch, a trigger is needed.

Example:

```yaml
name: Test and Deploy on push to main

on:
  push:
    branches: [main]

jobs:
  ci:
    name: CI
    uses: ./.github/workflows/lint-and-test.yaml

  cd:
    name: CD
    needs: ci
    uses: ./.github/workflows/gcp-deploy.yaml
    with:
      BUILD_ENV: development
    secrets: inherit
```

The provided workflows use [environment specific](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) variables and secrets that need to be set in the repository settings.

Variables:

- `TF_STATE_BUCKET` The GCS bucket where the terraform state is stored
- `SERVICE_ACCOUNT` The service account email used to authenticate with GCP
- `BUILD_MODE` The vite build mode which determines the `.env.[mode]` file to use
- `PROJECT_ID` The GCP project id
- `REGION` The GCP region
- `DOCKER_REPO` The name of the docker repository where the images are stored
- `APP_IMAGE` The name of the application image
- `DB_MIGRATION_IMAGE` The name of the db migration image
- `CUSTOM_DOMAIN` (optional) The custom domain for the application

Secrets:

- `GCP_CREDENTIALS` The service account key file used to authenticate with GCP
- `DB_USER` (optional) The database user, defaults to `postgres`
- `DB_PASSWORD` (optional) The database password, generated if not set
