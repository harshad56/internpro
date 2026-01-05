using System;
using System.Collections.Generic;

namespace TradeFinanceSystem.API.DTOs
{
    // Compliance DTOs
    public class AMLScreeningRequestDto
    {
        public string EntityName { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ReferenceId { get; set; } = string.Empty;
    }

    public class AMLScreeningResponseDto
    {
        public bool IsMatchFound { get; set; }
        public decimal RiskScore { get; set; }
        public List<string> MatchedSanctionsLists { get; set; } = new List<string>();
        public string OverallStatus { get; set; } = string.Empty; // CLEARED, REVIEW_REQUIRED, BLOCKED
    }

    // Trade Loan DTOs
    public class LeanApplicationDto
    {
        public string LoanType { get; set; } = string.Empty; // Packing, PostShipment
        public string LinkedReferenceNumber { get; set; } = string.Empty; // Associated LC/Export Contract
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public int TenorDays { get; set; }
        public string Purpose { get; set; } = string.Empty;
    }

    public class LoanResponseDto
    {
        public string LoanReferenceNumber { get; set; } = string.Empty;
        public decimal InterestRate { get; set; }
        public decimal EstimatedInterestAmount { get; set; }
        public decimal TotalRepaymentAmount { get; set; }
        public DateTime DueDate { get; set; }
    }
}
