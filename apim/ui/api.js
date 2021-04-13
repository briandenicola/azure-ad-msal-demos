function callApiEndpoint(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    headers.append("Ocp-Apim-Subscription-Key", apiConfig.apimSubscriptionKey);
    
    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to bjdfunc API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}
