using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Repositories;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LCController : ControllerBase
    {
        private readonly ILCRepository _lcRepository;

        public LCController(ILCRepository lcRepository)
        {
            _lcRepository = lcRepository;
        }

        [HttpPost("create")]
        public async Task<ActionResult<LCResponseDto>> CreateLC([FromBody] LCCreateRequestDto request)
        {
            try
            {
                var lcNumber = await _lcRepository.CreateLC(request);
                
                var response = new LCResponseDto
                {
                    LCReferenceNumber = lcNumber,
                    Status = "Submitted",
                    ChargesAmount = request.Amount * 0.005m + 50, // Mock charges logic preserved
                    CreatedDate = DateTime.Now
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Database Error", Details = ex.Message });
            }
        }

        [HttpPost("amend")]
        public ActionResult<LCResponseDto> AmendLC([FromBody] LCAmendmentRequestDto request)
        {
            // TODO: Validate LC exists and process amendment
            var response = new LCResponseDto
            {
                LCReferenceNumber = request.LCReferenceNumber,
                Status = "Amendment Submitted",
                ChargesAmount = 100, // Fixed amendment fee
                CreatedDate = DateTime.Now
            };

            return Ok(response);
        }

        [HttpGet("validate-docs/{lcReference}")]
        public ActionResult ValidateDocuments(string lcReference)
        {
            // Mock checking logic
            return Ok(new { Message = $"Documents for {lcReference} initiated for checking." });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAllLCs()
        {
            try
            {
                var lcs = await _lcRepository.GetAllLCs();
                return Ok(lcs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching LCs", Details = ex.Message });
            }
        }
    }
}
