using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Repositories;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;

        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        [HttpGet("volume")]
        public async Task<ActionResult<IEnumerable<ChartDataDto>>> GetTradeVolume()
        {
            try
            {
                var data = await _reportRepository.GetTradeVolumeByType();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching report data", Details = ex.Message });
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
             try
            {
                var data = await _reportRepository.GetDashboardStats();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching stats", Details = ex.Message });
            }
        }
    }
}
