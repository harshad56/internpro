using System.Threading.Tasks;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface ILCRepository
    {
        Task<string> CreateLC(LCCreateRequestDto lcRequest);
        Task<IEnumerable<dynamic>> GetAllLCs();
    }
}
