namespace TradeFinanceSystem.API.DTOs
{
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class VerifyOtpDto
    {
        public string Username { get; set; }
        public string Otp { get; set; }
    }

    public class LoginResponseDto
    {
        public string Token { get; set; }
        public object User { get; set; }
    }
}
