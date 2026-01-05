using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Repositories;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BGController : ControllerBase
    {
        private readonly IBGRepository _bgRepository;

        public BGController(IBGRepository bgRepository)
        {
            _bgRepository = bgRepository;
        }

        [HttpPost("issue")]
        public async Task<ActionResult<BGResponseDto>> IssueBG([FromBody] BGIssueRequestDto request)
        {
            try
            {
                var bgNumber = await _bgRepository.CreateBG(request);

                var response = new BGResponseDto
                {
                    BGReferenceNumber = bgNumber,
                    Status = "Submitted",
                    CommissionFee = request.Amount * 0.015m, // Mock commission logic
                    Message = "Bank Guarantee application submitted successfully."
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Database Error", Details = ex.Message });
            }
        }

        [HttpPost("claim")]
        public ActionResult<BGResponseDto> LodgeClaim([FromBody] BGClaimRequestDto request)
        {
            var response = new BGResponseDto
            {
                BGReferenceNumber = request.BGReferenceNumber,
                Status = "Claim RECEIVED",
                CommissionFee = 0,
                Message = $"Claim for {request.ClaimAmount} lodged against {request.BGReferenceNumber}."
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAllBGs()
        {
            try
            {
                var bgs = await _bgRepository.GetAllBGs();
                return Ok(bgs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching BGs", Details = ex.Message });
            }
        }
    }
}
