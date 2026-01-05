using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface IReportRepository
    {
        Task<IEnumerable<ChartDataDto>> GetTradeVolumeByType();
        Task<DashboardStatsDto> GetDashboardStats();
    }
}
