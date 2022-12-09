resource "google_artifact_registry_repository" "bookstore" {
    provider = google-beta
    location = var.region
    repository_id = "bookstore"
    format = "DOCKER"
}