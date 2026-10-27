const clusterIngestion = `# Databricks notebook source
dbutils.widgets.text("SiteName", "", "Site Name")
dbutils.widgets.text("IngestionGroup", "", "Ingestion Group")
dbutils.widgets.text("ActualDateTime", "", "Actual Date Time")
dbutils.widgets.text("WatermarkSchema", "", "Watermark Schema")
dbutils.widgets.text("WatermarkTable", "", "Watermark Table")

# COMMAND ----------

site_name = dbutils.widgets.get("SiteName")
ingestion_group = dbutils.widgets.get("IngestionGroup")
actual_date_time = dbutils.widgets.get("ActualDateTime")
watermark_schema = dbutils.widgets.get("WatermarkSchema")
watermark_table = dbutils.widgets.get("WatermarkTable")

cluster_sql_notebook = 'Cluster SQL Ingestion'
cluster_delta_notebook = 'Cluster Delta Ingestion'

print('Site Name: ' + site_name)
print('Ingestion Group: ' + ingestion_group)
print('Actual DateTime: ' + actual_date_time)
print('Watermark Schema: ' + watermark_schema)
print('Watermark Table: ' + watermark_table)

# COMMAND ----------

# DBTITLE 1,Cluster SQL Notebook
dbutils.notebook.run(cluster_sql_notebook, 3600, { "SiteName" : site_name, "IngestionGroup": ingestion_group, "ActualDateTime": actual_date_time }) 

# COMMAND ----------

# DBTITLE 1,Cluster Delta Notebook
dbutils.notebook.run(cluster_delta_notebook, 3600, { "SiteName" : site_name, "IngestionGroup": ingestion_group, "ActualDateTime": actual_date_time, "WatermarkSchema": watermark_schema, "WatermarkTable": watermark_table }) 
`

const projectDetails = {
    "101": {
        "category": "Azure Data Factory / Databricks",
        "title": "SQL Parallel Ingestion Platform",
        "description": "A reusable ingestion foundation for moving SQL Server and Oracle data into cloud storage and lakehouse formats. The package combines an Azure Data Factory pipeline definition with Databricks notebooks for full-copy and incremental workloads.",
        "architecture": "Source SQL → Azure Data Factory orchestration → Databricks transformation → Delta Lake → Downstream analytics.",
        "implementation": "The pipeline uses parameterized datasets and parallel activities for multiple source systems. Databricks notebooks separate full-copy and incremental loading patterns so ingestion logic can be reused across environments.",
        "evidence": "The repository includes the pipeline JSON, its visual export, the parallel ingestion architecture, and the supporting Databricks cluster Python notebooks.",
        "code": "Artifacts: PL_Ingestion_004_SqlParallel.json, Parallel_Ingestion.png, Delta Incremental Load notebook, and ClusterIngestion suite (Cluster Ingestion.py).",
        "resources": {
            "pipelineImage": "assets/files/projects/01-databricks-adf/project101/PL_Ingestion_004_SqlParallel.png",
            "pipelineJson": "assets/files/projects/01-databricks-adf/project101/PL_Ingestion_004_SqlParallel.json",
            "parallelImage": "assets/files/projects/01-databricks-adf/project101/Parallel_Ingestion.png",
            "notebookIframe": "assets/files/projects/01-databricks-adf/project101/Delta Incremental Load.html",
            "clusterCodes": [
                {
                    "name": "Cluster Ingestion.py",
                    "path": "assets/files/projects/01-databricks-adf/project101/Global/ClusterIngestion/Cluster Ingestion.py",
                    "code": clusterIngestion
                }
            ]
        }
    },
    "102": {
        category: "Azure Data Factory / SharePoint / Databricks / Delta Lake",
        title: "Metadata-Driven SharePoint Excel to Delta Lake Ingestion",
        description: "A metadata-driven ingestion framework that reads SharePoint Excel source definitions from a configuration CSV, stages the files in Blob Storage and invokes Databricks notebooks to create or incrementally update Delta Lake tables.",
        architecture: "Configuration CSV → ADF IngestionGroup filter → SharePoint Excel files → Blob Storage staging → Databricks notebook → full or incremental Delta Lake tables.",
        implementation: "The main pipeline reads the SharePoint ingestion configuration and filters records by IngestionGroup. It invokes a child pipeline that copies the configured Excel files from SharePoint to Blob Storage. Once staging is complete, Azure Data Factory calls the Databricks notebook with the site, ingestion group and watermark parameters. The notebook applies the configured worksheet, range, header and key-column rules, then performs either a full copy or an incremental Delta merge.",
        evidence: "The case study includes the metadata configuration overview, a field-by-field CSV description, the main SharePoint-to-Blob pipeline, the child copy pipeline and the exported Databricks notebook used for incremental ingestion.",
        code: "Artifacts: sharepoint_ingesta.png, sharepoint_ingesta_column_descripcion.csv, pipeline_sharepointtoblob.png, child_pipeline_sharepointtoblob.png and Ingesta Incremental.html.",
        resources: {
            gallery: [
                {
                    title: "1. Metadata-driven ingestion configuration",
                    image: "assets/files/projects/01-databricks-adf/project102/sharepoint_ingesta.png",
                    alt: "SharePoint ingestion configuration and metadata flow",
                    description: "Configuration rows define SharePoint credentials, file locations, target Delta tables, worksheet rules, ingestion groups and full or incremental loading behavior."
                },
                {
                    title: "2. Main SharePoint-to-Blob pipeline",
                    image: "assets/files/projects/01-databricks-adf/project102/pipeline_sharepointtoblob.png",
                    alt: "Main Azure Data Factory SharePoint to Blob Storage pipeline",
                    description: "The main pipeline reads the configuration CSV, filters the selected IngestionGroup and orchestrates the SharePoint file-copy process."
                },
                {
                    title: "3. Child SharePoint-to-Blob pipeline",
                    image: "assets/files/projects/01-databricks-adf/project102/child_pipeline_sharepointtoblob.png",
                    alt: "Child Azure Data Factory SharePoint to Blob Storage pipeline",
                    description: "The child pipeline performs the configured Excel file copy from SharePoint into the Blob Storage staging path."
                }
            ],
            notebookIframe: "assets/files/projects/01-databricks-adf/project102/Ingesta%20Incremental.html",
            csv: "assets/files/projects/01-databricks-adf/project102/sharepoint_ingesta_column_descripcion.csv"
        }
    },
    "103": {
        category: "Databricks Apps / Streamlit / AI Genie",
        title: "Databricks Apps: Parallel Coordinates and AI Genie",
        description: "A production-ready Streamlit application deployed as a Databricks App. The solution combines parallel-coordinate analytics with configurable filters, five operational comparison cases and an AI Genie chatbot for natural-language exploration of governed data.",
        architecture: "VS Code → Streamlit source code → Databricks App configuration → Databricks Apps runtime → SQL Warehouse and governed tables → Parallel Coordinates and AI Genie experiences.",
        implementation: "The application is prepared in VS Code and deployed as a Databricks App using app.yaml. Environment variables provide the warehouse, Genie space, SQL paths and source table configuration, while the Streamlit interface exposes interactive analytics and a natural-language data experience without embedding credentials in the source code.",
        evidence: "The case study documents the complete delivery path: Databricks App creation and deployment preparation, Streamlit source code, environment configuration, collapsible chatbot implementation, interactive parallel-coordinate analysis and the AI Genie experience.",
        code: "Artifacts: project103.png, streamlit_code.png, app.yaml, chatbot.py, streamlit_parallel.png and streamlit_genie.png.",
        resources: {
            gallery: [
                {
                    title: "1. Databricks App creation and deployment preparation",
                    image: "assets/files/projects/01-databricks-adf/project103/project103.png",
                    alt: "Databricks App creation and deployment preparation",
                    description: "The Databricks App is created and prepared for deployment with the Streamlit entry point and runtime configuration."
                },
                {
                    title: "2. Streamlit parallel analysis in Visual Studio Code",
                    image: "assets/files/projects/01-databricks-adf/project103/streamlit_code.png",
                    alt: "parallel.py Streamlit source code in Visual Studio Code",
                    description: "The parallel.py implementation defines the interactive visualization, filter parameters and five comparison cases."
                },
            ],
            galleryAfterCode: [
                {
                    title: "5. Parallel coordinates visualization",
                    image: "assets/files/projects/01-databricks-adf/project103/streamlit_parallel.png",
                    alt: "Streamlit parallel coordinates visualization with filters",
                    description: "The deployed application presents a parallel-coordinate chart with filter controls and five operational cases for comparison."
                },
                {
                    title: "6. AI Genie application tab",
                    image: "assets/files/projects/01-databricks-adf/project103/streamlit_genie.png",
                    alt: "Streamlit AI Genie application tab",
                    description: "The AI Genie tab enables natural-language questions over governed Databricks data and displays the resulting explanation and data."
                }
            ],
            yamlFile: "assets/files/projects/01-databricks-adf/project103/app.yaml",
            yamlParameters: [
                ["command", "Starts the Streamlit application with streamlit run app.py."],
                ["DATABRICKS_WAREHOUSE_ID", "Identifier of the SQL Warehouse used to execute application queries."],
                ["GENIE_SPACE_ID", "Identifier of the Databricks AI Genie space used by the chatbot."],
                ["HTTP_PATH_METRIC", "HTTP path used to connect to the SQL Warehouse for metric queries."],
                ["TABLE_METRIC_NAME", "Fully qualified metrics table: chapada_gold_dev.processing_recovery.fact_metric_hourly."],
                ["HTTP_PATH_KPI_DICT", "HTTP path used to connect to the SQL Warehouse for KPI dictionary queries."],
                ["TABLE_KPI_NAME", "Fully qualified KPI reference table: chapada_gold_dev.processing_recovery.ref_kpi_dict_master."]
            ],
            codeFiles: [
                {
                    name: "chatbot.py",
                    path: "assets/files/projects/01-databricks-adf/project103/chatbot.py",
                    language: "python"
                }
            ]
        }
    },
    "105": {
        category: "Azure Data Factory / SharePoint API / Azure SQL / Azure DevOps",
        title: "SharePoint Lists to Azure SQL with ADF Deployment",
        description: "An API-driven Azure Data Factory pipeline that discovers SharePoint folders, collects the lists available in each folder and loads their tables into Azure SQL before promoting the validated solution through Azure DevOps.",
        architecture: "SharePoint API → folder discovery → list accumulation → list/table iteration → Azure SQL → Azure DevOps deployment to Prod-UC.",
        implementation: "The pipeline first obtains the tenant and application context, requests an access token and calls the SharePoint API to retrieve the folders. A ForEach activity appends every discovered folder to an array, then another iteration retrieves the lists for each folder and appends them to a second array. The resulting list collection drives the table iteration that copies each SharePoint list into Azure SQL. After validation in the development environment, the ADF definition is promoted with the Azure DevOps deployment process.",
        evidence: "The case study shows the complete discovery and ingestion orchestration, the list-to-table loading stage and the Azure DevOps deployment task used to promote the pipeline to Prod-UC.",
        code: "Artifacts: SharePoint_Cummins.png, adf-deployment.png",
        resources: {
            gallery: [
                {
                    title: "1. SharePoint folder and list discovery",
                    image: "assets/files/projects/01-databricks-adf/project105/SharePoint_Cummins.png",
                    alt: "Azure Data Factory pipeline discovering SharePoint folders and lists",
                    description: "The pipeline authenticates against SharePoint, retrieves the folders through the API and appends each folder to an array before continuing with list discovery."
                },
                {
                    title: "2. Azure DevOps deployment to Prod-UC",
                    image: "assets/files/projects/01-databricks-adf/project105/adf-deployment.png",
                    alt: "Azure DevOps ADF deployment pipeline for Prod-UC",
                    description: "After validation in development, the release process runs the deployment tasks that promote the Azure Data Factory resources to the Prod-UC environment."
                }
            ]
        }
    },
    "106": {
        category: "Azure Data Factory / PowerShell / REST API",
        title: "Automated Inputs Migration in Azure Data Factory",
        description: "A PowerShell automation that migrates Databricks notebook paths across Azure Data Factory pipelines. It retrieves every pipeline definition, updates notebook activities from the legacy repository path to the new workspace path and preserves the remaining pipeline configuration.",
        architecture: "Azure Data Factory pipelines → REST API retrieval → recursive activity traversal → Databricks notebook path replacement → validated pipeline update.",
        implementation: "The script authenticates with Azure, enumerates all pipelines in the selected Data Factory and retrieves each definition through the Azure Data Factory REST API. It recursively scans DatabricksNotebook activities, including activities nested inside IfCondition, ForEach, Switch and Until containers. When the legacy path is found, the script replaces it with the new path, serializes the complete definition and sends the update through a PUT request.",
        evidence: "The activity-path screenshot shows the Databricks notebook configuration and its base parameters inside ADF. The PowerShell script demonstrates the complete maintenance workflow, including authentication, pipeline discovery, recursive traversal, path replacement, JSON serialization, update handling and execution logging.",
        code: "PowerShell source: Update Azure Data Factory Pipeline.ps1. The script is available below as a collapsible implementation reference.",
        resources: {
            activityImage: "assets/files/projects/01-databricks-adf/project106/activity-path.png",
            powershellFile: "assets/files/projects/01-databricks-adf/project106/update-azure-data-factory-pipeline.ps1"
        }
    },
    "107": {
        category: "Azure DevOps / Azure Data Factory / PowerShell",
        title: "Automated Azure Data Factory CI/CD Deployment",
        description: "A repeatable Azure DevOps release workflow for validating, deploying and promoting Azure Data Factory resources across environments. The process combines ARM template deployment, trigger management, dependency-aware resource ordering and post-deployment activation.",
        architecture: "ADF development environment → ARM template export → Azure DevOps release tasks → predeployment trigger handling → Azure resource deployment → post-deployment cleanup and trigger activation.",
        implementation: "The PowerShell deployment script reads the generated ARM template, identifies pipelines, triggers, datasets, linked services, data flows and integration runtimes, then compares the template with the target Data Factory. Before deployment, active triggers are stopped to prevent executions during the release. After deployment, deleted resources are removed and triggers configured as Started are activated again. Pipeline and trigger dependencies are sorted before execution to preserve the correct deployment order.",
        evidence: "The case study includes the CI/CD architecture, Azure DevOps task configuration, deployment execution logs and the PowerShell implementation used by the release process.",
        code: "PowerShell source: cicd.ps1. The script is available below as a collapsible implementation reference.",
        resources: {
            gallery: [
                {
                    title: "1. Azure Data Factory CI/CD flow",
                    image: "assets/files/projects/01-databricks-adf/project107/DevOps_CICD.png",
                    alt: "Azure DevOps CI/CD workflow for Azure Data Factory deployment",
                    description: "Overview of the release process used to move validated Azure Data Factory changes through the deployment workflow.",
                    powershellFile: "assets/files/projects/01-databricks-adf/project107/cicd.ps1"
                },
                {
                    title: "2. Azure DevOps deployment tasks",
                    image: "assets/files/projects/01-databricks-adf/project107/DevOps_Tasks.png",
                    alt: "Azure DevOps release tasks for Azure Data Factory deployment",
                    description: "Release tasks responsible for executing the predeployment and post-deployment stages, including trigger handling and Azure resource deployment."
                },
                {
                    title: "3. Deployment execution logs",
                    image: "assets/files/projects/01-databricks-adf/project107/DevOps_Logs.png",
                    alt: "Azure DevOps deployment execution logs",
                    description: "Execution evidence showing the deployment process, resource operations and completion status of the release."
                }
            ]
        }
    },
    "108": {
        category: "FastField / Azure Functions / Azure Data Factory / Azure SQL",
        title: "FastField Data Ingestion and Table Automation",
        description: "An end-to-end ingestion solution for FastField Forms that combines historical submission extraction, Azure Function API integration and Azure Data Factory orchestration. The process creates the initial historical tables and prepares the FastField portal for future submissions to be inserted into the corresponding history tables.",
        architecture: "FastField Forms → FastField API → C# Azure Function → Azure Data Factory → Azure SQL historical tables → reporting views and downstream analytics.",
        implementation: "When new forms are onboarded, their submission IDs are downloaded and inserted into the ingestion history. The historical data is then used to generate the corresponding database tables and load the available submissions. In the FastField Forms portal, each form is configured and connected to its historical database table so future submissions can be inserted into the same structure.",
        evidence: "The solution supports dozens of FastField forms. Depending on the form design, each generated table can contain approximately 500 to 1,000 columns. Photo fields, list fields and other multiple-value attributes are separated into related tables using the form identifier, allowing them to be consumed later through views and joins.",
        code: "Artifacts: FastField_Portal.png, PL_FastField.png, FastField_Code.png and Tables_Generated.png. The supporting documentation describes table creation, execution and recurring FastField updates through Azure Data Factory.",
        resources: {
            gallery: [
                {
                    title: "1. FastField form and historical table configuration",
                    image: "assets/files/projects/01-databricks-adf/project108/FastField_Portal.png",
                    alt: "FastField Forms portal connected to a historical database table",
                    description: "Each FastField form is configured and connected to its corresponding historical database table. This allows future submissions to be inserted into the existing structure after the initial historical load."
                },
                {
                    title: "2. Azure Data Factory form orchestration",
                    image: "assets/files/projects/01-databricks-adf/project108/PL_FastField.png",
                    alt: "Azure Data Factory FastField Forms ingestion pipeline",
                    description: "The Form Names activity contains the list of FastField form names in an array. The pipeline iterates over that array and invokes the Azure Function for each form."
                },
                {
                    title: "3. C# Azure Function for FastField API extraction",
                    image: "assets/files/projects/01-databricks-adf/project108/FastField_Code.png",
                    alt: "C# .NET Azure Function that calls the FastField API",
                    description: "The Azure Function written in C# .NET calls the FastField API, retrieves the submission identifiers and downloads the data required for the historical and recurring ingestion process."
                },
                {
                    title: "4. Generated FastField relational tables",
                    image: "assets/files/projects/01-databricks-adf/project108/Tables_Generated.png",
                    alt: "Generated FastField database tables",
                    description: "The process generates tables for dozens of forms. Forms with approximately 500 to 1,000 columns are normalized by separating photos, lists and multiple-value fields into related tables linked by the form identifier."
                }
            ]
        }
    },
    "111": {
        category: "Databricks / Unity Catalog / Cluster Configuration",
        title: "Databricks Cluster Dependencies with Volumes and Init Scripts",
        description: "A governed and repeatable approach for installing Python libraries and ODBC drivers on Databricks clusters. The dependency files are uploaded to a Unity Catalog Volume and attached through a cluster init script, avoiding manual installation and ensuring that every cluster starts with the required runtime dependencies.",
        architecture: "Local dependency files → Unity Catalog Volume → Databricks cluster init script → cluster libraries and ODBC drivers → notebooks and jobs.",
        implementation: "The process uses a Unity Catalog Volume as the centralized storage location for the driver and library files. After uploading the required files to the Volume, the cluster configuration references an init script through Advanced options. During cluster startup, the script installs the dependencies and configures the runtime before notebooks or jobs execute.",
        evidence: "The case study documents the two-step configuration: uploading the dependency files to a Unity Catalog Volume and attaching the init script from the cluster Advanced options.",
        code: "Artifacts: upload_drivers.png, cluster_initscript.png and pyodbc-install.sh.",
        resources: {
            gallery: [
                {
                    title: "1. Upload libraries and drivers to a Unity Catalog Volume",
                    image: "assets/files/projects/01-databricks-adf/project111/upload_drivers.png",
                    alt: "Databricks Unity Catalog Volume containing libraries and drivers",
                    description: "Upload the required libraries, drivers and installation assets to a governed Unity Catalog Volume. This keeps the dependency files centralized, reusable and accessible to the clusters that need them."
                },
                {
                    title: "2. Attach the init script through Advanced options",
                    image: "assets/files/projects/01-databricks-adf/project111/cluster_initscript.png",
                    alt: "Databricks cluster Advanced options with a Volume init script",
                    description: "In the cluster configuration, open Advanced options, go to Init scripts, select Volumes as the source and reference the installation script stored in the Unity Catalog Volume."
                }
            ]
        }
    },


    
    "201": {
        category: "Copilot Studio / Azure AI Foundry / Power Automate",
        title: "Copilot Studio Image Agent with Azure AI Foundry",
        description: "A conversational image-generation agent built in Microsoft Copilot Studio. The agent captures a user's image request, calls an Azure AI Foundry HTTP API, processes the Base64 response through Power Automate, stores the image in Azure Blob Storage and returns the generated image URL to Copilot Studio and Microsoft Teams.",
        architecture: "User request → Copilot Studio question node → Azure AI Foundry HTTP API → Base64 image response → Power Automate → Azure Blob Storage → image URL → Copilot Studio and Microsoft Teams.",
        implementation: "The agent is created from a blank Copilot Studio agent with an empty topic. A question node collects the image description and invokes the Azure AI Foundry endpoint through HTTP. The API response contains the generated image in JSON format. Power Automate extracts the Base64 payload using Index(Topic.ResponseImage.data, 1).b64_json, stores the decoded image in Blob Storage and returns the resulting image URL to Copilot Studio.",
        evidence: "The implementation is documented through the Copilot Studio question configuration, Power Automate image-processing flow, Power Automate response step, Copilot Studio test conversation and the final Microsoft Teams validation.",
        code: "Key expression used in Power Automate: Index(Topic.ResponseImage.data, 1).b64_json. The endpoint configuration and credentials are intentionally excluded from the portfolio.",
        resources: {
            gallery: [
                {
                    title: "1. Copilot Studio question node and Azure AI Foundry request",
                    image: "assets/files/projects/02-copilot-power-fabric/project201/copilot-question-input.png",
                    alt: "Copilot Studio question node capturing the user's image request",
                    description: "A blank Copilot Studio agent is configured with an empty topic. A question node collects the image description and invokes the Azure AI Foundry HTTP API.",
                    code: `# Send body Json to foundry api
POST: https://********************.services.ai.azure.com/openai/v1/images/generations
BODY:
{
     prompt: Topic.UserPrompt,
     model: "gpt-image-2",
     n: 1,
     output_format: "png"
}

# Save response imagen b64_json to a variable
Index(Topic.ResponseImage.data, 1).b64_json`
                },
                {
                    title: "2. Power Automate image processing flow",
                    image: "assets/files/projects/02-copilot-power-fabric/project201/copilot-power-automate.png",
                    alt: "Power Automate flow processing the Base64 image returned by Azure AI Foundry",
                    description: "Power Automate receives the JSON response from Azure AI Foundry and prepares the generated image for storage in Azure Blob Storage."
                },
                {
                    title: "3. Blob Storage response returned to Copilot Studio",
                    image: "assets/files/projects/02-copilot-power-fabric/project201/copilot-power-automate-respond.png",
                    alt: "Power Automate response returning the Blob Storage image URL to Copilot Studio",
                    description: "The flow stores the decoded image in Blob Storage, obtains its accessible URL and returns that URL to the Copilot Studio topic."
                },
                {
                    title: "4. Copilot Studio agent validation",
                    image: "assets/files/projects/02-copilot-power-fabric/project201/copilot-studio-chat.png",
                    alt: "Copilot Studio test chat showing the generated image response",
                    description: "The agent is tested in the Copilot Studio chat experience to verify that the prompt is processed and the generated image is returned successfully."
                },
                {
                    title: "5. Microsoft Teams deployment and validation",
                    image: "assets/files/projects/02-copilot-power-fabric/project201/teams-chat.png",
                    alt: "Microsoft Teams chat with the published image-generation agent",
                    description: "The agent is published to the Microsoft Teams channel, installed in Teams and validated through a real conversational image-generation request."
                }
            ]
        }
    },
    
    "202": {
        category: "Power Automate / SharePoint / Azure AI Foundry",
        title: "AI-Powered Excel Report Automation",
        description: "An end-to-end automation pipeline that detects Excel files uploaded to SharePoint, extracts data from every worksheet with Office Scripts, classifies the document using Azure AI Foundry and generates a structured Word report.",
        architecture: "SharePoint file upload → Power Automate trigger → Office Scripts extraction → Azure AI Foundry classification → case-based report generation → Azure Function Markdown-to-Word conversion → SharePoint document storage.",
        implementation: "The flow starts when a user uploads an Excel file to a configured SharePoint folder. Power Automate retrieves and executes the Office Script against the workbook. The script iterates through every worksheet, reads the used range and returns the normalized content as a string. Azure AI Foundry first classifies the file and then selects the corresponding report-generation prompt. The generated Markdown is posted to an Azure Function, converted into a DOCX file and stored back in SharePoint.",
        evidence: "The case study includes the SharePoint trigger, Office Script storage, Excel extraction action, Azure AI Foundry prompt configuration, conditional case routing, generated Word report and the C# Azure Function used for Markdown-to-DOCX conversion.",
        code: "Artifacts: ExcelScript.ts for worksheet extraction and ConvertToWordFile.cs for the Azure Function that returns the generated Word document.",
        resources: {
            gallery: [
                {
                    title: "1. SharePoint upload trigger",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/power-automate-trigger.png",
                    alt: "Power Automate trigger configured for a file created or uploaded to SharePoint",
                    description: "The workflow starts when a file is created or uploaded to a configured SharePoint folder. This establishes the entry point for the automated Excel processing pipeline."
                },
                {
                    title: "2. Office Script stored in SharePoint",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/sharepoint-script.png",
                    alt: "SharePoint folder containing the Office Script used to process Excel workbooks",
                    description: "The Office Script is stored in SharePoint so the flow can retrieve and execute the same extraction logic consistently for incoming workbooks.",
                    codeFile: "assets/files/projects/02-copilot-power-fabric/project202/ExcelScript.ts",
                    codeLanguage: "typescript",
                    codeTitle: "Office Script worksheet extraction"
                },
                {
                    title: "3. Extracting Excel data",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/power-automate-extract-excel-data.png",
                    alt: "Power Automate action that executes the Office Script and receives the extracted Excel data",
                    description: "Power Automate runs the Office Script. The script iterates through every worksheet, reads the used range and returns the workbook contents as a string."
                },
                {
                    title: "4. Azure AI Foundry classification",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/power-automate-ai-builder.png",
                    alt: "Power Automate action connected to an Azure AI Foundry prompt",
                    description: "The first AI request classifies the workbook using its file name and returns one standardized category used by the routing logic."
                },
                {
                    title: "5. Classification prompt configuration",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/copilot-studio-tools-prompt-2.png",
                    alt: "Azure AI Foundry prompt configured to classify an Excel file",
                    description: "The prompt defines the classification rules, required identifier handling and the exact PascalCase response format expected by the flow."
                },
                {
                    title: "6. Case-based report generation",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/power-automate-switch-case.png",
                    alt: "Power Automate switch case routing classified Excel files to report-generation prompts",
                    description: "After classification, the switch condition selects the corresponding case and sends the extracted Excel data to a second prompt that prepares the report."
                },
                {
                    title: "7. Word report conversion and SharePoint storage",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/power-automate-storage-report-sharepoint.png",
                    alt: "Power Automate flow converting the generated Markdown report and storing the Word file in SharePoint",
                    description: "The Markdown response is posted to the Azure Function, returned as DOCX file content and then created as a document in SharePoint.",
                    codeFile: "assets/files/projects/02-copilot-power-fabric/project202/ConvertToWordFile.cs",
                    codeLanguage: "csharp",
                    codeTitle: "Azure Function Markdown-to-Word conversion"
                },
                {
                    title: "8. Generated Word report",
                    image: "assets/files/projects/02-copilot-power-fabric/project202/word-results.png",
                    alt: "Generated Word report produced from classified Excel data",
                    description: "The final artifact is a structured Word report generated from the extracted Excel data and the selected AI reporting prompt."
                }
            ]
        }
    },
    "203": {
        category: "Microsoft Fabric / Workspace Identity / OneLake",
        title: "Microsoft Fabric Workspace Identity, Admin APIs and OneLake Shortcuts",
        description: "A practical implementation guide for configuring a Microsoft Fabric workspace identity, enabling controlled service-principal access to read-only admin APIs, and creating OneLake Shortcuts for governed cloud data access.",
        architecture: "Microsoft Entra security group → Fabric tenant settings → Workspace identity → OneLake Shortcuts → Lakehouse data access and downstream analytics.",
        implementation: "The implementation configures the Fabric tenant setting 'Service principals can access read-only admin APIs' as enabled for specific security groups rather than the entire organization. The PowerBIAPI group is assigned as the allowed security group. The workspace identity is then used to establish the required access path for creating and consuming OneLake Shortcuts across cloud data locations.",
        evidence: "The documentation covers Workspace Identity configuration and Shortcut creation in Microsoft Fabric. The tenant-settings screenshot demonstrates the enabled read-only admin API setting and its restricted assignment to the PowerBIAPI security group.",
        code: "This case study documents the platform configuration and access model without exposing tenant-specific secrets, credentials or sensitive identifiers.",
        resources: {
            gallery: [
                {
                    title: "Fabric tenant setting for read-only admin APIs",
                    image: "assets/files/projects/02-copilot-power-fabric/project203/fabric-tenant-settings.png",
                    alt: "Microsoft Fabric Admin portal tenant setting enabling service principals to access read-only admin APIs for the PowerBIAPI security group",
                    description: "In Fabric Admin portal > Tenant settings > Admin API settings, the option 'Service principals can access read-only admin APIs' is enabled and scoped to the specific PowerBIAPI security group instead of the entire organization."
                }
            ]
        }
    },
    "204": {
        category: "Microsoft Fabric / Lakehouse / OneLake Shortcuts / Delta Lake",
        title: "Microsoft Fabric Lakehouse Sensor Heatmap with OneLake Shortcut",
        description: "A Microsoft Fabric data engineering workflow that connects Blob Storage Delta tables to a Lakehouse through a OneLake shortcut and uses a Fabric notebook to visualize and analyze sensor measurements with a heatmap.",
        architecture: "Azure Blob Storage → Delta tables → OneLake Shortcut → Microsoft Fabric Lakehouse → Fabric notebook → sensor heatmap analysis.",
        implementation: "The solution starts with a Microsoft Fabric Lakehouse. A OneLake shortcut is created inside the Lakehouse and connected to Azure Blob Storage, exposing the Delta tables without duplicating the underlying data. The table is then added to the notebook through the OneLake catalog using the 'From OneLake catalog' option. The notebook processes the sensor data and generates a heatmap for spatial and measurement-based analysis.",
        evidence: "The heatmap screenshot demonstrates the resulting sensor-data visualization. The accompanying Jupyter notebook contains the implementation used to load the Delta table from the OneLake catalog and generate the heatmap analysis.",
        code: "Notebook: 3 Heat Map Sensors - Data Visualization and Analysis.ipynb.",
        resources: {
            gallery: [
                {
                    title: "1. Sensor heatmap visualization",
                    image: "assets/files/projects/02-copilot-power-fabric/project204/heatmap-sensors-data-visualization-and-analysis.png",
                    alt: "Microsoft Fabric notebook heatmap showing sensor data visualization and analysis",
                    description: "The Fabric notebook produces a heatmap from the sensor data exposed through the Lakehouse. The visualization helps identify spatial concentration, intensity and distribution patterns across the sensor measurements."
                }
            ],
            notebookFile: "assets/files/projects/02-copilot-power-fabric/project204/3%20Heat%20Map%20Sensors%20-%20Data%20Visualization%20and%20Analysis.ipynb",
            notebookHtml: "assets/files/projects/02-copilot-power-fabric/project204/HeatMapSensors-DataVisualizationAndAnalysis.html"
        }
    },

    "301": {
        category: "SQL Server / R / Power BI / Geospatial Analytics",
        title: "Mining Fleet Cycle Mapping with SQL Server, R and Power BI",
        description: "An end-to-end geospatial analytics workflow for mining fleet cycle data. The solution converts UTM coordinates stored in SQL Server into latitude and longitude, prepares current-year haul-cycle data through reusable views, renders truck routes and operational locations with R and Leaflet, compiles the result as a Power BI custom visual with pbiviz, and publishes the final report to Power BI Service.",
        architecture: "Mining fleet cycle tables → SQL Server UTM conversion function → map preparation view → R and Leaflet visualization → pbiviz custom visual → Power BI Service app.",
        implementation: "The fn_utm2latlong function converts the stored UTM coordinates using the mining site's zone, hemisphere and coordinate offsets. The v_hist_cycle_hp_current_year_map view prepares the current-year dump, load, material and location data. The R workflow consumes the prepared data, assigns operational icons and colors, and draws haul routes with Leaflet. The visualization is then compiled with pbiviz for use inside Power BI and published to a Power BI online app.",
        evidence: "The case study includes the SQL conversion function, the map preparation view, the R and Leaflet source code, the rendered R map, the compiled Power BI custom visual and the published Power BI app.",
        code: "Artifacts: fn_utm2latlong.sql, v_hist_cycle_hp_current_year_map.sql, leaflet-map.r, result-r.png, result-powerbi.png and app-powerbi.png.",
        resources: {
            gallery: [
                {
                    title: "1. UTM to latitude and longitude conversion",
                    description: "The SQL function converts the UTM coordinates stored in the mining source tables into latitude and longitude values required by mapping tools.",
                    codeFile: "assets/files/projects/03-sql-powerbi-analytics/project301/fn_utm2latlong.sql",
                    codeTitle: "SQL Server UTM conversion function",
                    codeLanguage: "sql"
                },
                {
                    title: "2. SQL view prepared for mapping",
                    description: "The view joins dumps, loads, locations and materials, aggregates bucket-face coordinates and exposes the current-year dataset consumed by the mapping workflow.",
                    codeFile: "assets/files/projects/03-sql-powerbi-analytics/project301/v_hist_cycle_hp_current_year_map.sql",
                    codeTitle: "Map preparation view",
                    codeLanguage: "sql"
                },
                {
                    title: "3. R and Leaflet operational map",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project301/result-r.png",
                    alt: "R Leaflet map showing mining haul routes, origins and destinations",
                    description: "The R script adds satellite tiles, operational icons, origin and destination markers, haul-route polylines, tonnage labels and legends for mining phases and stockpiles.",
                    codeFile: "assets/files/projects/03-sql-powerbi-analytics/project301/leaflet-map.r",
                    codeTitle: "R and Leaflet mapping script",
                    codeLanguage: "r"
                },
                {
                    title: "4. Power BI custom visual",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project301/result-powerbi.png",
                    alt: "Compiled mining geospatial custom visual in Power BI",
                    description: "The R mapping result is compiled with pbiviz so the geospatial visualization can be embedded and consumed as a Power BI custom visual."
                },
                {
                    title: "5. Published Power BI app",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project301/app-powerbi.png",
                    alt: "Published mining geospatial analytics app in Power BI Service",
                    description: "The final solution is published to Power BI Service, making the mining fleet map available through an online Power BI app."
                }
            ]
        }
    },
    "302": {
        category: "ASP.NET Core / Azure AD / Power BI",
        title: "ASP.NET Core Power BI Embedded Reporting Application",
        description: "A secure ASP.NET Core Razor Pages application that authenticates users with Microsoft Azure, retrieves Power BI embed access through a backend endpoint, and renders operational reports inside the application using the Power BI JavaScript client.",
        architecture: "User → ASP.NET Core Razor Pages login → Microsoft Azure authentication → backend access-token endpoint → Power BI Embedded report → operational reporting interface.",
        implementation: "The application uses Razor Pages for the web interface and server-side configuration, Azure authentication for controlled user access, and the Power BI JavaScript client to embed the selected report. The main page obtains the workspace and report identifiers from the application model, requests an embed token from the backend, and renders the report with the filter and navigation panes disabled for a focused operational experience.",
        evidence: "The case study includes the application login screen, the Azure login flow, the main reporting interface with the embedded Power BI report, and the collapsed Index.cshtml implementation used to configure the embedded report.",
        code: "Artifacts: main-gointegreat.png, login-azure-acc.png, app-main-daily-report.png and Index.cshtml.",
        resources: {
            gallery: [
                {
                    title: "1. ASP.NET Core Razor Pages application login",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project302/main-gointegreat.png",
                    alt: "ASP.NET Core Razor Pages application login screen",
                    description: "Initial login screen of the ASP.NET Core Razor Pages application used to access the operational Power BI reporting experience."
                },
                {
                    title: "2. Microsoft Azure authentication",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project302/login-azure-acc.png",
                    alt: "Microsoft Azure login screen for the reporting application",
                    description: "Azure authentication step that validates the user before allowing access to the embedded Power BI report."
                },
                {
                    title: "3. Razor Page Power BI embedding implementation",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project302/app-main-daily-report.png",
                    alt: "Power BI embedded report implementation in an ASP.NET Core Razor Page",
                    description: "Main application screen displaying the operational report through the Power BI JavaScript client. The Razor Page requests the embed token from the backend, obtains the report metadata and initializes the Power BI embedded report configuration.",
                    codeFile: "assets/files/projects/03-sql-powerbi-analytics/Project302/Index.cshtml",
                    codeTitle: "Index.cshtml Power BI embedding implementation",
                    codeLanguage: "csharp"
                }
            ]
        }
    },
    "303": {
        category: "R / Power BI Custom Visuals / Mining Analytics",
        title: "Interactive Granulometric Profiles for Primary Crusher Analysis",
        description: "An interactive Power BI custom visual developed with R, ggplot2 and ggplotly to analyze cumulative particle-size distributions from primary crusher blasts. The visual compares each blast source with a target granulometric curve across standardized sieve sizes.",
        architecture: "Power BI dataset → R visual transformation → sieve-size normalization → cumulative passing calculation → ggplot2/ggplotly interactive chart → Power BI custom visual.",
        implementation: "The R code maps each sieve designation to its equivalent micron value, aggregates the average passing percentage by sieve and blast source, and overlays the results against a predefined target curve. The x-axis uses a logarithmic scale, while reference lines identify the 25,400-micron sieve and the 43% cumulative passing level.",
        evidence: "The visual displays multiple blast sources as interactive colored profiles, white-centered data points with percentage tooltips, and a dashed target curve. It enables comparison of granulometric behavior across sources while preserving the standard sieve sequence from #10 through 75 inches.",
        code: "Artifacts: granulometricos.png, code.r and the compiled Power BI custom visual package generated with pbiviz.",
        resources: {
            gallery: [
                {
                    title: "R and ggplotly visual implementation",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project303/granulometricos.png",
                    alt: "R code implementation for an interactive granulometric Power BI visual",
                    description: "The visual compares cumulative passing percentages for multiple blast sources across standardized sieve sizes. Each colored line represents a source, while the black dashed line shows the target granulometric profile. Hovering over a point exposes the average passing percentage. The implementation normalizes sieve labels into micron values, calculates average passing percentages by blast and sieve, builds the target curve, and renders the interactive chart with ggplotly.",
                    codeFile: "assets/files/projects/03-sql-powerbi-analytics/project303/code.r",
                    codeTitle: "code.r granulometric visual implementation",
                    codeLanguage: "r"
                }
            ]
        }
    },
    "304": {
        category: "R / Power BI Custom Visuals / Mining Analytics",
        title: "Interactive Parallel Coordinates for Flotation Process Trajectories",
        description: "An interactive parallel coordinates visual for tracing flotation process trajectories across ore feed, SAG and ball mill variables. The visual preserves each record as a connected line so analysts can compare multidimensional operating patterns and identify relationships between upstream conditions and downstream process response.",
        architecture: "Power BI dataset → R parallel coordinates implementation → pbiviz custom visual package → Power BI Desktop and Power BI Service.",
        implementation: "The R implementation maps the selected process variables to parallel axes and encodes each trajectory by its measured response, allowing dense operating data to be explored without reducing it to a single aggregate. The result is compiled as a pbiviz custom visual for interactive filtering and deployment in both Power BI Desktop and Power BI Service.",
        evidence: "The complete view shows the end-to-end set of flotation and grinding variables. A second view applies a datetime slicer to focus the analysis on a selected period and exposes the visual configuration in Power BI. The third view narrows the display to a selected operating window, making the axis ranges and the trajectories inside that interval easier to compare.",
        code: "R source: code.r. The implementation is available below as a collapsible code reference.",
        resources: {
            gallery: [
                {
                    title: "1. Complete flotation process trajectories",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project304/Interactive Parallel Coordinates 1.png",
                    alt: "Complete interactive parallel coordinates chart for flotation process trajectories",
                    description: "The full chart connects observations across ore feed, SAG mill, ball mill and flotation-related variables. Color encodes the selected response, helping reveal operating trajectories and crossings across the complete process view."
                },
                {
                    title: "2. Datetime-filtered process view",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project304/Interactive Parallel Coordinates 2.png",
                    alt: "Interactive parallel coordinates chart filtered by datetime in Power BI",
                    description: "The Power BI view uses the local datetime slicer to isolate a selected time interval. The filtered trajectories make it possible to inspect a focused operating period while the Visualizations pane shows the fields bound to the custom visual."
                },
                {
                    title: "3. Operating-window comparison",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project304/Interactive Parallel Coordinates 3.png",
                    alt: "Parallel coordinates chart comparing a selected operating window across process variables",
                    description: "This view focuses on a narrower set of trajectories and displays the observed ranges for each process variable. The highlighted axis intervals provide a compact comparison of the operating window across feed, pressure, recovery, iron and flow measurements."
                }
            ],
            codeSectionTitle: "R source implementation",
            codeSectionDescription: "The R source is kept collapsed by default and can be expanded to inspect the parallel coordinates visual implementation.",
            codeFiles: [
                {
                    name: "code.r",
                    path: "assets/files/projects/03-sql-powerbi-analytics/project304/code.r",
                    language: "r"
                }
            ]
        }
    },
    "305": {
        category: "R / Leaflet / Power BI Custom Visuals / Mining Analytics",
        title: "Leaflet Heatmap for GPS Brake Sensor Intensity Analysis",
        description: "An interactive geospatial Power BI custom visual that combines Leaflet markers and a heatmap layer to analyze GPS brake-sensor readings along mining haul routes. The map supports sensor selection, custom intensity ranges, operational markers and a legend that helps identify areas with potentially anomalous brake behavior.",
        architecture: "GPS brake sensor data → Power BI data binding → R and Leaflet visualization → heatmap and custom legend → pbiviz custom visual → Power BI Desktop and Power BI Service.",
        implementation: "The R implementation plots GPS observations using latitude and longitude, adds sensor markers with contextual tooltips, defines custom intensity ranges and renders a heatmap using the sensor measurement. A custom Leaflet legend explains the color intervals, while the resulting visual is compiled with pbiviz for use in Power BI Desktop and Power BI online.",
        evidence: "The visualization shows the mining site over satellite imagery, GPS sensor points distributed along haul routes, high-intensity areas highlighted by the heatmap and a custom legend describing the intensity ranges. A SensorName selector allows the analysis to be narrowed to one or more sensors.",
        code: "R source: code.r. The implementation is available below as a collapsed code reference.",
        resources: {
            gallery: [
                {
                    title: "Leaflet heatmap custom visual",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project305/powerbi-leaflet-heatmap.png",
                    alt: "Power BI Leaflet heatmap showing GPS brake sensor intensity ranges across mining haul routes",
                    description: "The interactive map combines satellite imagery, GPS sensor markers and a heatmap layer. The intensity range legend distinguishes low, medium and high values, while the SensorName selector supports focused analysis of individual sensors or multiple selections."
                }
            ],
            codeSectionTitle: "R Leaflet heatmap implementation",
            codeSectionDescription: "The R source is kept collapsed by default and can be expanded to inspect the Leaflet markers, heatmap layer and custom intensity legend.",
            codeFiles: [
                {
                    name: "code.r",
                    path: "assets/files/projects/03-sql-powerbi-analytics/project305/code.r",
                    language: "r"
                }
            ]
        }
    },
    "306": {
        category: "R / Power BI Custom Visuals / Mining Analytics",
        title: "Brake Sensor Correlation and Risk Analysis",
        description: "An interactive Power BI custom visual for investigating relationships between mining brake sensors and identifying abnormal operating patterns. The solution combines a correlation signature map, density-based scatter plots, operating limits and k-means cluster views to support equipment and brake-system risk analysis.",
        architecture: "Brake sensor data → Power BI data binding → R statistical visualization → correlation and abnormality analysis → pbiviz custom visual → Power BI Desktop and Power BI Service.",
        implementation: "The R implementation builds a kernel-density scatter plot with ggplot2, overlays a fitted trend line and configurable operating limits, and adds marginal distributions for both variables. The wider analysis presents sensor-pair correlation values as standardized abnormality scores and separates brake-temperature and retarder-command behavior into risk-oriented clusters.",
        evidence: "The visual includes an equipment and date filter, fleet selection, sensor-pair correlation values, a blue-to-red abnormality scale and a risk summary for each truck. The detailed plots show the relationship between rear brake temperature and engine cooling flow, including density contours, thresholds and marginal distributions.",
        code: "R source: code.r. The implementation is available below as a collapsed code reference.",
        resources: {
            gallery: [
                {
                    title: "Brake sensor correlation and risk visual",
                    image: "assets/files/projects/03-sql-powerbi-analytics/project306/powerbi-heatmap-spearman.png",
                    alt: "Power BI visual showing brake sensor correlation signatures, density scatter plots and risk clusters",
                    description: "The dashboard combines a correlation signature map with detailed sensor-pair plots and brake-risk clusters. Correlation values are standardized into abnormality scores, while density contours, fitted trends and operating limits help identify unusual relationships between brake temperature, retarder command, engine load, cooling flow and air pressure."
                }
            ],
            codeSectionTitle: "R correlation and density visualization",
            codeSectionDescription: "The R source is kept collapsed by default and can be expanded to inspect the kernel-density scatter plot, marginal distributions, trend line and operating-limit overlays.",
            codeFiles: [
                {
                    name: "code.r",
                    path: "assets/files/projects/03-sql-powerbi-analytics/project306/code.r",
                    language: "r"
                }
            ]
        }
    }
};

const projectDialog = document.getElementById('project-dialog');
const projectDialogTitle = document.getElementById('project-dialog-title');
const projectDialogCategory = document.getElementById('project-dialog-category');
const projectDialogContent = document.getElementById('project-dialog-content');
const projectDialogLinks = document.getElementById('project-dialog-links');

const parseCsv = (csvText) => {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < csvText.length; index += 1) {
        const character = csvText[index];
        const nextCharacter = csvText[index + 1];

        if (character === '"' && quoted && nextCharacter === '"') {
            value += '"';
            index += 1;
        } else if (character === '"') {
            quoted = !quoted;
        } else if (character === ',' && !quoted) {
            row.push(value.trim());
            value = '';
        } else if ((character === '\n' || character === '\r') && !quoted) {
            if (character === '\r' && nextCharacter === '\n') index += 1;
            row.push(value.trim());
            if (row.some((cell) => cell !== '')) rows.push(row);
            row = [];
            value = '';
        } else {
            value += character;
        }
    }

    row.push(value.trim());
    if (row.some((cell) => cell !== '')) rows.push(row);
    return rows;
};

const renderCsvTable = (container, rows) => {
    if (!rows.length) {
        container.innerHTML = '<p class="text-sm text-on-surface-variant">The configuration CSV is empty.</p>';
        return;
    }

    const headers = rows[0];
    const bodyRows = rows.slice(1);
    container.innerHTML = `<div class="overflow-x-auto rounded-lg border border-glass-border">
        <table class="w-full min-w-[560px] text-left text-sm">
            <thead class="bg-white/10 text-pure-white">
                <tr>${headers.map((header) => `<th scope="col" class="px-4 py-3 font-semibold whitespace-nowrap">${escapeHtml(header)}</th>`).join('')}</tr>
            </thead>
            <tbody class="divide-y divide-glass-border">
                ${bodyRows.map((row) => `<tr class="odd:bg-white/[0.02] hover:bg-white/[0.06]">
                    ${headers.map((_, index) => `<td class="px-4 py-3 align-top text-on-surface-variant">${escapeHtml(row[index] || '')}</td>`).join('')}
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
};

const loadCsvTable = async (csvPath) => {
    const container = document.getElementById('project-dialog-csv-table');
    if (!container) return;

    try {
        const response = await fetch(csvPath);
        if (!response.ok) {
            throw new Error(`CSV request failed with status ${response.status}`);
        }
        renderCsvTable(container, parseCsv(await response.text()));
    } catch (error) {
        console.error('Unable to load project configuration CSV.', error);
        container.innerHTML = '<p class="text-sm text-red-300">The configuration table could not be loaded. Use the CSV link below to open the source file.</p>';
    }
};

const loadProjectCode = async (codePath, codeElementId) => {
    const codeElement = document.getElementById(codeElementId);
    if (!codeElement) return;

    try {
        const response = await fetch(codePath);
        if (!response.ok) {
            throw new Error(`Code request failed with status ${response.status}`);
        }
        codeElement.textContent = await response.text();
        if (window.Prism) {
            Prism.highlightElement(codeElement);
        }
    } catch (error) {
        console.error('Unable to load project source code.', error);
        codeElement.textContent = 'The source code could not be loaded. Use the original file link below.';
        codeElement.classList.add('text-red-300');
    }
};

const openProjectDialog = (projectId) => {
    const project = projectDetails[projectId];
    if (!project) return;
    projectDialogCategory.textContent = project.category;
    projectDialogTitle.textContent = project.title;

    let contentHtml = [
        ['Project overview', project.description],
        ['Architecture and data flow', project.architecture],
        ['Technical implementation', project.implementation],
        ['Results and evidence', project.evidence],
        ['Code and documentation', project.code]
    ].map(([heading, text]) => `<section><h4 class="font-headline-md text-[18px] text-pure-white mb-1">${heading}</h4><p class="font-body-md text-[15px] leading-relaxed text-on-surface-variant">${text}</p></section>`).join('');

    if (project.resources) {
        const res = project.resources;
        let resHtml = `<section class="pt-4 border-t border-glass-border space-y-6">
            <h4 class="font-headline-md text-[20px] text-pure-white flex items-center gap-2">
                <span class="material-symbols-outlined text-electric-cyan">folder_open</span>
                Technical Resources & Evidence
            </h4>`;

        if (res.gallery && res.gallery.length > 0) {
            resHtml += `<div class="space-y-5">`;
            res.gallery.forEach((item, index) => {
                const galleryCodeId = item.codeFile
                    ? `project-dialog-gallery-code-${index}`
                    : `project-dialog-gallery-powershell-${index}`;
                resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                    <h5 class="text-[16px] font-semibold text-pure-white mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-sm">account_tree</span>
                        ${item.title}
                    </h5>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl border border-glass-border bg-surface-container-lowest/70 hover:border-glass-border-focus transition-all duration-300">
                        ${item.image ? `<a href="${item.image}" target="_blank" rel="noopener noreferrer" title="Click to view full image" class="shrink-0 w-full sm:w-72 h-40 group relative overflow-hidden rounded-lg border border-glass-border/70 block bg-black/40 shadow-sm">
                            <img src="${item.image}" alt="${item.alt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] text-pure-white font-medium gap-1">
                                <span class="material-symbols-outlined text-sm">zoom_in</span> Zoom
                            </div>
                        </a>` : ''}
                        <p class="flex-1 min-w-0 text-xs text-on-surface-variant leading-relaxed">${item.description}</p>
                    </div>
                    ${item.codeFile ? `<div class="mt-4">
                        <div class="flex items-start justify-between gap-4 mb-2">
                            <h6 class="text-[16px] font-semibold text-pure-white flex items-center gap-2">
                                <span class="material-symbols-outlined text-secondary text-sm">code</span>
                                ${item.codeTitle || 'Source code'}
                            </h6>
                            <a href="${item.codeFile}" target="_blank" rel="noopener noreferrer" class="shrink-0 text-xs text-secondary hover:underline flex items-center gap-1">
                                Open original <span class="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                        </div>
                        <details class="group border border-glass-border rounded-lg bg-surface-container-lowest/80 overflow-hidden">
                            <summary class="cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between font-label-md text-sm text-pure-white select-none">
                                <span class="flex items-center gap-2 font-mono text-xs md:text-sm text-electric-cyan">
                                    <span class="material-symbols-outlined text-secondary text-sm">code</span>
                                    Show implementation
                                </span>
                                <span class="material-symbols-outlined text-xs text-on-surface-variant group-open:rotate-180 transition-transform duration-200">expand_more</span>
                            </summary>
                            <div class="p-4 bg-[#1d1f21] overflow-x-auto max-h-[480px] scrollbar-thin">
                                <pre class="m-0 text-xs font-mono"><code id="${galleryCodeId}" class="language-${item.codeLanguage || 'text'}" style="text-wrap: wrap;">Loading source code...</code></pre>
                            </div>
                        </details>
                    </div>` : ''}
                    ${item.code ? `<div class="mt-4">
                        <h6 class="text-[16px] font-semibold text-pure-white mb-2 flex items-center gap-2">
                            <span class="material-symbols-outlined text-secondary text-sm">code</span>
                            Azure AI Foundry request and Base64 extraction
                        </h6>
                        <div class="p-4 rounded-lg border border-glass-border bg-[#1d1f21] overflow-x-auto max-h-[480px] scrollbar-thin">
                            <pre class="m-0 text-xs font-mono"><code class="language-javascript" style="text-wrap: auto;">${escapeHtml(item.code)}</code></pre>
                        </div>
                    </div>` : ''}
                    ${item.powershellFile ? `<div class="mt-4">
                        <div class="flex items-start justify-between gap-4 mb-2">
                            <h6 class="text-[16px] font-semibold text-pure-white flex items-center gap-2">
                                <span class="material-symbols-outlined text-secondary text-sm">terminal</span>
                                PowerShell deployment script
                            </h6>
                            <a href="${item.powershellFile}" target="_blank" rel="noopener noreferrer" class="shrink-0 text-xs text-secondary hover:underline flex items-center gap-1">
                                Open original <span class="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                        </div>
                        <details class="group border border-glass-border rounded-lg bg-surface-container-lowest/80 overflow-hidden">
                            <summary class="cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between font-label-md text-sm text-pure-white select-none">
                                <span class="flex items-center gap-2 font-mono text-xs md:text-sm text-electric-cyan">
                                    <span class="material-symbols-outlined text-secondary text-sm">code</span>
                                    Show PowerShell implementation
                                </span>
                                <span class="material-symbols-outlined text-xs text-on-surface-variant group-open:rotate-180 transition-transform duration-200">expand_more</span>
                            </summary>
                            <div class="p-4 bg-[#1d1f21] overflow-x-auto max-h-[480px] scrollbar-thin" style="width: 770px;">
                                <pre class="m-0 text-xs font-mono"><code id="${galleryCodeId}" class="language-powershell" style="text-wrap: wrap;">Loading PowerShell source...</code></pre>
                            </div>
                        </details>
                    </div>` : ''}
                </div>`;
            });
            resHtml += `</div>`;
        }

        if (res.notebookHtml) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">code</span>
                    2. Fabric notebook implementation
                </h5>
                <p class="text-xs text-on-surface-variant mb-4">
                    Interactive HTML view of the Jupyter notebook used to load the Delta table from the OneLake catalog and generate the sensor heatmap analysis.
                </p>
                ${res.notebookHtml ? `<div class="rounded-lg border border-glass-border overflow-hidden bg-black/40 h-[560px] mb-4">
                    <iframe src="${res.notebookHtml}" title="Fabric sensor heatmap notebook" class="w-full h-full border-0" loading="lazy"></iframe>
                </div>` : ''}
            </div>`;
        }

        if (res.csv) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">table_view</span>
                    Configuration field reference
                </h5>
                <p class="text-xs text-on-surface-variant mb-4">The CSV documents the purpose of each configuration field, including staging paths, target tables, worksheet rules, ingestion groups and watermark settings.</p>
                <div id="project-dialog-csv-table" class="mb-4" aria-live="polite">
                    <p class="text-sm text-on-surface-variant">Loading configuration fields...</p>
                </div>
                <a href="${res.csv}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-glass-border bg-surface-container-lowest/80 hover:bg-white/10 text-pure-white text-sm font-label-md transition-all duration-200">
                    <span class="material-symbols-outlined text-electric-cyan text-sm">description</span>
                    Open column descriptions CSV
                    <span class="material-symbols-outlined text-xs text-on-surface-variant">open_in_new</span>
                </a>
            </div>`;
        }

        if (res.yamlParameters && res.yamlParameters.length > 0) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">settings</span>
                    3. app.yaml environment configuration
                </h5>
                <p class="text-xs text-on-surface-variant mb-4">Each deployment parameter defines how the Databricks App starts and which governed Databricks resources the Streamlit pages use.</p>
                <div class="overflow-x-auto rounded-lg border border-glass-border">
                    <table class="w-full min-w-[620px] text-left text-sm">
                        <thead class="bg-white/10 text-pure-white">
                            <tr>
                                <th scope="col" class="px-4 py-3 font-semibold">Parameter</th>
                                <th scope="col" class="px-4 py-3 font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-glass-border">
                            ${res.yamlParameters.map(([parameter, description]) => `<tr class="odd:bg-white/[0.02] hover:bg-white/[0.06]">
                                <td class="px-4 py-3 align-top font-mono text-electric-cyan whitespace-nowrap">${escapeHtml(parameter)}</td>
                                <td class="px-4 py-3 align-top text-on-surface-variant">${escapeHtml(description)}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
                <a href="${res.yamlFile}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-lg border border-glass-border bg-surface-container-lowest/80 hover:bg-white/10 text-pure-white text-sm font-label-md transition-all duration-200">
                    <span class="material-symbols-outlined text-electric-cyan text-sm">description</span>
                    Open app.yaml
                    <span class="material-symbols-outlined text-xs text-on-surface-variant">open_in_new</span>
                </a>
            </div>`;
        }

        if (res.codeFiles && res.codeFiles.length > 0) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">integration_instructions</span>
                    ${escapeHtml(res.codeSectionTitle || 'Source code')}
                </h5>
                <p class="text-xs text-on-surface-variant mb-4">${escapeHtml(res.codeSectionDescription || 'The source code is kept collapsed by default and can be expanded for inspection.')}</p>
                <div class="space-y-3">
                    ${res.codeFiles.map((item, index) => {
                        const codeId = `project-dialog-code-${index}`;
                        return `<details class="group border border-glass-border rounded-lg bg-surface-container-lowest/80 overflow-hidden">
                            <summary class="cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between font-label-md text-sm text-pure-white select-none">
                                <span class="flex items-center gap-2 font-mono text-xs md:text-sm text-electric-cyan">
                                    <span class="material-symbols-outlined text-secondary text-sm">code</span>
                                    ${escapeHtml(item.name)}
                                </span>
                                <span class="material-symbols-outlined text-xs text-on-surface-variant group-open:rotate-180 transition-transform duration-200">expand_more</span>
                            </summary>
                            <div class="p-4 bg-[#1d1f21] overflow-x-auto max-h-[480px] scrollbar-thin">
                                <pre class="m-0 text-xs font-mono"><code id="${codeId}" class="language-${escapeHtml(item.language || 'text')}" style="text-wrap: auto;">Loading source code...</code></pre>
                            </div>
                        </details>`;
                    }).join('')}
                </div>
            </div>`;
        }

        if (res.galleryAfterCode && res.galleryAfterCode.length > 0) {
            resHtml += `<div class="space-y-5">`;
            res.galleryAfterCode.forEach((item) => {
                resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                    <h5 class="text-[16px] font-semibold text-pure-white mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-sm">account_tree</span>
                        ${item.title}
                    </h5>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl border border-glass-border bg-surface-container-lowest/70 hover:border-glass-border-focus transition-all duration-300">
                        <a href="${item.image}" target="_blank" rel="noopener noreferrer" title="Click to view full image" class="shrink-0 w-full sm:w-72 h-40 group relative overflow-hidden rounded-lg border border-glass-border/70 block bg-black/40 shadow-sm">
                            <img src="${item.image}" alt="${item.alt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] text-pure-white font-medium gap-1">
                                <span class="material-symbols-outlined text-sm">zoom_in</span> Zoom
                            </div>
                        </a>
                        <p class="flex-1 min-w-0 text-xs text-on-surface-variant leading-relaxed">${item.description}</p>
                    </div>
                </div>`;
            });
            resHtml += `</div>`;
        }

        if (res.gallery && res.notebookIframe) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">terminal</span>
                    4. Databricks incremental ingestion notebook
                </h5>
                <p class="text-xs text-on-surface-variant mb-3">The notebook orchestrates full and incremental Excel ingestion into Delta Lake using watermark-based change tracking.</p>
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs text-on-surface-variant flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs text-electric-cyan">code</span>
                        Interactive notebook view
                    </p>
                    <a href="${res.notebookIframe}" target="_blank" rel="noopener noreferrer" class="text-xs text-secondary hover:underline flex items-center gap-1">
                        Open in new tab <span class="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                </div>
                <div class="rounded-lg border border-glass-border overflow-hidden bg-black/40 h-[480px]">
                    <iframe src="${res.notebookIframe}" title="Databricks incremental ingestion notebook" class="w-full h-full border-0" loading="lazy"></iframe>
                </div>
            </div>`;
        }

        if (res.activityImage || res.powershellFile) {
            resHtml += `<div class="space-y-5">
                <h5 class="font-headline-md text-[20px] text-pure-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-electric-cyan">engineering</span>
                    ADF notebook path migration evidence
                </h5>`;

            if (res.activityImage) {
                resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                    <h6 class="text-[16px] font-semibold text-pure-white mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-sm">account_tree</span>
                        1. Databricks notebook path configuration
                    </h6>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl border border-glass-border bg-surface-container-lowest/70">
                        <a href="${res.activityImage}" target="_blank" rel="noopener noreferrer" title="Open the full activity configuration" class="shrink-0 w-full sm:w-72 h-40 group relative overflow-hidden rounded-lg border border-glass-border/70 block bg-black/40 shadow-sm">
                            <img src="${res.activityImage}" alt="Azure Data Factory Databricks notebook path configuration" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] text-pure-white font-medium gap-1">
                                <span class="material-symbols-outlined text-sm">zoom_in</span> Zoom
                            </span>
                        </a>
                        <p class="flex-1 min-w-0 text-xs text-on-surface-variant leading-relaxed">
                            The ADF activity settings show the Databricks notebook path and the base parameters passed by the pipeline. The automation updates this path consistently across all affected pipelines.
                        </p>
                    </div>
                </div>`;
            }

            if (res.powershellFile) {
                resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                    <div class="flex items-start justify-between gap-4 mb-2">
                        <h6 class="text-[16px] font-semibold text-pure-white flex items-center gap-2">
                            <span class="material-symbols-outlined text-secondary text-sm">terminal</span>
                            2. PowerShell migration script
                        </h6>
                        <a href="${res.powershellFile}" target="_blank" rel="noopener noreferrer" class="shrink-0 text-xs text-secondary hover:underline flex items-center gap-1">
                            Open original <span class="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                    </div>
                    <p class="text-xs text-on-surface-variant mb-4">The script discovers every pipeline, traverses nested activities and replaces the legacy Databricks repository prefix with the new path before updating ADF.</p>
                    <details class="group border border-glass-border rounded-lg bg-surface-container-lowest/80 overflow-hidden">
                        <summary class="cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between font-label-md text-sm text-pure-white select-none">
                            <span class="flex items-center gap-2 font-mono text-xs md:text-sm text-electric-cyan">
                                <span class="material-symbols-outlined text-secondary text-sm">code</span>
                                Show PowerShell implementation
                            </span>
                            <span class="material-symbols-outlined text-xs text-on-surface-variant group-open:rotate-180 transition-transform duration-200">expand_more</span>
                        </summary>
                        <div class="p-4 bg-[#1d1f21] overflow-x-auto max-h-[480px] scrollbar-thin" style="width: 770px;">
                            <pre class="m-0 text-xs font-mono"><code id="project-dialog-powershell-code" class="language-powershell" style="text-wrap: wrap;">Loading PowerShell source...</code></pre>
                        </div>
                    </details>
                </div>`;
            }

            resHtml += `</div>`;
        }

        // 1. Pipeline Image and Collapsible JSON Code
        if (res.pipelineImage || res.pipelineJson) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">account_tree</span>
                    1. ADF Pipeline Architecture & Definition
                </h5>`;
            if (res.pipelineImage) {
                resHtml += `<div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl border border-glass-border bg-surface-container-lowest/70 hover:border-glass-border-focus transition-all duration-300">
                    <a href="${res.pipelineImage}" target="_blank" title="Click to view full image" class="shrink-0 w-full sm:w-72 h-40 group relative overflow-hidden rounded-lg border border-glass-border/70 block bg-black/40 shadow-sm">
                        <img src="${res.pipelineImage}" alt="ADF Pipeline PL_Ingestion_004_SqlParallel" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] text-pure-white font-medium gap-1">
                            <span class="material-symbols-outlined text-sm">zoom_in</span> Zoom
                        </div>
                    </a>
                    <div class="flex-1 min-w-0 py-0.5 space-y-1.5">
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            Diagrama de flujo del pipeline de ingesta paralela estructurada en ADF. Haz clic en la miniatura para visualizar la captura original en alta resolución.
                        </p>
                    </div>

                </div>`;
            }
            if (res.pipelineJson) {
                resHtml += `<div class="mt-3">
                    <a href="${res.pipelineJson}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-glass-border bg-surface-container-lowest/80 hover:bg-white/10 text-pure-white text-sm font-label-md transition-all duration-200 group">
                        <span class="material-symbols-outlined text-electric-cyan text-sm">data_object</span>
                        <span>Pipeline JSON Definition (PL_Ingestion_004_SqlParallel.json)</span>
                        <span class="material-symbols-outlined text-xs text-on-surface-variant group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">open_in_new</span>
                    </a>
                </div>`;
            }
            resHtml += `</div>`;
        }

        // 2. Parallel Ingestion Image and Notebook in Iframe
        if (res.parallelImage || (res.notebookIframe && !res.gallery)) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">bolt</span>
                    2. Parallel Ingestion Flow & Databricks Notebook
                </h5>`;
            if (res.parallelImage) {
                resHtml += `<div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl border border-glass-border bg-surface-container-lowest/70 hover:border-glass-border-focus transition-all duration-300">
                    <a href="${res.parallelImage}" target="_blank" title="Click to view full image" class="shrink-0 w-full sm:w-72 h-40 group relative overflow-hidden rounded-lg border border-glass-border/70 block bg-black/40 shadow-sm">
                        <img src="${res.parallelImage}" alt="ADF Pipeline PL_Ingestion_004_SqlParallel" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] text-pure-white font-medium gap-1">
                            <span class="material-symbols-outlined text-sm">zoom_in</span> Zoom
                        </div>
                    </a>
                    <div class="flex-1 min-w-0 py-0.5 space-y-1.5">
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            Parallel execution flowchart for structured data ingestion. Click the thumbnail to view the original screenshot in high resolution.
                        </p>
                    </div>

                </div>`;
            }
            if (res.notebookIframe) {
                resHtml += `<div class="mt-3">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-xs text-on-surface-variant flex items-center gap-1">
                            <span class="material-symbols-outlined text-xs text-electric-cyan">terminal</span>
                            Databricks Interactive Notebook View (Delta Incremental Load)
                        </p>
                        <a href="${res.notebookIframe}" target="_blank" rel="noopener noreferrer" class="text-xs text-secondary hover:underline flex items-center gap-1">
                            Open in new tab <span class="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                    </div>
                    <div class="rounded-lg border border-glass-border overflow-hidden bg-black/40 h-[480px]">
                        <iframe src="${res.notebookIframe}" title="Databricks Notebook" class="w-full h-full border-0" loading="lazy"></iframe>
                    </div>
                </div>`;
            }
            resHtml += `</div>`;
        }

        // 3. List of codes: ClusterIngestion
        if (res.clusterCodes && res.clusterCodes.length > 0) {
            resHtml += `<div class="glass-panel rounded-xl p-5 border border-glass-border bg-white/[0.02]">
                <h5 class="text-[16px] font-semibold text-pure-white mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-sm">integration_instructions</span>
                    3. Cluster Ingestion Python Notebooks (Global/ClusterIngestion)
                </h5>
                <p class="text-xs text-on-surface-variant mb-4">Databricks driver & multi-threaded orchestration scripts for parallel SQL extraction and Delta MERGE.</p>
                <div class="space-y-3">`;

            res.clusterCodes.forEach(item => {
                resHtml += `<details class="group border border-glass-border rounded-lg bg-surface-container-lowest/80 overflow-hidden">
                    <summary class="cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between font-label-md text-sm text-pure-white select-none">
                        <span class="flex items-center gap-2 font-mono text-xs md:text-sm text-electric-cyan">
                            <span class="material-symbols-outlined text-secondary text-sm">code</span>
                            ${item.name}
                        </span>
                        <span class="material-symbols-outlined text-xs text-on-surface-variant group-open:rotate-180 transition-transform duration-200">expand_more</span>
                    </summary>
                    <div class="p-4 bg-[#1d1f21] overflow-x-auto max-h-[380px] scrollbar-thin">
                        <pre class="m-0 text-xs font-mono"><code class="language-python" style="text-wrap: auto;">${escapeHtml(item.code)}</code></pre>
                    </div>
                </details>`;
            });

            resHtml += `</div></div>`;
        }

        resHtml += `</section>`;
        contentHtml += resHtml;
    }

    projectDialogContent.innerHTML = contentHtml;
    projectDialogLinks.innerHTML = (project.links || []).map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-full border border-glass-border hover:bg-white/10 transition-colors font-label-md text-label-md text-pure-white flex items-center gap-1">${link.label}<span class="material-symbols-outlined align-middle text-sm">open_in_new</span></a>`).join('');

    projectDialog.showModal();

    if (project.resources?.csv) {
        loadCsvTable(project.resources.csv);
    }

    if (project.resources?.powershellFile) {
        loadProjectCode(project.resources.powershellFile, 'project-dialog-powershell-code');
    }

    project.resources?.gallery?.forEach((item, index) => {
        if (item.powershellFile) {
            loadProjectCode(item.powershellFile, `project-dialog-gallery-powershell-${index}`);
        }
        if (item.codeFile) {
            loadProjectCode(item.codeFile, `project-dialog-gallery-code-${index}`);
        }
    });

    if (project.resources?.codeFiles) {
        project.resources.codeFiles.forEach((item, index) => {
            loadProjectCode(item.path, `project-dialog-code-${index}`);
        });
    }

    if (window.Prism) {
        setTimeout(() => {
            Prism.highlightAllUnder(projectDialogContent);
        }, 10);
    }
};

const escapeHtml = (unsafe) => {
    return (unsafe || '')
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

document.querySelectorAll('.project-details-btn').forEach((button) => {
    button.addEventListener('click', () => openProjectDialog(button.dataset.project));
});

const projectDialogClose = document.getElementById('project-dialog-close');
if (projectDialogClose) {
    projectDialogClose.addEventListener('click', () => projectDialog.close());
}

if (projectDialog) {
    projectDialog.addEventListener('click', (event) => {
        if (event.target === projectDialog) projectDialog.close();
    });
}
