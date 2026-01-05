namespace TradeFinanceSystem.API.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public string OtpCode { get; set; }
        public DateTime? OtpExpiry { get; set; }
    }
}
