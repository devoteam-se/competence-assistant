# Terraform

## First time setup

When setting up a new project on GCP we need to a few one-time steps to get the project ready for continuous deployment.
We need to:

- Create a GCP project, which needs to be connected to a billing account and an organization (or folder).
- Add a Service account with Editor role to manage resources in the project.
- Add a Storage bucket to store the terraform state for deployments.
- Add Docker repository to store the container images.
- Enable the required APIs for the project.

A Terraform script is provided under `terraform/first-time-setup` to automate these steps.

## Continuous Deployment

The infrastructure of the application consists of:

- Cloud SQL instance for the database (Postgres)
- Cloud Run service for the application
- Cloud Run job for running migrations

Terraform is used to manage the infrastructure as well as to point cloud run to the correct image version.

The Terraform script is located under `terraform/cd`.
