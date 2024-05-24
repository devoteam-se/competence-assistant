variable "project" {
  description = "GCP project ID"
}

variable "service_account" {
  description = "GCP service account email, used to deploy and run images in Cloud Run"
}

variable "app_image" {
  description = "Application image"
  default     = "app"
}

variable "region" {
  description = "GCP region/location"
  default     = "europe-north1"
}

variable "docker_repo" {
  description = "Database migration image registry"
  default     = "docker-repo"
}

variable "db_migration_image" {
  description = "Database migration image"
  default     = "migrate-db"
}

variable "db_user" {
  description = "User for the database"
  default     = "postgres"
}

variable "db_password" {
  description = "Password for the database"
  default     = ""
}

# !Note: If you want to use a custom domain, you need to register the specified service account as a domain owner in the Google Search Console.
variable "custom_domain" {
  description = "Custom domain for the application"
  default     = ""
}


# !Note: See comment in auth.tf before you uncomment this

# variable "oauth" {
#   description = "Identity provider config."
#   type = object({
#     idp_id        = string
#     client_id     = string
#     client_secret = string
#   })
# }
