variable "region" {
  description = "GCP region/location"
  default     = "europe-north1"
}

variable "project" {
  description = "GCP project ID"
  default     = "my-competence-assistant"
}

variable "docker_repo" {
  description = "Docker repository ID"
  default     = "docker-repo"
}

variable "state_bucket" {
  description = "Name of the GCS bucket to store Terraform state"
}

variable "billing_account" {
  description = "GCP billing account ID"
}

variable "org" {
  description = "GCP organization ID"
}

variable "service_account" {
  description = "Service account ID"
}