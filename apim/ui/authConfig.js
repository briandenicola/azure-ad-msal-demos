const msalConfig = {
    auth: {
        clientId: "{{replace_me_ui_client_id}}",
        authority: "https://login.microsoftonline.com/{{replace_me_aad_tenant_id}}",
        redirectUri: "https://{{replace_me_storage_account_name}}.z19.web.core.windows.net",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case msal.LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case msal.LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case msal.LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case msal.LogLevel.Warning:		
                        console.warn(message);		
                        return;		
                }	
            }	
        }	
    }
};

const loginRequest = {
    scopes: ["User.Read"]
};

const tokenRequest = {
    scopes: ["api://{{replace_me_api_client_id}}/App.Read.All"]
}