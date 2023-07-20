
public class RequestModel
{
    public double InitialInvestment { get; set; }
    public double Lower { get; set; }
    public double Upper { get; set; }
    public double RateIncrement { get; set; }
    public required double[] CashFlows { get; set; }
}
