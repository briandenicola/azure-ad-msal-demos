using System;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using System.Net.Http;
using System.Net.Http.Headers;

namespace client
{
    class Program
    {
        static void Main(string[] args)
        {
            RunAsync().GetAwaiter().GetResult();
        }

        private static async Task RunAsync() {
            IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create("eb0f6102-***************************")
                    .WithClientSecret("f_x43************************************")
                    .WithAuthority(new Uri("https://login.microsoftonline.com/834bd397-***************************"))
                    .Build();

            string[] resources = new string[] { "api://811da938--***************************/.default" };

            AuthenticationResult result = await app.AcquireTokenForClient(resources).ExecuteAsync();
            Console.WriteLine("Token acquired: " + result.AccessToken);

            var httpClient = new HttpClient();
            var t = "Bearer " + result.AccessToken;
            httpClient.DefaultRequestHeaders.Add("Authorization",t);
            HttpResponseMessage response = await httpClient.GetAsync("http://localhost:5000/WeatherForecast");
            Console.WriteLine( await response.Content.ReadAsStringAsync() );
        }
    }
}
