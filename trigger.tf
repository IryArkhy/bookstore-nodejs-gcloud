resource "google_cloudbuild_trigger" "production" {
    provider = google-beta
    name = "production"

    github {
        name = var.github_repository
        owner = var.github_owner
        push {
            branch = var.github_branch
        }
    }

    substitutions = {
        _REGISTRY       = europe-central2-docker.pkg.dev.bookstore-api-370618.bookstore
        _REGISTRY_URL   = "${var.region}-docker.pkg.dev"
    }

    filename = "cloudbuild.yaml"
}