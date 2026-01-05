using System.Collections.Generic;
using System.Threading.Tasks;

namespace TradeFinanceSystem.API.Repositories
{
    public class AuditLogDto
    {
        public int LogID { get; set; }
        public string Action { get; set; }
        public string EntityName { get; set; }
        public string EntityID { get; set; }
        public string PerformedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string Details { get; set; }
    }

    public interface IAuditRepository
    {
        Task LogAction(string action, string entityName, string entityId, string performedBy, string? details = null);
        Task<IEnumerable<AuditLogDto>> GetRecentLogs();
    }
}
