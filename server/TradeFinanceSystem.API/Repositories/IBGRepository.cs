using System.Threading.Tasks;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface IBGRepository
    {
        Task<string> CreateBG(BGIssueRequestDto bgRequest);
        Task<IEnumerable<dynamic>> GetAllBGs();
    }
}
