resource "google_sql_database_instance" "instance" {
  provider            = google
  name                = "prod"
  database_version    = "POSTGRES_14"
  deletion_protection = true

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled    = true
      start_time = "00:00"
      location   = var.region

      backup_retention_settings {
        retained_backups = 5
      }
    }
  }
}

resource "google_sql_user" "user" {
  provider = google
  name     = var.db_user
  password = local.db_password
  instance = google_sql_database_instance.instance.name
}
