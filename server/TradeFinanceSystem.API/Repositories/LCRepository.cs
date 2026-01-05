using Dapper;
using System.Data;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public class LCRepository : ILCRepository
    {
        private readonly DapperContext _context;

        public LCRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<string> CreateLC(LCCreateRequestDto lcRequest)
        {
            // Generate a simple unique LC Number
            var lcNumber = "LC" + DateTime.Now.ToString("yyyyMMddHHmmss"); 

            var query = @"INSERT INTO LC_Master (LCNumber, CustomerID, BeneficiaryName, LCType, PaymentTerms, Amount, Currency, IssueDate, ExpiryDate, Status, Tenor)
                          VALUES (@LCNumber, @CustomerID, @BeneficiaryName, @LCType, @PaymentTerms, @Amount, @Currency, @IssueDate, @ExpiryDate, @Status, @Tenor)";
            
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("LCNumber", lcNumber);
                // Randomize Customer for Demo (1 to 3)
                int randomCustomerId = new Random().Next(1, 4);
                parameters.Add("CustomerID", randomCustomerId);
                parameters.Add("BeneficiaryName", lcRequest.BeneficiaryName);
                parameters.Add("LCType", lcRequest.LCType);
                parameters.Add("PaymentTerms", lcRequest.PaymentTerms);
                parameters.Add("Amount", lcRequest.Amount);
                parameters.Add("Currency", lcRequest.Currency);
                parameters.Add("IssueDate", DateTime.Now);
                parameters.Add("ExpiryDate", lcRequest.ExpiryDate);
                parameters.Add("Status", "Submitted");
                parameters.Add("Tenor", 90); // Default tenor

                await connection.ExecuteAsync(query, parameters);
                return lcNumber;
            }
        }


        public async Task<IEnumerable<dynamic>> GetAllLCs()
        {
            var query = @"
                SELECT L.*, C.CustomerName as ApplicantName 
                FROM LC_Master L 
                LEFT JOIN Customers C ON L.CustomerID = C.CustomerID 
                ORDER BY L.IssueDate DESC";
            using (var connection = _context.CreateConnection())
            {
                var lcs = await connection.QueryAsync(query);
                return lcs;
            }
        }
    }
}
