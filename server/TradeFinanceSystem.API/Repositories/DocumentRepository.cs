using Dapper;
using System.Data;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly DapperContext _context;

        public DocumentRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<int> SaveDocumentMetadata(string referenceNumber, string documentType, string fileName, string filePath, string uploadedBy)
        {
            var query = @"INSERT INTO TradeDocuments (ReferenceNumber, DocumentType, FileName, FilePath, UploadedBy, UploadDate)
                          VALUES (@ReferenceNumber, @DocumentType, @FileName, @FilePath, @UploadedBy, @UploadDate);
                          SELECT CAST(SCOPE_IDENTITY() as int)";

            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("ReferenceNumber", referenceNumber);
                parameters.Add("DocumentType", documentType);
                parameters.Add("FileName", fileName);
                parameters.Add("FilePath", filePath);
                parameters.Add("UploadedBy", uploadedBy);
                parameters.Add("UploadDate", DateTime.Now);

                var id = await connection.ExecuteScalarAsync<int>(query, parameters);
                return id;
            }
        }

        public async Task<IEnumerable<DocumentResponseDto>> GetDocumentsByReference(string referenceNumber)
        {
             var query = @"SELECT DocumentID, FileName, UploadedBy, UploadDate 
                           FROM TradeDocuments 
                           WHERE ReferenceNumber = @ReferenceNumber";

            using (var connection = _context.CreateConnection())
            {
                var result = await connection.QueryAsync<DocumentResponseDto>(query, new { ReferenceNumber = referenceNumber });
                return result;
            }
        }
    }
}
