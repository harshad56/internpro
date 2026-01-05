using Dapper;
using System.Data;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.DTOs;

namespace TradeFinanceSystem.API.Repositories
{
    public class ApprovalRepository : IApprovalRepository
    {
        private readonly DapperContext _context;

        public ApprovalRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PendingApprovalDto>> GetPendingApprovals()
        {
            var query = @"
                SELECT LCNumber as ReferenceNumber, 'LC' as TransactionType, LCType as SubType, c.CustomerName, Amount, Currency, Status, IssueDate as SubmittedDate
                FROM LC_Master l
                JOIN Customers c ON l.CustomerID = c.CustomerID
                WHERE Status = 'Submitted'
                
                UNION ALL
                
                SELECT BGNumber as ReferenceNumber, 'BG' as TransactionType, BGType as SubType, c.CustomerName, Amount, Currency, Status, IssueDate as SubmittedDate
                FROM BG_Master b
                JOIN Customers c ON b.CustomerID = c.CustomerID
                WHERE Status = 'Submitted'

                UNION ALL

                SELECT 'TL' + RIGHT('000000' + CAST(LoanID AS VARCHAR), 6) as ReferenceNumber, 'Loan' as TransactionType, LoanType as SubType, c.CustomerName, Amount, Currency, Status, StartDate as SubmittedDate
                FROM TradeLoans t
                JOIN Customers c ON t.CustomerID = c.CustomerID
                WHERE Status = 'Submitted'

                UNION ALL

                SELECT ReferenceNumber, 'Collection' as TransactionType, Type as SubType, DrawerName as CustomerName, Amount, Currency, Status, SubmissionDate as SubmittedDate
                FROM Collections
                WHERE Status = 'Submitted'";

            using (var connection = _context.CreateConnection())
            {
                var result = await connection.QueryAsync<PendingApprovalDto>(query);
                return result;
            }
        }

        public async Task<bool> ProcessApproval(ApprovalActionDto action)
        {
            string tableName = "";
            string keyColumn = "";
            string status = action.Action == "Approve" ? "Approved" : "Rejected";

            switch (action.TransactionType)
            {
                case "LC":
                    tableName = "LC_Master";
                    keyColumn = "LCNumber";
                    break;
                case "BG":
                    tableName = "BG_Master";
                    keyColumn = "BGNumber";
                    break;
                case "Loan":
                    tableName = "TradeLoans";
                    keyColumn = "LoanID";
                    break;
                case "Collection":
                     tableName = "Collections";
                     keyColumn = "ReferenceNumber";
                     break;
            }

            if (string.IsNullOrEmpty(tableName)) return false;

            string query = "";
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("Status", status);
            parameters.Add("ReferenceNumber", action.ReferenceNumber);

            if (action.TransactionType == "Loan")
            {
                 // Extract ID from TL00000X
                 if(action.ReferenceNumber.StartsWith("TL") && int.TryParse(action.ReferenceNumber.Substring(2), out int loanId))
                 {
                     query = $"UPDATE TradeLoans SET Status = @Status WHERE LoanID = @LoanID";
                     parameters.Add("LoanID", loanId);
                 }
                 else return false;
            }
            else
            {
                query = $"UPDATE {tableName} SET Status = @Status WHERE {keyColumn} = @ReferenceNumber";
            }

            using (var connection = _context.CreateConnection())
            {
                var rows = await connection.ExecuteAsync(query, parameters);
                return rows > 0;
            }
        }
    }
}
