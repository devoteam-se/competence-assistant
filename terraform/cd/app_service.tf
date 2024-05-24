resource "google_cloud_run_v2_service" "app" {
  provider   = google
  name       = var.project
  location   = var.region
  ingress    = "INGRESS_TRAFFIC_ALL"
  depends_on = [google_project_service.default]


  template {
    service_account = var.service_account

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.instance.connection_name]
      }
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project}/${var.docker_repo}/${var.app_image}"

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      env {
        name = "POSTGRES_USER"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.postgres_user.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "POSTGRES_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.postgres_password.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "POSTGRES_HOST"
        value = "/cloudsql/${google_sql_database_instance.instance.connection_name}"
      }
      env {
        name  = "POSTGRES_DATABASE"
        value = "postgres" # default database name, if you want a different db, you can create one using google_sql_database resource
      }
      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project
      }
    }
  }
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_v2_service.app.location
  project     = google_cloud_run_v2_service.app.project
  service     = google_cloud_run_v2_service.app.name
  policy_data = data.google_iam_policy.noauth.policy_data
  depends_on  = [google_cloud_run_v2_service.app]
}

resource "google_cloud_run_domain_mapping" "default" {
  count      = var.custom_domain != "" ? 1 : 0
  provider   = google
  location   = var.region
  name       = var.custom_domain
  depends_on = [google_cloud_run_v2_service.app]

  metadata {
    namespace = google_cloud_run_v2_service.app.project
  }

  spec {
    route_name = google_cloud_run_v2_service.app.name
  }

}
