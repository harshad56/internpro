using System;
using System.Collections.Generic;

namespace TradeFinanceSystem.API.DTOs
{
    public class LCCreateRequestDto
    {
        public string LCType { get; set; } = string.Empty; // Irrevocable, Revocable
        public string PaymentTerms { get; set; } = string.Empty; // Sight, Usance
        public string BeneficiaryName { get; set; } = string.Empty;
        public string Currency { get; set; } = "USD";
        public decimal Amount { get; set; }
        public decimal TolerancePercentage { get; set; }
        public DateTime LatestShipmentDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string PortOfLoading { get; set; } = string.Empty;
        public string PortOfDischarge { get; set; } = string.Empty;
        public List<string> RequiredDocuments { get; set; } = new List<string>();
    }

    public class LCAmendmentRequestDto
    {
        public string LCReferenceNumber { get; set; } = string.Empty;
        public decimal? NewAmount { get; set; }
        public DateTime? NewExpiryDate { get; set; }
        public string Narrative { get; set; } = string.Empty;
    }

    public class LCResponseDto
    {
        public string LCReferenceNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // Draft, Submitted, Approved
        public decimal ChargesAmount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
