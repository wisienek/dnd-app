locals {
  env         = "prod"
  base_domain = "dnd-apps.com"
}

provider "aws" {
  profile = "dnd-agent"
  region  = "eu-central-1"

  default_tags {
    tags = {
      env       = local.env
      terraform = "true"
      version   = 1
    }
  }
}

terraform {
  backend "s3" {
    bucket  = "dnd-app-infra-state"
    key     = "env/prod/main.tfstate"
    region  = "eu-central-1"
    profile = "dnd-agent"

    dynamodb_table = "terraform-infra-locks"
    encrypt        = true
  }
}
