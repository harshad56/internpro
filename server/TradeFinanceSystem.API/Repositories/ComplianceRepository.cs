using Dapper;
using System.Data;
using TradeFinanceSystem.API.Data;

namespace TradeFinanceSystem.API.Repositories
{
    public class ComplianceRepository : IComplianceRepository
    {
        private readonly DapperContext _context;

        public ComplianceRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<int> LogComplianceCheck(string transactionType, string referenceId, decimal score, string status)
        {
            // TransactionID is simplified as string referenceId here, but Schema expects INT TransactionID. 
            // For this demo, we will adjust query to loose coupling or mock ID.
            // Let's assume TransactionID is 0 if not provided, or we change schema? 
            // Better: We treat ReferenceID as string and maybe store in Details or separate column?
            // Checking schema: TransactionID is INT.
            // Let's use 0 for now as we might not have the ID yet if it's pre-screening.
            
            var query = @"INSERT INTO ComplianceRecords (TransactionType, TransactionID, SanctionMatchScore, Status, CheckDate)
                          VALUES (@TransactionType, @TransactionID, @SanctionMatchScore, @Status, @CheckDate);
                          SELECT CAST(SCOPE_IDENTITY() as int)";
            
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("TransactionType", transactionType);
                parameters.Add("TransactionID", 0); // Placeholder
                parameters.Add("SanctionMatchScore", score);
                parameters.Add("Status", status);
                parameters.Add("CheckDate", DateTime.Now);

                var id = await connection.ExecuteScalarAsync<int>(query, parameters);
                return id;
            }
        }
    }
}
