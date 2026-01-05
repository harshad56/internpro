using System;

namespace TradeFinanceSystem.API.DTOs
{
    public class BGIssueRequestDto
    {
        public string BGType { get; set; } = string.Empty; // Performance, Bid Bond
        public string BeneficiaryName { get; set; } = string.Empty;
        public string Currency { get; set; } = "USD";
        public decimal Amount { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime ClaimExpiryDate { get; set; }
        public string GuaranteeText { get; set; } = string.Empty;
    }

    public class BGClaimRequestDto
    {
        public string BGReferenceNumber { get; set; } = string.Empty;
        public decimal ClaimAmount { get; set; }
        public DateTime ClaimDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class BGResponseDto
    {
        public string BGReferenceNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal CommissionFee { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
