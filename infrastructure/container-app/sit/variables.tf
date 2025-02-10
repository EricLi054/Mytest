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

variable "image_version" {
  description = "Image version to use for the container"
  type        = string
  default     = "latest"
}
