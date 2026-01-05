using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Repositories;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplianceController : ControllerBase
    {
        private readonly IComplianceRepository _complianceRepository;

        public ComplianceController(IComplianceRepository complianceRepository)
        {
            _complianceRepository = complianceRepository;
        }

        [HttpPost("screen-aml")]
        public async Task<ActionResult<AMLScreeningResponseDto>> ScreenEntity([FromBody] AMLScreeningRequestDto request)
        {
            // Mock Sanctions Logic
            bool isHighRiskCountry = request.Country.Equals("Iran", StringComparison.OrdinalIgnoreCase) || 
                                     request.Country.Equals("North Korea", StringComparison.OrdinalIgnoreCase);

            var riskScore = isHighRiskCountry ? 95.0m : 5.0m;
            var status = isHighRiskCountry ? "BLOCKED" : "CLEARED";

            // Log to Database for Audit
            await _complianceRepository.LogComplianceCheck("Generic Screening", request.ReferenceId, riskScore, status);

            var response = new AMLScreeningResponseDto
            {
                IsMatchFound = isHighRiskCountry,
                RiskScore = riskScore,
                MatchedSanctionsLists = isHighRiskCountry ? new List<string> { "OFAC", "UN Sanctions" } : new List<string>(),
                OverallStatus = status
            };

            return Ok(response);
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly ITradeLoanRepository _loanRepository;

        public LoanController(ITradeLoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        [HttpPost("apply")]
        public async Task<ActionResult<LoanResponseDto>> ApplyForLoan([FromBody] LeanApplicationDto request)
        {
            try
            {
                var loanNumber = await _loanRepository.ApplyForLoan(request);

                var response = new LoanResponseDto
                {
                    LoanReferenceNumber = loanNumber,
                    InterestRate = 5.5m, // Mock Rate
                    EstimatedInterestAmount = (request.Amount * 0.055m * request.TenorDays) / 360,
                    TotalRepaymentAmount = request.Amount + ((request.Amount * 0.055m * request.TenorDays) / 360),
                    DueDate = DateTime.Now.AddDays(request.TenorDays)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Database Error", Details = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAllLoans()
        {
            try
            {
                var loans = await _loanRepository.GetAllLoans();
                return Ok(loans);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching Loans", Details = ex.Message });
            }
        }
    }
}
