resource "google_cloud_run_v2_job" "migrate-db-job" {
  provider   = google
  name       = "migrate-db"
  location   = var.region
  depends_on = [google_project_service.default, google_sql_database_instance.instance]

  template {
    template {
      service_account = var.service_account
      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [google_sql_database_instance.instance.connection_name]
        }
      }
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project}/${var.docker_repo}/${var.db_migration_image}"
        args  = ["up"]
        volume_mounts {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
        env {
          name  = "DATABASE_URL"
          value = "postgres://${var.db_user}:${local.db_password}@host:5432/postgres?host=/cloudsql/${google_sql_database_instance.instance.connection_name}"
        }
      }
    }
  }
}
