variable "name" {
  type = string
}

variable "resourceGroupName" {
  type = string
}

variable "managedEnvironmentName" {
  type = string
}

variable "keyVaultName" {
  type = string
}

variable "appConfigName" {
  type = string
}

variable "appInsightsName" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "properties" {
  # type = map(any)
}

variable "identity" {
  type = object({
    type                   = string
    userAssignedIdentities = list(string)
  })
}

variable "image_version" {
  description = "Image version to use for the container"
  type        = string
  default     = "latest"
}

variable "pr_instance" {
  description = "Is this a PR instance of the container app"
  type        = bool
  default     = false
}

variable "prInstanceSlot" {
  description = "Which PR Instance Slot to deploy to"
  type        = string
  default     = ""
}