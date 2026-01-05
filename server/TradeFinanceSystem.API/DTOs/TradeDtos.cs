using System;

namespace TradeFinanceSystem.API.DTOs
{
    public class TradeApplicationDto
    {
        public string ProductType { get; set; } // LC, BG, Collection
        public string Direction { get; set; } // Import, Export
        public string ApplicantName { get; set; }
        public string BeneficiaryName { get; set; }
        public string Currency { get; set; }
        public decimal Amount { get; set; }
        public int Tenor { get; set; }
    }

    public class TradeApplicationResponseDto
    {
        public int ApplicationId { get; set; }
        public string ReferenceNumber { get; set; }
        public string Status { get; set; }
        public DateTime SubmissionDate { get; set; }
    }
}
