resource "random_password" "password" {
  count       = var.db_password != "" ? 0 : 1
  length      = 16
  special     = true
  min_upper   = 1
  min_lower   = 1
  min_numeric = 1
  # Use URI-safe characters for the password
  # in order to avoid encoding issues with db migration job
  # which needs a db url
  override_special = "-._~"
}

locals {
  db_password = var.db_password != "" ? var.db_password : random_password.password[0].result
}

resource "google_secret_manager_secret" "postgres_user" {
  provider   = google
  secret_id  = "POSTGRES_USER"
  depends_on = [google_project_service.default]

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_user_secret" {
  provider    = google
  secret      = google_secret_manager_secret.postgres_user.id
  secret_data = var.db_user
}

resource "google_secret_manager_secret" "postgres_password" {
  provider   = google
  secret_id  = "POSTGRES_PASSWORD"
  depends_on = [google_project_service.default]

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password_secret" {
  provider    = google
  secret      = google_secret_manager_secret.postgres_password.id
  secret_data = var.db_password
}
