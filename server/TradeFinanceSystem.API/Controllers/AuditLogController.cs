using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.Repositories;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly IAuditRepository _auditRepository;

        public AuditLogController(IAuditRepository auditRepository)
        {
            _auditRepository = auditRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetRecentLogs()
        {
            try
            {
                var logs = await _auditRepository.GetRecentLogs();
                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching audit logs", Details = ex.Message });
            }
        }
    }
}
