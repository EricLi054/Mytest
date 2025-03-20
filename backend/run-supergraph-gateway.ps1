$projects = @(
    "./subgraphs/Insurance/Insurance.csproj",
    "./subgraphs/Membership/Membership.csproj",
    "./subgraphs/Motoring/Motoring.csproj",
    "./subgraphs/Person/Person.csproj"
)

$ports = @(5001, 5002, 5003, 5004)
$processes = New-Object System.Collections.ArrayList

function CleanupProcesses {
    foreach ($process in $processes) {
        if (!$process.HasExited) {
            $process.Kill()
        }
    }
}

function WaitForPort {
    param (
        [int]$port,
        [int]$timeout = 60
    )

    $startTime = Get-Date
    while ((Get-Date) - $startTime -lt (New-TimeSpan -Seconds $timeout)) {
        try {
            $tcpClient = New-Object System.Net.Sockets.TcpClient("127.0.0.1", $port)
            $tcpClient.Close()
            return $true
        } catch {
            Start-Sleep -Seconds 1
        }
    }
    return $false
}

Register-EngineEvent PowerShell.Exiting -Action { CleanupProcesses }

try {
    $location = Get-Location
    
    if ($location.Path.EndsWith("backend") -eq $false) {
        Set-Location './backend'
    }

    foreach ($project in $projects) {
        $startProcessArgs = @{
            FilePath = "dotnet"
            ArgumentList = "run --project $project --configuration Debug --no-build"
            PassThru = $true
        }

        $process = Start-Process @startProcessArgs
        [void]$processes.Add($process)
    }

    foreach ($port in $ports) {
        if (-not (WaitForPort -port $port)) {
            throw "Port $port did not open in time."
        }
    }

    $pnpmProcess = Start-Process -FilePath "pnpm" -ArgumentList "--prefix ./gateway serve" -PassThru
    [void]$processes.Add($pnpmProcess)

    if (-not (WaitForPort -port 4000)) {
        throw "Port 4000 did not open in time."
    }

    Start-Process "http://127.0.0.1:4000/graphql"

    $pnpmProcess.WaitForExit()

} catch {
    CleanupProcesses
} finally {
    Write-Host "Local Supergraph Gateway has been terminated."
    CleanupProcesses
}