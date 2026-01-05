-- 01_Schema_Create.sql
-- Trade Finance System Schema

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(256) NOT NULL,
    Role NVARCHAR(50) NOT NULL, -- BranchUser, TradeOps, CreditOfficer, Compliance, Admin
    Email NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CIF_ID NVARCHAR(20) UNIQUE NOT NULL,
    CustomerName NVARCHAR(100) NOT NULL,
    Country NVARCHAR(50) NOT NULL,
    RiskRating NVARCHAR(10) NOT NULL, -- Low, Medium, High
    SanctionStatus NVARCHAR(20) DEFAULT 'Clean',
    Email NVARCHAR(100),
    Phone NVARCHAR(20)
);

CREATE TABLE Limits (
    LimitID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    LimitType NVARCHAR(50) NOT NULL, -- Funded, Non-Funded
    Currency NVARCHAR(3) NOT NULL,
    TotalLimit DECIMAL(18,2) NOT NULL,
    UtilizedLimit DECIMAL(18,2) DEFAULT 0,
    ExpiryDate DATE
);

CREATE TABLE LC_Master (
    LCID INT IDENTITY(1,1) PRIMARY KEY,
    LCNumber NVARCHAR(50) UNIQUE NOT NULL,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    BeneficiaryName NVARCHAR(100),
    LCType NVARCHAR(20), -- Import, Export
    PaymentTerms NVARCHAR(20), -- Sight, Usance
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL,
    IssueDate DATE,
    ExpiryDate DATE,
    Status NVARCHAR(20) DEFAULT 'Draft', -- Draft, Approved, Issued, Closed
    Tenor INT -- Days
);

CREATE TABLE BG_Master (
    BGID INT IDENTITY(1,1) PRIMARY KEY,
    BGNumber NVARCHAR(50) UNIQUE NOT NULL,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    BeneficiaryName NVARCHAR(100),
    BGType NVARCHAR(20), -- Performance, Bid Bond, Advance Payment
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL,
    IssueDate DATE,
    ExpiryDate DATE,
    ClaimPeriod INT, -- Days
    Status NVARCHAR(20) DEFAULT 'Draft'
);

CREATE TABLE TradeLoans (
    LoanID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    LoanType NVARCHAR(50), -- Packing Credit, Bill Discounting
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL,
    InterestRate DECIMAL(5,2),
    StartDate DATE,
    MaturityDate DATE,
    Status NVARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE AuditLog (
    AuditID INT IDENTITY(1,1) PRIMARY KEY,
    EntityName NVARCHAR(50),
    EntityID NVARCHAR(50),
    Action NVARCHAR(50),
    PerformedBy NVARCHAR(50),
    Timestamp DATETIME DEFAULT GETDATE(),
    Details NVARCHAR(MAX)
);

CREATE TABLE ComplianceRecords (
    RecordID INT IDENTITY(1,1) PRIMARY KEY,
    TransactionType NVARCHAR(20), -- LC, BG
    TransactionID INT,
    CheckDate DATETIME DEFAULT GETDATE(),
    SanctionMatchScore DECIMAL(5,2),
    Status NVARCHAR(20) -- Cleared, Flagged
);
