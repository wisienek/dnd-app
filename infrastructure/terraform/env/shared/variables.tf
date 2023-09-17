variable "DEFAULT_REGION" {
  default = "eu-central-1"
}

variable "ENV" {
  default = "shared"
}

variable "IAM_ACCOUNTS" {
  type = list(object({
    name        = string
    group_names = list(string)
    access_keys = bool
    console     = bool
  }))

  default = [
    {
      name : "dev.wisienek@gmail.com",
      group_names : ["maintainer_dev"],
      access_keys : true,
      console : true
    },
    {
      name : "nszwargot@gmail.com",
      group_names : ["restricted_dev"],
      access_keys : false,
      console : true
    },
    {
      name : "github_agent",
      group_names : ["pipelines"],
      access_keys : true,
      console : false
    },
  ]
}
