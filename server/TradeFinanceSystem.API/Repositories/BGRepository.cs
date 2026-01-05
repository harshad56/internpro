using Dapper;
using System.Data;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public class BGRepository : IBGRepository
    {
        private readonly DapperContext _context;

        public BGRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<string> CreateBG(BGIssueRequestDto bgRequest)
        {
            var bgNumber = "BG" + DateTime.Now.ToString("yyyyMMddHHmmss");
            
            // Calculate Claim Period in Days (Difference between Claim Expiry and Expiry)
            var claimPeriodDays = (bgRequest.ClaimExpiryDate - bgRequest.ExpiryDate).Days;
            if (claimPeriodDays < 0) claimPeriodDays = 0;

            var query = @"INSERT INTO BG_Master (BGNumber, CustomerID, BeneficiaryName, BGType, Amount, Currency, IssueDate, ExpiryDate, ClaimPeriod, Status)
                          VALUES (@BGNumber, @CustomerID, @BeneficiaryName, @BGType, @Amount, @Currency, @IssueDate, @ExpiryDate, @ClaimPeriod, @Status)";
            
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("BGNumber", bgNumber);
                // Randomize Customer for Demo (1 to 3)
                int randomCustomerId = new Random().Next(1, 4);
                parameters.Add("CustomerID", randomCustomerId);
                parameters.Add("BeneficiaryName", bgRequest.BeneficiaryName);
                parameters.Add("BGType", bgRequest.BGType);
                parameters.Add("Amount", bgRequest.Amount);
                parameters.Add("Currency", bgRequest.Currency);
                parameters.Add("IssueDate", bgRequest.EffectiveDate);
                parameters.Add("ExpiryDate", bgRequest.ExpiryDate);
                parameters.Add("ClaimPeriod", claimPeriodDays);
                parameters.Add("Status", "Submitted");

                await connection.ExecuteAsync(query, parameters);
                return bgNumber;
            }
        }


        public async Task<IEnumerable<dynamic>> GetAllBGs()
        {
            var query = @"
                SELECT B.*, C.CustomerName as ApplicantName 
                FROM BG_Master B 
                LEFT JOIN Customers C ON B.CustomerID = C.CustomerID 
                ORDER BY B.IssueDate DESC";
            using (var connection = _context.CreateConnection())
            {
                var bgs = await connection.QueryAsync(query);
                return bgs;
            }
        }
    }
}
