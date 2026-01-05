using System;

namespace TradeFinanceSystem.API.DTOs
{
    public class PendingApprovalDto
    {
        public string ReferenceNumber { get; set; } = string.Empty;
        public string TransactionType { get; set; } = string.Empty; // LC, BG, Loan
        public string SubType { get; set; } = string.Empty; // Import, Performance, Packing Credit
        public string CustomerName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedDate { get; set; }
    }

    public class ApprovalActionDto
    {
        public string ReferenceNumber { get; set; } = string.Empty;
        public string TransactionType { get; set; } = string.Empty; // LC, BG, Loan
        public string Action { get; set; } = string.Empty; // Approve, Reject
        public string Remarks { get; set; } = string.Empty;
    }
}
