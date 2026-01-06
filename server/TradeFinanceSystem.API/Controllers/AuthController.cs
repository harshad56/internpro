using Microsoft.AspNetCore.Mvc;
using TradeFinanceSystem.API.DTOs;
using Dapper;
using TradeFinanceSystem.API.Data;
using TradeFinanceSystem.API.Models;
using System.Threading.Tasks;
using System;
using TradeFinanceSystem.API.Repositories; // Assuming IAuditRepository is here

namespace TradeFinanceSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DapperContext _context;
        private readonly IAuditRepository _auditRepository;
        private readonly TradeFinanceSystem.API.Services.IEmailService _emailService;

        public AuthController(DapperContext context, IAuditRepository auditRepository, TradeFinanceSystem.API.Services.IEmailService emailService)
        {
            _context = context;
            _auditRepository = auditRepository;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            try
            {
                // MASTER LOGIN BYPASS (For Testing Only)
                if (login.Username == "harshadbagal77@gmail.com" && login.Password == "1234")
                {
                    // Log Audit for Master Login
                    await _auditRepository.LogAction("Login", "User", "999", "MasterAdmin", "User logged in via MASTER BYPASS");

                    return Ok(new 
                    { 
                        Token = "master_test_token_" + Guid.NewGuid(),
                        User = new { Username = "MasterAdmin", Role = "Admin", Email = "harshadbagal77@gmail.com" },
                        RequiresOtp = false
                    });
                }

                var query = "SELECT * FROM Users WHERE Username = @Username AND PasswordHash = @Password";
                
                using (var connection = _context.CreateConnection())
                {
                    var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { Username = login.Username, Password = login.Password });

                    if (user == null)
                        return Unauthorized(new { Message = "Invalid credentials" });

                    // Generate OTP
                    var otp = new Random().Next(10000, 99999).ToString();
                    
                    // Save to DB
                    var updateQuery = "UPDATE Users SET OtpCode = @Otp, OtpExpiry = @Expiry WHERE UserID = @UserId";
                    await connection.ExecuteAsync(updateQuery, new { Otp = otp, Expiry = DateTime.UtcNow.AddMinutes(5), UserId = user.UserID });

                    // Send Email
                    if (!string.IsNullOrEmpty(user.Email))
                    {
                        await _emailService.SendEmailAsync(user.Email, "Your Login OTP - Trade Finance System", $"<h3>Your OTP is: <b>{otp}</b></h3><p>Valid for 5 minutes.</p>");
                    }
                    else
                    {
                        Console.WriteLine($"[WARNING] User {user.Username} has no email. OTP is {otp}");
                    }

                    // Mask Email
                    string maskedEmail = "registered email";
                    if (!string.IsNullOrEmpty(user.Email))
                    {
                        var parts = user.Email.Split('@');
                        if (parts.Length > 1)
                        {
                            var name = parts[0];
                            var domain = parts[1];
                            var visible = name.Length > 2 ? name.Substring(0, 2) : name.Substring(0, 1);
                            maskedEmail = $"{visible}****@{domain}";
                        }
                    }

                    return Ok(new 
                    { 
                        Message = "OTP sent to registered email", 
                        RequiresOtp = true, 
                        Username = user.Username,
                        MaskedEmail = maskedEmail
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto request)
        {
            using (var connection = _context.CreateConnection())
            {
                var query = "SELECT * FROM Users WHERE Username = @Username";
                var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { Username = request.Username });

                if (user == null) return Unauthorized("User not found");

                if (user.OtpCode == request.Otp && user.OtpExpiry > DateTime.UtcNow)
                {
                    // Clear OTP
                    await connection.ExecuteAsync("UPDATE Users SET OtpCode = NULL, OtpExpiry = NULL WHERE UserID = @Id", new { Id = user.UserID });

                    // Log Audit
                    await _auditRepository.LogAction("Login", "User", user.UserID.ToString(), user.Username, "User logged in successfully via OTP");

                    return Ok(new 
                    { 
                        Token = "mock_jwt_token_" + Guid.NewGuid(),
                        User = new { user.Username, user.Role, user.Email } 
                    });
                }

                return Unauthorized(new { Message = "Invalid or expired OTP" });
            }
        }
    }
}
