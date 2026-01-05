using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace TradeFinanceSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountingController : ControllerBase
    {
        // Mock GL Repository
        private static List<object> _glEntries = new List<object>
        {
            new { 
                EntryID = 1, 
                TransactionDate = DateTime.Now.AddDays(-2), 
                TransactionType = "Loan Disbursement", 
                ReferenceNumber = "LN-2024-001", 
                DebitAccount = "100100 (Cash)", 
                CreditAccount = "200100 (Loan Asset)", 
                Amount = 500000.00, 
                Currency = "USD", 
                Description = "Disbursement for Steel Import", 
                PostedBy = "System" 
            },
            new { 
                EntryID = 2, 
                TransactionDate = DateTime.Now.AddDays(-1), 
                TransactionType = "LC Issuance", 
                ReferenceNumber = "LC-2024-889", 
                DebitAccount = "200200 (Liability)", 
                CreditAccount = "300100 (Fees)", 
                Amount = 250.00, 
                Currency = "USD", 
                Description = "Issuance Commission", 
                PostedBy = "System" 
            }
        };

        [HttpGet("entries")]
        public ActionResult<IEnumerable<object>> GetGLEntries()
        {
            return Ok(_glEntries);
        }

        [HttpPost("post")]
        public ActionResult PostEntry([FromBody] object entry)
        {
            // In a real app, validation and double-entry checks would happen here
            _glEntries.Add(entry);
            return Ok(new { message = "GL Entry Posted Successfully", entryId = _glEntries.Count + 1 });
        }
    }
}
