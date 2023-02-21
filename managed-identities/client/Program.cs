using System;
using Azure.Core;
using Azure.Identity;
using System.Net.Http;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false);

var config = builder.Build();
var myAPI = config.GetSection("MyApi").Get<MyApi>();

string[] resources = new string[] { myAPI.resourceId };
var tokenRequestContext = new TokenRequestContext(resources);
var tokenRequestResult = await new DefaultAzureCredential().GetTokenAsync(tokenRequestContext);

var httpClient = new HttpClient();
var t = "Bearer " + tokenRequestResult.Token;
httpClient.DefaultRequestHeaders.Add("Authorization",t);
HttpResponseMessage response = await httpClient.GetAsync( myAPI.uri );
Console.WriteLine( await response.Content.ReadAsStringAsync() );

public class MyApi
{
    public string resourceId { get; set; }
    public string uri { get; set; }
}