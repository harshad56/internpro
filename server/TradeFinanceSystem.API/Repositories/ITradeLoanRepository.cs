using System.Threading.Tasks;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface ITradeLoanRepository
    {
        Task<string> ApplyForLoan(LeanApplicationDto loanRequest);
        Task<IEnumerable<dynamic>> GetAllLoans();
    }
}
