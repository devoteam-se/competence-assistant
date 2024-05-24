locals {
  cloud_run_uri = replace(google_cloud_run_v2_service.app.uri, "/(^https://)/", "")

  default_domains = [
    "localhost",
    "${var.project}.firebaseapp.com",
    "${var.project}.web.app",
    local.cloud_run_uri,
  ]

  domains = var.custom_domain != "" ? concat(local.default_domains, [var.custom_domain]) : local.default_domains
}

# Enables required APIs.
resource "google_project_service" "auth" {
  provider = google
  for_each = toset([
    "securetoken.googleapis.com",
    "identitytoolkit.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Creates an Identity Platform config.
# Also enables Firebase Authentication with Identity Platform in the project.
resource "google_identity_platform_config" "default" {
  provider           = google
  authorized_domains = local.domains
  depends_on         = [google_project_service.auth]
}

# !Note: in order to enable sign-in with identity providers, you need to create an OAuth client for that provider.
# Which in turn requires you to set up a consent screen in the Google Cloud Console.
# This cannot be automated with Terraform as of now. So you need to do this manually.
# When that is done, you can enable the provider like this:

# resource "google_identity_platform_default_supported_idp_config" "default" {
#   idp_id        = var.oauth["idp_id"]
#   client_id     = var.oauth["client_id"]
#   client_secret = var.oauth["client_secret"]
# }
