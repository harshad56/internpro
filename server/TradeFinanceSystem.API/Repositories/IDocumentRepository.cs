using System.Threading.Tasks;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface IDocumentRepository
    {
        Task<int> SaveDocumentMetadata(string referenceNumber, string documentType, string fileName, string filePath, string uploadedBy);
        Task<IEnumerable<DocumentResponseDto>> GetDocumentsByReference(string referenceNumber);
    }
}
