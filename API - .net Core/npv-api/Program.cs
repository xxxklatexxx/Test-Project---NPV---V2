
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyHeader()
           .AllowAnyMethod();
});

app.UseHttpsRedirection();
app.MapPost("/calculatenpv", (NpvRequest request) =>
{

    var npvResults = new List<NpvResult>();
    var rates = CreateIncrementedArray(request.Lower, request.Upper, (double)request.RateIncrement);

    for (double rate = request.Lower; rate <= request.Upper; rate += request.RateIncrement)
    {
        double npv = 0;
        double discountedCashFlow;

        for (int i = 1; i < request.CashFlows.Length; i++)
        {
            discountedCashFlow = request.CashFlows[i] / (double)Math.Pow((double)(1 + rate), i + 1);
            npv += discountedCashFlow;
        }

        npvResults.Add(new NpvResult() { Npv = request.CashFlows[0] - npv, Rate = rate});
    }

    return Results.Ok(npvResults);
})
.WithName("CalculateNpv")
.WithOpenApi();



app.Run();

double[] CreateIncrementedArray(double start, double end, double increment)
{
    int size = (int)Math.Ceiling((end - start) / increment) + 1;
    double[] array = new double[size];

    for (int i = 0; i < size; i++)
    {
        array[i] = start + i * increment;
    }

    return array;
}

public class NpvRequest
{
    public double Lower { get; set; }
    public double Upper { get; set; }
    public double RateIncrement { get; set; }
    public double[] CashFlows { get; set; }
}

public class NpvResult
{
    private double rate;
    private double npv;

    public double Rate
    {
        get => rate;
        set => rate = Math.Round(value, 2);
    }
    public double Npv
    {
        get => npv;
        set => npv = Math.Round(value, 2);
    }
}