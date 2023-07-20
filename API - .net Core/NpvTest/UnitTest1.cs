using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using Microsoft.VisualStudio.TestPlatform.TestHost;

public class NPVControllerIntegrationTests
{
    [Fact]
    public async Task CalculateNpv_Endpoint_ReturnsOk()
    {
        await using var application = new WebApplicationFactory<Program>();
        using var _client = application.CreateClient();
        // Arrange
        var request = new
        {
            InitialInvestment = 1000.0,
            Lower = 1.0,
            Upper = 5.0,
            RateIncrement = 1.0,
            CashFlows = new double[] { 100, 200, 300 }
        };

        var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/calculatenpv", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var npvResults = await response.Content.ReadAsStringAsync();
        var jsonResults = "[{\"rate\":1,\"npv\":-413.75},{\"rate\":2,\"npv\":-427.03},{\"rate\":3,\"npv\":-439.85},{\"rate\":4,\"npv\":-452.24},{\"rate\":5,\"npv\":-464.2}]";

        Assert.Equal(jsonResults, npvResults);
    }

    [Fact]
    public async Task CalculateNpv_Endpoint_ReturnsBadRequest()
    {
        await using var application = new WebApplicationFactory<Program>();
        using var _client = application.CreateClient();
        // Arrange
        var request = new
        {
            InitialInvestment = 1000.0,
            Lower = 5.0,
            Upper = 1,
            RateIncrement = 0,
            CashFlows = new double[] { 100, 200, 300 }
        };

        var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/calculatenpv", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
