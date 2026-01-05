using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using Dapper;
using TradeFinanceSystem.API.Data;
using System.Threading.Tasks;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollectionController : ControllerBase
    {
        private readonly DapperContext _context;

        public CollectionController(DapperContext context)
        {
            _context = context;
        }

        [HttpPost("lodge")]
        public async Task<IActionResult> LodgeCollection([FromBody] CollectionDto request)
        {
            try
            {
                var sql = @"
                    INSERT INTO Collections (ReferenceNumber, Type, TenorType, Amount, Currency, DrawerName, DraweeName,  BankRef, Status, SubmissionDate)
                    VALUES (@ReferenceNumber, @Type, @TenorType, @Amount, @Currency, @DrawerName, @DraweeName, @BankRef, 'Submitted', GETDATE());
                ";

                // Generate Reference Number
                request.ReferenceNumber = $"COLL-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";

                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(sql, request);
                    return Ok(new { ReferenceNumber = request.ReferenceNumber });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error lodging collection: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class CollectionDto
    {
        public string? ReferenceNumber { get; set; }
        public string Type { get; set; } // Import Collection / Export Collection
        public string TenorType { get; set; } // Sight / Usance
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string DrawerName { get; set; }
        public string DraweeName { get; set; }
        public string BankRef { get; set; }
    }
}
