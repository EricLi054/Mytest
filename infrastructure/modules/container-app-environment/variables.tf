variable "name" {
  type = string
}

variable "KeyVaults" {
  type = map(any)
}

variable "configurationStores" {
  type = map(any)
}

variable "workspaces" {
  type = map(any)
}

variable "appInsights" {
  type = map(object({
    location          = string
    resourceGroupName = string
    applicationType   = string
    workspace         = string
    tags              = optional(map(string), {})
  }))
}

variable "webTests" {
  type = map(object({
    resourceGroupName = string
    location          = string
    appInsightsName   = string
    geoLocations      = list(string)
    enabled           = optional(bool, true)
    frequency         = optional(number, 300)
    retryEnabled      = optional(bool, true)
    timeout           = optional(number, 30)
    request = object({
      url                           = string
      body                          = optional(string, null)
      followRedirectsEnabled        = optional(bool, false)
      httpVerb                      = optional(string, "GET")
      parseDependentRequestsEnabled = optional(bool, false)
      headers                       = optional(map(object({})), {})
      keyVaultHeaders               = optional(map(object({
        name = string
        secretName = string
        vaultName  = string
      })), {})
    })
    validationRules = object({
      expectedStatusCode       = optional(number, 200)
      sslCertRemainingLifetime = optional(number, null)
      sslCheckEnabled          = optional(bool, false)
      content = optional(object({
        contentMatch    = string
        ignoreCase      = optional(bool, false)
        passIfTextFound = optional(bool, true)
      }), null)
    })
    tags = optional(map(string), {})
  }))
}

variable "actionGroups" {
  type = map(object({
    resourceGroupName = string
    shortName         = string
    emailReceivers = optional(map(object({
      emailAddress         = string
      useCommonAlertSchema = optional(bool, false)
    })), {})
    webhookReceivers = optional(map(object({
      secretName           = string
      vaultName            = string
      useCommonAlertSchema = optional(bool, false)
    })), {})
    tags = optional(map(string), {})
  }))
}

variable "webTestAlerts" {
  type = map(object({
    resourceGroupName   = string
    webTest             = string
    appInsightsName     = string
    failedLocationCount = number
    actionGroupName     = string
    tags                = optional(map(string), {})
    enabled             = optional(bool, true)
    severity            = optional(number, 3)
  }))
}

variable "queryAlerts" {
  type = map(object({
    resourceGroupName         = string
    resourceGroupNameLocation = string
    workspace                 = string
    query                     = string
    actionGroupName           = string
    evaluationFrequency       = string
    windowDuration            = string
    severity                  = string
    timeAggregationMethod     = string
    threshold                 = number
    operator                  = string
    failingPeriods = object({
      numberOfEvaluationPeriods = optional(number, 1)
      minFailingPeriodsToAlert  = optional(number, 1)
    })
    tags    = optional(map(string), {})
    enabled = optional(bool, true)
  }))

}

variable "userAssignedIdentities" {
  type = map(any)
}

variable "managedEnvironments" {
  type = map(any)
}

variable "redis" {
  type = map(any)
}
