using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using System;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TradeController : ControllerBase
    {
        [HttpPost("apply")]
        public ActionResult<TradeApplicationResponseDto> SubmitApplication([FromBody] TradeApplicationDto request)
        {
            // MOCK SUBMISSION LOGIC
            // In a real scenario, this would save to the database

            var response = new TradeApplicationResponseDto
            {
                ApplicationId = new Random().Next(1000, 9999),
                ReferenceNumber = $"REF-{DateTime.Now:yyyyMMdd}-{new Random().Next(100, 999)}",
                Status = "Submitted",
                SubmissionDate = DateTime.Now
            };

            return Ok(response);
        }

        [HttpGet("dashboard-summary")]
        public IActionResult GetDashboardStats()
        {
             // MOCK DASHBOARD DATA
             return Ok(new 
             {
                 LCOutstanding = 1200000,
                 BGLiability = 850000,
                 PendingApprovals = 12,
                 CountryRiskHigh = 2
             });
        }
    }
}
