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
                    await client.ConnectAsync(smtpServer, port, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(username, password);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"SMTP Error: {ex.Message}");
                    throw new Exception($"Failed to send email: {ex.Message}");
                }
            }
        }
    }
}
