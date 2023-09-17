data "terraform_remote_state" "shared" {
  backend = "s3"

  config = {
    bucket  = "dnd-app-infra-state"
    key     = "env/shared/main.tfstate"
    region  = "eu-central-1"
    profile = "dnd-agent"
  }
}
