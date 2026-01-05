using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using TradeFinanceSystem.API.Data;
using Dapper;
using System.Threading.Tasks;

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly DapperContext _context;

        public CustomerController(DapperContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                var query = "SELECT CustomerID as Id, CIF_ID as CIF, CustomerName as Name, Country, RiskRating as Risk, SanctionStatus, Email FROM Customers";
                
                using (var connection = _context.CreateConnection())
                {
                    var customers = await connection.QueryAsync(query);
                    return Ok(customers);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching customers: {ex.Message}");
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerDto request)
        {
            try
            {
                var query = @"
                    INSERT INTO Customers (CIF_ID, CustomerName, Country, RiskRating, SanctionStatus, Email)
                    VALUES (@CIF, @Name, @Country, @Risk, 'Clean', @Email);
                ";
                
                // Generate CIF
                request.CIF = $"CIF{new Random().Next(10000, 99999)}";

                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(query, request);
                    return Ok(new { Message = "Customer Created Successfully", CIF = request.CIF });
                }
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"Error creating customer: {ex.Message}");
                 Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                 return StatusCode(500, new { Message = "Error creating customer", Details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerDto request)
        {
            try
            {
                var query = @"
                    UPDATE Customers 
                    SET CustomerName = @Name, 
                        Country = @Country, 
                        RiskRating = @Risk, 
                        SanctionStatus = @SanctionStatus,
                        Email = @Email
                    WHERE CustomerID = @Id";

                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.ExecuteAsync(query, new { 
                        Id = id, 
                        request.Name, 
                        request.Country, 
                        request.Risk, 
                        request.SanctionStatus,
                        request.Email
                    });
                    
                    if (result == 0) return NotFound(new { Message = "Customer not found" });
                    
                    return Ok(new { Message = "Customer Updated Successfully" });
                }
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"Error updating customer: {ex.Message}");
                 return StatusCode(500, new { Message = "Error updating customer", Details = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.ExecuteAsync("DELETE FROM Customers WHERE CustomerID = @Id", new { Id = id });
                    
                    if (result == 0) return NotFound(new { Message = "Customer not found" });
                    
                    return Ok(new { Message = "Customer Deleted Successfully" });
                }
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"Error deleting customer: {ex.Message}");
                 // Check for foreign key constraint errors
                 if (ex.Message.Contains("REFERENCE"))
                     return BadRequest(new { Message = "Cannot delete customer because they have active transactions (LC/BG/Loans)." });
                     
                 return StatusCode(500, new { Message = "Error deleting customer", Details = ex.Message });
            }
        }


    }

    public class CustomerDto
    {
        public string? CIF { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Risk { get; set; }
        public string? Email { get; set; }
    }

    public class UpdateCustomerDto
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string Risk { get; set; }
        public string SanctionStatus { get; set; }
        public string? Email { get; set; }
    }
}
