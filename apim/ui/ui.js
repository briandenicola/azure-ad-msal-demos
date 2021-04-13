// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
const cardDiv = document.getElementById("card-div");
const outputDiv = document.getElementById("output-div");

function showWelcomeMessage(username) {
    // Reconfiguring DOM elements
    cardDiv.style.display = 'initial';
    welcomeDiv.innerHTML = `Welcome ${username}`;
    signInButton.setAttribute("onclick", "signOut();");
    signInButton.setAttribute('class', "btn btn-success")
    signInButton.innerHTML = "Sign Out";
}

function updateUI(data, endpoint) {
    console.log(endpoint + 'API responded at: ' + new Date().toString());
    console.log(data);

    outputDiv.innerHTML = '';
    const token = document.createElement('p');
    token.innerHTML = "<strong>Token: </strong>" + data.Authorization;

    const clientip = document.createElement('p');
    clientip.innerHTML = "<strong>Client IP: </strong>" + data["CLIENT-IP"];

    const forwardfor = document.createElement('p');
    forwardfor.innerHTML = "<strong>X-FORWARDED-FOR: </strong>" + data["X-Forwarded-For"];

    const principalid = document.createElement('p');
    principalid.innerHTML = "<strong>Principal ID: </strong>" + data["X-MS-CLIENT-PRINCIPAL-ID"];

    if (endpoint === apiConfig.apimEndpoint) {
        const subscriptionKey = document.createElement('p');
        subscriptionKey.innerHTML = "<strong>APIM Key: </strong>" + data["ocp-apim-subscription-key"];
    
        const correlationId = document.createElement('p');
        correlationId.innerHTML = "<strong>Correlation Id: </strong>" + data["Correlation-Id"];
    
        outputDiv.appendChild(subscriptionKey);
        outputDiv.appendChild(correlationId);
    } 

    outputDiv.appendChild(token);
    outputDiv.appendChild(clientip);
    outputDiv.appendChild(forwardfor);
    outputDiv.appendChild(principalid);
}
