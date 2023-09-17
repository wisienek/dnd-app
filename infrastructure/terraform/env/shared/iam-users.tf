locals {
  users_with_access_keys    = [for account in var.IAM_ACCOUNTS : account.name if account.access_keys]
  users_with_console_access = [for account in var.IAM_ACCOUNTS : account.name if account.console]
  users_with_groups         = [for account in var.IAM_ACCOUNTS : account if length(account.group_names) > 0]
}

#----------------#
#  IAM accounts  #
#----------------#

### Users

resource "aws_iam_user" "iam_users" {
  count = length(var.IAM_ACCOUNTS)

  name          = var.IAM_ACCOUNTS[count.index].name
  force_destroy = true
}

resource "aws_iam_user_login_profile" "login_profiles" {
  count = length(local.users_with_console_access)

  user                    = local.users_with_console_access[count.index]
  password_length         = 20
  password_reset_required = true

  lifecycle {
    ignore_changes = [password_reset_required]
  }
  depends_on = [aws_iam_user.iam_users]
}

resource "aws_iam_access_key" "access_keys" {
  count = length(local.users_with_access_keys)

  user = local.users_with_access_keys[count.index]

  depends_on = [aws_iam_user.iam_users]
}

#--------------#
#  IAM Groups  #
#--------------#

resource "aws_iam_group" "maintainer_dev" {
  name = "maintainer_dev"
  path = "/internal/dev/"
}

resource "aws_iam_group" "restricted_dev" {
  name = "restricted_dev"
  path = "/internal/dev/"
}

resource "aws_iam_group" "pipelines" {
  name = "pipelines"
  path = "/providers/"
}

resource "aws_iam_user_group_membership" "user_groups_membership" {
  count = length(local.users_with_groups)

  user   = element(local.users_with_groups, count.index).name
  groups = element(local.users_with_groups, count.index).group_names

  depends_on = [
    aws_iam_user.iam_users,
    aws_iam_group.maintainer_dev,
    aws_iam_group.restricted_dev,
    aws_iam_group.pipelines,
  ]
}

#----------------#
#  IAM policies  #
#----------------#

## restricted
resource "aws_iam_group_policy_attachment" "restricted_read_only_policy" {
  group      = aws_iam_group.restricted_dev.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

resource "aws_iam_group_policy_attachment" "restricted_read_change_password" {
  group      = aws_iam_group.restricted_dev.name
  policy_arn = "arn:aws:iam::aws:policy/IAMUserChangePassword"
}

## maintainer
resource "aws_iam_group_policy_attachment" "admin_access_maintainer_policy" {
  group      = aws_iam_group.maintainer_dev.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

## ci/cd

# s3
resource "aws_iam_group_policy" "s3_buckets" {
  name   = "S3_Access"
  group  = aws_iam_group.pipelines.name
  policy = data.aws_iam_policy_document.s3_policy.json
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    sid    = "AllowS3"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
    ]
    resources = [
      "*"
    ]
  }
}

# CF
resource "aws_iam_group_policy" "cloudfront" {
  name   = "CF_Access"
  group  = aws_iam_group.pipelines.name
  policy = data.aws_iam_policy_document.cf_policy.json
}

data "aws_iam_policy_document" "cf_policy" {
  statement {
    sid    = "AllowS3"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation"
    ]
    resources = [
      "*"
    ]
  }
}


# ecr
resource "aws_iam_group_policy" "ecr_images" {
  name   = "ECR_Access"
  group  = aws_iam_group.pipelines.name
  policy = data.aws_iam_policy_document.ecr_policy.json
}

data "aws_iam_policy_document" "ecr_policy" {
  statement {
    sid    = "AllowEcr"
    effect = "Allow"
    actions = [
      "ecr:CompleteLayerUpload",
      "ecr:GetAuthorizationToken",
      "ecr:UploadLayerPart",
      "ecr:InitiateLayerUpload",
      "ecr:BatchCheckLayerAvailability",
      "ecr:PutImage",
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
      "ecr:ListImages",
      "ecr:TagResource",
      "ecr:UntagResource",
    ]
    resources = [
      "*"
    ]
  }
}

# ecs
resource "aws_iam_group_policy" "ecs_deployment" {
  name   = "ECS_Access"
  group  = aws_iam_group.pipelines.name
  policy = data.aws_iam_policy_document.ecs_policy.json
}

data "aws_iam_policy_document" "ecs_policy" {
  statement {
    sid    = "AllowEcsDeployment"
    effect = "Allow"
    actions = [
      "ecs:UpdateService",
      "ecs:DescribeServices"
    ]
    resources = [
      "*"
    ]
  }
}


# lambda
resource "aws_iam_group_policy" "lambda_deployment" {
  name   = "Lambda_Access"
  group  = aws_iam_group.pipelines.name
  policy = data.aws_iam_policy_document.lambda_policy.json
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    sid    = "AllowLambdaDeployment"
    effect = "Allow"
    actions = [
      "lambda:UpdateFunctionCode",
      "lambda:GetFunctionConfiguration"
    ]
    resources = [
      "*"
    ]
  }
}
