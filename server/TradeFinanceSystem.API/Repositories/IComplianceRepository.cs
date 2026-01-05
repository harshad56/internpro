using System.Threading.Tasks;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface IComplianceRepository
    {
        Task<int> LogComplianceCheck(string transactionType, string referenceId, decimal score, string status);
    }
}
