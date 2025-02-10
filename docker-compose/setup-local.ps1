# Log in to Azure (if not already logged in)
az login -o none --only-show-errors

# Set variables for the Azure subscription, App Configuration, and Key Vault
$subscription = "digital-npe"
$appConfigName = "next-rac-appconfig-sit"
$keyVaultName = "next-rac-vault-sit"

# Set the subscription for the Azure account
az account set --subscription $subscription

# Retrieve all key-values from the Azure App Configuration
$keyValues = az appconfig kv list --name $appConfigName --query "[].{key:key, value:value}" --output json | ConvertFrom-Json

# Clear the redis-set.txt file before starting the loop
"" | Set-Content -Path ./local-data/redis-set.txt

# Loop through the key-values and generate Redis SET commands
foreach ($kv in $keyValues) {
    $key = $kv.key
    $value = $kv.value

    # Check if the value is a JSON string that needs to be unescaped
    if ($value -match '^"\\{.*\\}"$') {
        # Convert the escaped JSON string to a PowerShell object
        $jsonObject = $value | ConvertFrom-Json
        # Convert the object back to a JSON string with proper escaping
        $value = $jsonObject | ConvertTo-Json -Compress
    }

    # Replace newlines and carriage returns with spaces
    $value = $value -replace "`r`n", ' ' -replace "`n", ' '
    # Remove multiple consecutive spaces
    $value = $value -replace '\s+', ' '

    # Generate the Redis SET command and write it to redis-set.txt
    "SET `"$key`" `"$value`"" | Add-Content -Path ./local-data/redis-set.txt
}


# Get the list of all secrets in the Key Vault
$secretsList = az keyvault secret list --vault-name $keyVaultName --query "[].id" --output tsv

# Create a hashtable to store secrets
$secrets = @{}

# Loop through each secret ID and retrieve the secret value
foreach ($secretId in $secretsList) {
    $secretName = [System.IO.Path]::GetFileName($secretId)
    $secretValue = az keyvault secret show --id $secretId --query "value" --output tsv
    # Add the secret to the hashtable
    $secrets[$secretName] = $secretValue
}

# Convert the hashtable to a JSON object and save it to secrets.json
$secrets | ConvertTo-Json | Set-Content -Path ./local-data/secrets.json
