const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";

myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.error(error);
    });

function selectAccount () {
    const currentAccounts = myMSALObj.getAllAccounts();

    if (currentAccounts.length === 0) {
        return;
    } else if (currentAccounts.length > 1) {
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
        showWelcomeMessage(username);
    }
}

function handleResponse(response) {
    if (response !== null) {
        username = response.account.username;
        showWelcomeMessage(username);
    } else {
        selectAccount();
    }
}

function signIn() {
    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username)
    };

    myMSALObj.logout(logoutRequest);
}

function getTokenRedirect(request) {
    request.account = myMSALObj.getAccountByUsername(username);

    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof msal.InteractionRequiredAuthError) {
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.warn(error);   
            }
        });
}

function callApiDirectly () {
    getTokenRedirect(tokenRequest)
        .then(response => {
            callApiEndpoint(apiConfig.directEndpoint, response.accessToken, updateUI);
        }).catch(error => {
            console.error(error);
        });
}

function callApiViaApim () {
    getTokenRedirect(tokenRequest)
        .then(response => {
            callApiEndpoint(apiConfig.apimEndpoint, response.accessToken, updateUI);
        }).catch(error => {
            console.error(error);
        });
}