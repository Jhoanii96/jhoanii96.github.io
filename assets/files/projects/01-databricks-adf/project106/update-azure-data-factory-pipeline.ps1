## 1: Global parameters
$subscriptionId = "********-****-****-****-************"
$resourceGroup = "*******************"
$dataFactoryName = "*********************"
$oldPath = "/DatabricksRepo/"
$newPath = "/DatabricksRepoUC/"

## 2: Login
Connect-AzAccount
Start-Sleep -Seconds 1

## 3: Get Token for getting pipeline by name
$token = (Get-AzAccessToken -ResourceUrl "https://management.azure.com").Token
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}
$apiVersion = "2018-06-01"

## 4: Get list of pipelines
$pipelines = Get-AzDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroup

## 5: Loop list
foreach ($pipeline in $pipelines) {

    ## Get pipeline by name
    Write-Output "`n================ Processing Pipeline: $($pipeline.Name) ================"
    $pipeline_uri = "https://management.azure.com/subscriptions/$($subscriptionId)/resourceGroups/$($resourceGroup)/providers/Microsoft.DataFactory/factories/$($dataFactoryName)/pipelines/$($pipeline.Name)?api-version=$($apiVersion)"
    $pipeline_response = Invoke-RestMethod -Uri $pipeline_uri -Method Get -Headers $headers
    $activities = $pipeline_response.properties.activities
    $modified = $false

    ## Function of loop Activities
    function Process-Activities {
        param([array]$activities)
        foreach ($activity in $activities) {
            # If the activity is a DatabricksNotebook, update its notebookPath.
            if ($activity.type -eq "DatabricksNotebook" -and $activity.typeProperties -and $activity.typeProperties.notebookPath) {
                $notebookPath = $activity.typeProperties.notebookPath
                
                # Verificar si notebookPath es una expresión
                if ($notebookPath -is [string]) {
                    # Solo modificar si es un string
                    Write-Output "  [MODIFIED] Activity: $($activity.name) (DatabricksNotebook)"
                    $activity.typeProperties.notebookPath = $notebookPath -replace $oldPath, $newPath
                    $script:modified = $true
                }
                elseif ($notebookPath.type -eq "Expression") {
                    # Si notebookPath es una expresión, modificar su valor interno
                    Write-Output "  [MODIFIED] Activity: $($activity.name) (DatabricksNotebook) - Expression Path"
                    $activity.typeProperties.value.value = $notebookPath.value -replace $oldPath, $newPath
                    $script:modified = $true
                }
            }

            # Process any direct child activities.
            if ($activity.activities) {
                Process-Activities $activity.activities
            }

            # Process IfCondition activities (look inside ifTrueActivities and ifFalseActivities).
            if ($activity.type -eq "IfCondition" -and $activity.typeProperties) {
                if ($activity.typeProperties.ifTrueActivities) {
                    Process-Activities $activity.typeProperties.ifTrueActivities
                }
                if ($activity.typeProperties.ifFalseActivities) {
                    Process-Activities $activity.typeProperties.ifFalseActivities
                }
            }

            # Process Switch activities (look inside each case and defaultActivities).
            if ($activity.type -eq "Switch" -and $activity.typeProperties) {
                if ($activity.typeProperties.cases) {
                    foreach ($case in $activity.typeProperties.cases) {
                        if ($case.activities) {
                            Process-Activities $case.activities
                        }
                    }
                }
                if ($activity.typeProperties.defaultActivities) {
                    Process-Activities $activity.typeProperties.defaultActivities
                }
            }

            # Process ForEach activities (activities are nested in typeProperties.activities).
            if ($activity.type -eq "ForEach" -and $activity.typeProperties) {
                if ($activity.typeProperties.activities) {
                    Process-Activities $activity.typeProperties.activities
                }
            }

            # Process Until activities.
            if ($activity.type -eq "Until" -and $activity.typeProperties) {
                if ($activity.typeProperties.activities) {
                    Process-Activities $activity.typeProperties.activities
                }
            }
        }
    }

    # Start processing activities
    Process-Activities $activities

    ## If modified, Update Pipeline
    if ($modified) {
        Write-Output "`n  Pipeline modifications detected. Preparing update..."
        
        # Create PUT body with all properties except read-only fields
        $putBody = @{
            name       = $pipeline.Name
            properties = @{}
        }

        # Clone properties while removing read-only fields
        $readOnlyProperties = @('etag', 'id', 'type', 'name')
        foreach ($prop in $pipeline_response.properties.PSObject.Properties) {
            if ($prop.Name -notin $readOnlyProperties) {
                $putBody.properties[$prop.Name] = $prop.Value
            }
        }

        # Force update modified activities
        $putBody.properties.activities = $activities

        # Convert to JSON with proper depth
        $jsonPayload = $putBody | ConvertTo-Json -Depth 100 -Compress
        
        # Show JSON snippet for verification
        Write-Output "JSON snippet verification: $($jsonPayload.Substring(0, [Math]::Min($jsonPayload.Length, 300)))... "

        # Update pipeline
        $uri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.DataFactory/factories/$dataFactoryName/pipelines/$($pipeline_response.name)?api-version=$apiVersion"
        
        try {
            $result = Invoke-RestMethod -Uri $uri -Method Put -Headers $headers -Body $jsonPayload -ContentType "application/json"
            Write-Output "  [SUCCESS] Pipeline updated: $($pipeline.name)"
        }
        catch {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Output "  [ERROR] Failed to update pipeline: $($pipeline_response.name)"
            Write-Output "  Status Code: $($_.Exception.Response.StatusCode.value__)"
            Write-Output "  Error details: $errorBody"
        }

        # Add delay between updates
        Write-Output "  Waiting 1 second before next operation..."
        Start-Sleep -Seconds 1
    }
    else {
        Write-Output "  No modifications required for this pipeline."
    }
}

Write-Output "`n=== Script execution completed ==="
