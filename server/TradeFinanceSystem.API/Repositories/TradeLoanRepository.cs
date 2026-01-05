using Dapper;
using System.Data;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public class TradeLoanRepository : ITradeLoanRepository
    {
        private readonly DapperContext _context;

        public TradeLoanRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<string> ApplyForLoan(LeanApplicationDto loanRequest)
        {
            // Generate Loan Reference logic could be enhanced, simple for now
            var startDate = DateTime.Now;
            var maturityDate = startDate.AddDays(loanRequest.TenorDays);
            var interestRate = 5.5m; // Mock fixed rate for demo

            var query = @"INSERT INTO TradeLoans (CustomerID, LoanType, Amount, Currency, InterestRate, StartDate, MaturityDate, Status)
                          OUTPUT INSERTED.LoanID
                          VALUES (@CustomerID, @LoanType, @Amount, @Currency, @InterestRate, @StartDate, @MaturityDate, @Status)";
            
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                // Randomize Customer for Demo (1 to 3)
                int randomCustomerId = new Random().Next(1, 4);
                parameters.Add("CustomerID", randomCustomerId);
                parameters.Add("LoanType", loanRequest.LoanType);
                parameters.Add("Amount", loanRequest.Amount);
                parameters.Add("Currency", loanRequest.Currency);
                parameters.Add("InterestRate", interestRate);
                parameters.Add("StartDate", startDate);
                parameters.Add("MaturityDate", maturityDate);
                parameters.Add("Status", "Active");

                var loanId = await connection.ExecuteScalarAsync<int>(query, parameters);
                return "TL" + loanId.ToString("D6"); // e.g. TL000001
            }
        }


        public async Task<IEnumerable<dynamic>> GetAllLoans()
        {
            var query = @"
                SELECT T.*, C.CustomerName as ApplicantName 
                FROM TradeLoans T 
                LEFT JOIN Customers C ON T.CustomerID = C.CustomerID 
                ORDER BY T.StartDate DESC";
            using (var connection = _context.CreateConnection())
            {
                var loans = await connection.QueryAsync(query);
                return loans;
            }
        }
    }
}
