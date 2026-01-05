using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Repositories;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApprovalController : ControllerBase
    {
        private readonly IApprovalRepository _approvalRepository;

        public ApprovalController(IApprovalRepository approvalRepository)
        {
            _approvalRepository = approvalRepository;
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<PendingApprovalDto>>> GetPendingApprovals()
        {
            try
            {
                var PendingItems = await _approvalRepository.GetPendingApprovals();
                return Ok(PendingItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching approvals", Details = ex.Message });
            }
        }

        [HttpPost("action")]
        public async Task<ActionResult> ProcessAction([FromBody] ApprovalActionDto action)
        {
            try
            {
                var success = await _approvalRepository.ProcessApproval(action);
                if (success)
                {
                    return Ok(new { Message = $"Transaction {action.ReferenceNumber} has been {action.Action}d." });
                }
                else
                {
                    return BadRequest(new { Message = "Failed to update status. Transaction not found or already processed." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error processing approval", Details = ex.Message });
            }
        }
    }
}
