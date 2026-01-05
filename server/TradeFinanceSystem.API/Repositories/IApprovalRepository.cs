using System.Collections.Generic;
using System.Threading.Tasks;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public interface IApprovalRepository
    {
        Task<IEnumerable<PendingApprovalDto>> GetPendingApprovals();
        Task<bool> ProcessApproval(ApprovalActionDto action);
    }
}
