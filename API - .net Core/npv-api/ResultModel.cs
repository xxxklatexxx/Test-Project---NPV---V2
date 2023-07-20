
public class ResultModel
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