using Dapper;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly DapperContext _context;

        public ReportRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChartDataDto>> GetTradeVolumeByType()
        {
            // Aggregating LC amounts by Type (Import vs Export)
            // Assuming LCType is 'Import' or 'Export'
            var query = @"
                SELECT LCType as Label, SUM(Amount) as Value1
                FROM LC_Master
                GROUP BY LCType
                UNION ALL
                SELECT 'BG ' + BGType as Label, SUM(Amount) as Value1
                FROM BG_Master
                GROUP BY BGType";

            using (var connection = _context.CreateConnection())
            {
                return await connection.QueryAsync<ChartDataDto>(query);
            }
        }

        public async Task<DashboardStatsDto> GetDashboardStats()
        {
            var query = @"
                SELECT 
                    (SELECT COUNT(*) FROM LC_Master) as TotalLCs,
                    (SELECT COUNT(*) FROM BG_Master) as TotalBGs,
                    (SELECT COALESCE(SUM(Amount),0) FROM LC_Master) + (SELECT COALESCE(SUM(Amount),0) FROM BG_Master) as TotalExposure,
                    (SELECT COUNT(*) FROM LC_Master WHERE Status = 'Submitted') + 
                    (SELECT COUNT(*) FROM BG_Master WHERE Status = 'Submitted') + 
                    (SELECT COUNT(*) FROM TradeLoans WHERE Status = 'Submitted') +
                    (SELECT COUNT(*) FROM Collections WHERE Status = 'Submitted') as PendingApprovals
            ";

            using (var connection = _context.CreateConnection())
            {
                return await connection.QuerySingleAsync<DashboardStatsDto>(query);
            }
        }
    }
}
