namespace TradeFinanceSystem.API.DTOs
{
    public class ChartDataDto
    {
        public string Label { get; set; } // e.g., "Jan", "Feb" or "Import", "Export"
        public decimal Value1 { get; set; } // e.g., Import Amount
        public decimal Value2 { get; set; } // e.g., Export Amount
    }

    public class DashboardStatsDto
    {
        public int TotalLCs { get; set; }
        public int TotalBGs { get; set; }
        public decimal TotalExposure { get; set; }
        public int PendingApprovals { get; set; }
    }
}
