-- Create GL Entries Table
CREATE TABLE GL_Entries (
    EntryID INT PRIMARY KEY IDENTITY(1,1),
    TransactionDate DATETIME DEFAULT GETDATE(),
    TransactionType VARCHAR(50), -- e.g., 'Loan Disbursement', 'LC Issuance'
    ReferenceNumber VARCHAR(50), -- e.g., Loan ID, LC Number
    DebitAccount VARCHAR(20),
    CreditAccount VARCHAR(20),
    Amount DECIMAL(18, 2),
    Currency VARCHAR(3),
    Description NVARCHAR(255),
    PostedBy VARCHAR(50)
);

-- Insert Mock Data
INSERT INTO GL_Entries (TransactionType, ReferenceNumber, DebitAccount, CreditAccount, Amount, Currency, Description, PostedBy)
VALUES 
('Loan Disbursement', 'LN-2024-001', '100100 (Cash)', '200100 (Loan Asset)', 500000.00, 'USD', 'Disbursement for Steel Import', 'System'),
('LC Issuance', 'LC-2024-889', '200200 (Liability)', '300100 (Fees)', 250.00, 'USD', 'Issuance Commission', 'System');
