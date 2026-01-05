using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.Models;

namespace TradeFinanceSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DapperContext _context;

        public AdminController(DapperContext context)
        {
            _context = context;
        }

        [HttpGet("charges")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetCharges()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var charges = await connection.QueryAsync("SELECT * FROM ChargesConfig");
                    return Ok(charges);
                }
            }
            catch (Exception ex)
            {
                 // Temporary fallback to mock if table doesn't exist
                 return Ok(new List<dynamic>());
            }
        }

        [HttpPost("charges")]
        public async Task<ActionResult> AddCharge([FromBody] ChargeDto charge)
        {
            try
            {
                var query = "INSERT INTO ChargesConfig (Product, ChargeType, Rate, Basis, Currency) VALUES (@Product, @ChargeType, @Rate, @Basis, @Currency)";
                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(query, charge);
                    return Ok(new { message = "Charge added successfully" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("charges/{id}")]
        public async Task<ActionResult> UpdateCharge(int id, [FromBody] ChargeDto charge)
        {
            try
            {
                var query = @"UPDATE ChargesConfig 
                              SET Product = @Product, 
                                  ChargeType = @ChargeType, 
                                  Rate = @Rate, 
                                  Basis = @Basis, 
                                  Currency = @Currency 
                              WHERE ChargeID = @Id";
                
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.ExecuteAsync(query, new { Id = id, charge.Product, charge.ChargeType, charge.Rate, charge.Basis, charge.Currency });
                    if (result == 0) return NotFound(new { message = "Charge not found" });
                    return Ok(new { message = "Charge updated successfully" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("charges/{id}")]
        public async Task<ActionResult> DeleteCharge(int id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.ExecuteAsync("DELETE FROM ChargesConfig WHERE ChargeID = @Id", new { Id = id });
                    if (result == 0) return NotFound(new { message = "Charge not found" });
                    return Ok(new { message = "Charge deleted successfully" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var users = await connection.QueryAsync<User>("SELECT * FROM Users");
                    return Ok(users);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("users")]
        public async Task<ActionResult> AddUser([FromBody] CreateUserDto userDto)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var sql = "INSERT INTO Users (Username, Email, Role, PasswordHash, CreatedAt) VALUES (@Username, @Email, @Role, @PasswordHash, GETDATE())";
                    
                    var user = new User
                    {
                        Username = userDto.Username,
                        Email = userDto.Email,
                        Role = userDto.Role,
                        PasswordHash = string.IsNullOrEmpty(userDto.PasswordHash) ? "hashed_password_123" : userDto.PasswordHash
                    };
                    
                    await connection.ExecuteAsync(sql, user);
                    return Ok(new { message = "User added successfully" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpPut("users/{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserDto userDto)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var sql = "UPDATE Users SET Email = @Email, Role = @Role WHERE UserID = @UserID";
                    var parameters = new { Email = userDto.Email, Role = userDto.Role, UserID = id };
                    
                    var affected = await connection.ExecuteAsync(sql, parameters);
                    if (affected > 0)
                        return Ok(new { message = "User updated successfully" });
                    else
                        return NotFound(new { message = "User not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var sql = "DELETE FROM Users WHERE UserID = @UserID";
                    var affected = await connection.ExecuteAsync(sql, new { UserID = id });
                    
                    if (affected > 0)
                        return Ok(new { message = "User deleted successfully" });
                    else
                        return NotFound(new { message = "User not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class UpdateUserDto
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }

    public class CreateUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string PasswordHash { get; set; }
    }
    public class ChargeDto
    {
        public string Product { get; set; }
        public string ChargeType { get; set; }
        public string Rate { get; set; }
        public string Basis { get; set; }
        public string Currency { get; set; }
    }
}
