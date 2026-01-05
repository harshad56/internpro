using System;

namespace TradeFinanceSystem.API.DTOs
{
    public class DocumentUploadDto
    {
        public string ReferenceNumber { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public IFormFile File { get; set; } // For file upload binding
        public string UploadedBy { get; set; } = "John Doe"; // Mock user
    }

    public class DocumentResponseDto
    {
        public int DocumentID { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string UploadedBy { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
    }
}
