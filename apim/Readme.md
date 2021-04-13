# Prerequistes 
* Azure AD Tenanat ID
* [The Azure Function commandline tool](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash#v2)
* [The Azure cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt)


# Deployment Steps

## Define Parameters
_Define the following in infrastructure\azuredeploy.parameters.json and keep a copy of the values handy. They will referenced throughout the setup_
    * functionName - Name of the function app to host your API
    * apimName - Name of Azure API Management to protect your API
    * uiStorageName - Name of Azure Storage to host the APP UI

## Create Azure AD Application Registrations 
### API 
    * Name - api
    * Authentication
        * Web Platform
        * Redirect Uri
        - https://{{functionName}}.azurewebsites.net/.auth/login/aad/callback
    * Expose an API
        * Set App Id
        - api://{{apiClientId}}
        * Add Scopes
        - App.Read.All
        * Final format should be similiar to : _api://d315026a-4777-4150-8054-bf69cccc613a/App.Read.All_
    * Edit Manifest
      * Update accessTokenAcceptedVersion from null to 2
    * Save copy of Client ID. Will be referenced as apiClientID
### APIM 
    * Name - apim
    * Authentication 
        * Web Platform
        * Redirect Uri
        - http://localhost
    * Certificates & Secrets
        * Create a new Client Secrets. Save a copy
    * API Permissions
        * Grant delegated access API's 'App.Read.All' Scope 
    * Edit Manifest
        * Update accessTokenAcceptedVersion from null to 2
    Save copy of Client ID. Will be referenced as apimClientID
### UI
    * Name - ui
    * Authentication     
        * Add Single-page Application.
        * Redirect URIs
        - http://localhost:300
        - https://{{uiStorageName}}.z19.web.core.windows.net
    * API Permissions
        * Grant delegated access API's 'App.Read.All' Scope 
    * Edit Manifest
        * Update accessTokenAcceptedVersion from null to 2 
    * Save copy of Client ID. Will be referenced as uiClientID

## Create Infrastructure
1. Update azuredeploy.paraemeters.json with apiClientId and apimClientId values
2. az login
3. az group create -n AAD_APIM_Test_RG -l centralus
4. az group deployment create -g AAD_APIM_Test_RG  --template-file infrastructure/azuredeploy.json --parameters @infrastructure/azuredeploy.parameters.json
_* Copy the SubscriptionKey from the output_
5. az storage blob service-properties update --account-name {{uiStorageName}} --static-website --404-document "404.html" --index-document "index.html"
6. az webapp auth update -g AAD_APIM_Test_RG -n {{functionName}} --enabled true --action LoginWithAzureActiveDirectory --aad-client-id {{apiClientID}} --aad-token-issuer-url "https://login.microsoftonline.com/{{tenantid}}/v2.0"

## Deploy API
1. func azure functionapp publish {{functionName} --csharp

## Deploy UI
1. Update ui\apiConfig.js with proper values defined above
const apiConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    directEndpoint: "https://{{replace_me_functionName}}.azurewebsites.net/api/headers",
    apimEndpoint: "https://{{replace_me_apimName}}.azure-api.net/api/headers",
    apimSubscriptionKey: "{{replace_me_apim_subscription_key}}" #Taken from the Infrastructure Deployment Output
};
2. Update ui\authConfig.js with uiClientID Azure AD Client ID and values defined above
const msalConfig = {
    auth: {
        clientId: "{{replace_me_uiClientID}}",
        authority: "https://login.microsoftonline.com/{{replace_me_aad_tenant_id}}",
        redirectUri: "https://{{replace_me_uiStorageName}}.z19.web.core.windows.net",
    },
3. Publish to Storage Account Name
* az storage copy --source-local-path "ui/*" --destination-account-name {{uiStorageName}} --destination-container \$web --recursive --put-md5
