using Dapper;
using TradeFinanceSystem.API.Data;

namespace TradeFinanceSystem.API.Repositories
{
    public class AuditRepository : IAuditRepository
    {
        private readonly DapperContext _context;

        public AuditRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task LogAction(string action, string entityName, string entityId, string performedBy, string? details = null)
        {
            var query = @"INSERT INTO AuditLogs (Action, EntityName, EntityID, PerformedBy, Timestamp, Details)
                          VALUES (@Action, @EntityName, @EntityID, @PerformedBy, GETDATE(), @Details)";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { Action = action, EntityName = entityName, EntityID = entityId, PerformedBy = performedBy, Details = details });
            }
        }

        public async Task<IEnumerable<AuditLogDto>> GetRecentLogs()
        {
            var query = "SELECT TOP 50 * FROM AuditLogs ORDER BY Timestamp DESC";
            
            using (var connection = _context.CreateConnection())
            {
                return await connection.QueryAsync<AuditLogDto>(query);
            }
        }
    }
}
