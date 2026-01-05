using Dapper;
using Microsoft.Data.SqlClient;
using System.IO;

namespace TradeFinanceSystem.API.Data
{
    public class DbInitializer
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public DbInitializer(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        public void Initialize()
        {
            try
            {
                // 1. Ensure Database Exists
                EnsureDatabaseExists();

                // 2. Run Schema Scripts
                // Check if Users table exists. If not, run schema.
                if (!IsTableExists("Users"))
                {
                    RunSqlScript("../../database/01_Schema_Create.sql");
                }

                // 3. Run Seed Data
                // Only run seed if table is empty to avoid duplicates on restart
                if (IsTableEmpty("Users"))
                {
                    RunSqlScript("../../database/02_Seed_Data.sql");
                }

                // 4. Ensure Documents Table Exists
                if (!IsTableExists("TradeDocuments"))
                {
                     RunSqlScript("../../database/03_Documents_Table.sql");
                }

                // 5. Populate more mock transactions for dashboard if data missing
                // LCs
                if (GetTableRowCount("LC_Master") < 2)
                {
                    RunSqlScript("../../database/04_Seed_Transactions.sql");
                }
                
                // BGs (Separate check to ensure they get populated even if LCs exist)
                if (GetTableRowCount("BG_Master") == 0)
                {
                     RunSqlScript("../../database/05_Seed_BGs.sql");
                }

                // 6. Audit Logs
                if (!IsTableExists("AuditLogs"))
                {
                    RunSqlScript("../../database/06_AuditLog_Table.sql");
                }

                // 7. Collections Table
                if (!IsTableExists("Collections"))
                {
                    RunSqlScript("../../database/07_Collections_Table.sql");
                }

                // 8. Auth/OTP Migration
                EnsureOtpColumns();

                // 9. Ensure specific user exists for testing
                RunSqlScript("../../database/08_Ensure_User.sql");
                
                // 10. Update Currency to INR
                RunSqlScript("../../database/09_Update_Currency_INR.sql");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DB Initialization Error: {ex.Message}");
                // Log or handle accordingly
            }
        }

        private void EnsureDatabaseExists()
        {
            var builder = new SqlConnectionStringBuilder(_connectionString);
            var databaseName = builder.InitialCatalog;
            builder.InitialCatalog = "master"; // Connect to master to create DB

            using (var connection = new SqlConnection(builder.ConnectionString))
            {
                var query = $"IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '{databaseName}') CREATE DATABASE [{databaseName}]";
                connection.Execute(query);
            }
        }

        private void RunSqlScript(string relativePath)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), relativePath);
            if (!File.Exists(path))
            {
                Console.WriteLine($"SQL File not found: {path}");
                return;
            }

            var script = File.ReadAllText(path);
            
            // Split script by GO command (simple split, might be fragile for complex scripts but fine here)
            // Or just execute the whole thing if it doesn't contain GO. Dapper can often handle batches.
            // But T-SQL usually requires GO for batch separation. 
            // Our scripts don't use GO, they are just CREATE TABLE statements. Dapper can execute them if valid.
            // Let's execute.
            
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Execute(script);
            }
        }

        private bool IsTableEmpty(string tableName)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                try 
                {
                    var count = connection.ExecuteScalar<int>($"SELECT COUNT(*) FROM {tableName}");
                    return count == 0;
                }
                catch
                {
                    // Table probably doesn't exist yet if schema failed
                    return true;
                }
            }
        }

        private bool IsTableExists(string tableName)
        {
             using (var connection = new SqlConnection(_connectionString))
            {
                var query = $"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = @TableName";
                var count = connection.ExecuteScalar<int>(query, new { TableName = tableName });
                return count > 0;
            }
        }
        private int GetTableRowCount(string tableName)
        {
             using (var connection = new SqlConnection(_connectionString))
            {
                try 
                {
                    return connection.ExecuteScalar<int>($"SELECT COUNT(*) FROM {tableName}");
                }
                catch
                {
                    return 0;
                }
            }
        }
        private void EnsureOtpColumns()
        {
             using (var connection = new SqlConnection(_connectionString))
            {
                var checkQuery = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'OtpCode'";
                var exists = connection.ExecuteScalar<int>(checkQuery);
                if (exists == 0)
                {
                    connection.Execute("ALTER TABLE Users ADD OtpCode NVARCHAR(10) NULL, OtpExpiry DATETIME NULL;");
                }
            }
        }
    }
}
