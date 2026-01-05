using System.Threading.Tasks;

namespace TradeFinanceSystem.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
