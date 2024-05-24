# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.25.0"
    }
  }
}

provider "google-beta" {
  region                = var.region
  project               = google_project.default.project_id
  user_project_override = true
}

# Configures the provider to not use the resource block's specified project for quota checks.
# This provider should only be used during project creation and initializing services.
provider "google" {
  alias                 = "no_user_project_override"
  region                = var.region
  user_project_override = false
}

resource "google_project" "default" {
  provider        = google.no_user_project_override
  project_id      = var.project
  name            = var.project
  org_id          = var.org
  billing_account = data.google_billing_account.default.id

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "serviceusage.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id
}
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = google_project.default.project_id
  display_name = var.project
}

# Creates a storage bucket to store the terraform state.
resource "google_storage_bucket" "tf_state_bucket" {
  project       = google_project.default.project_id
  name          = var.state_bucket
  location      = var.region
  force_destroy = false

  versioning {
    enabled = true
  }
}

# Needs to be created before first deployment
# in order for the deployment script to be able to upload images
# for cloud run services.
resource "google_artifact_registry_repository" "docker_repository" {
  project       = google_project.default.project_id
  location      = var.region
  repository_id = var.docker_repo
  format        = "DOCKER"
  cleanup_policies {
    id     = "keep_last_10"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10
    }
  }
}

# Service account used to create resources and deploy images.
resource "google_service_account" "sa" {
  project      = google_project.default.project_id
  account_id   = var.service_account
  display_name = var.service_account
}

resource "google_project_iam_member" "sa_editor" {
  project = google_project.default.project_id
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.sa.email}"
}
