output "ecs_agent_instance_profile" {
  value = aws_iam_instance_profile.ecs_agent
}

output "ecs_task_execution_role" {
  value = aws_iam_role.ecs_task_execution_role
}

output "access_keys" {
  sensitive = true
  value = {
    console : [
      for profile in aws_iam_user_login_profile.login_profiles : {
        username : profile.id
        password : profile.password
      }
    ]
    cli : [
      for key in aws_iam_access_key.access_keys : {
        user       = key.user
        access_key = key.id
        secret_key = key.secret
      }
    ]
  }
}
