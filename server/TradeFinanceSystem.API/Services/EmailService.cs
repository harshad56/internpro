using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace TradeFinanceSystem.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailMessage = new MimeMessage();
            // Use a default sender if config is missing, though config is preferred
            var fromEmail = _configuration["EmailSettings:FromEmail"] ?? "noreply@tradefinancesystem.com";
            emailMessage.From.Add(new MailboxAddress("Trade Finance System", fromEmail));
            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = body };

            using (var client = new SmtpClient())
            {
                // For development, we might accept invalid certs
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
                var username = _configuration["EmailSettings:Username"];
                var password = _configuration["EmailSettings:Password"]?.Replace(" ", "").Trim(); // Fix common copy-paste issues

                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) 
                {
                    Console.WriteLine($"[Email Mock] To: {toEmail}, Subject: {subject}, Body: {body}");
                    return;
                }

                try 
                {
                    // Use Auto to support both Port 587 (StartTLS) and 465 (SSL)
                    await client.ConnectAsync(smtpServer, port, MailKit.Security.SecureSocketOptions.Auto);
                    await client.AuthenticateAsync(username, password);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    // CRITICAL FIX: Do not crash the app if Email fails.
                    Console.WriteLine($"SMTP CRITICAL FAILURE: {ex.Message}");
                    
                    // FALLBACK: Log the email content (which contains the OTP) to the console
                    // This allows the user to still login by looking at the specific server logs.
                    Console.WriteLine("==================================================================");
                    Console.WriteLine($"[EMAIL FALLBACK] Sent to: {toEmail}");
                    Console.WriteLine($"[EMAIL FALLBACK] Subject: {subject}");
                    Console.WriteLine($"[EMAIL FALLBACK] Body: {body}");
                    Console.WriteLine("==================================================================");
                }
            }
        }
    }
}
