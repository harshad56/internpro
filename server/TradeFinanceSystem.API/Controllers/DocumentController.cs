using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Repositories;
using System.IO;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly IWebHostEnvironment _environment;

        public DocumentController(IDocumentRepository documentRepository, IWebHostEnvironment environment)
        {
            _documentRepository = documentRepository;
            _environment = environment;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadDocument([FromForm] DocumentUploadDto upload)
        {
            if (upload.File == null || upload.File.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                // Ensure correct uploads folder exists
                string uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + upload.File.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.File.CopyToAsync(fileStream);
                }

                var docId = await _documentRepository.SaveDocumentMetadata(
                    upload.ReferenceNumber,
                    upload.DocumentType,
                    uniqueFileName, // Saving unique name for retrieval
                    filePath,
                    upload.UploadedBy
                );

                return Ok(new { Message = "File uploaded successfully", DocumentID = docId, FileName = uniqueFileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error", Details = ex.Message });
            }
        }

        [HttpGet("list/{referenceNumber}")]
        public async Task<ActionResult<IEnumerable<DocumentResponseDto>>> GetDocuments(string referenceNumber)
        {
            var docs = await _documentRepository.GetDocumentsByReference(referenceNumber);
            return Ok(docs);
        }
    }
}
