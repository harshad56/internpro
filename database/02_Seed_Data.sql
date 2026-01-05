-- 02_Seed_Data.sql
-- Sample Data for Trade Finance System

-- Users
INSERT INTO Users (Username, PasswordHash, Role, Email) VALUES 
('admin', 'password', 'Admin', 'admin@bank.com'),
('tradeops', 'hashed_password_123', 'TradeOps', 'ops@bank.com'),
('maker1', 'hashed_password_123', 'BranchUser', 'maker@bank.com'),
('checker1', 'hashed_password_123', 'CreditOfficer', 'checker@bank.com');

-- Customers
INSERT INTO Customers (CIF_ID, CustomerName, Country, RiskRating, SanctionStatus, Email) VALUES
('CIF001', 'Global Importers Ltd', 'Nigeria', 'Low', 'Clean', 'info@globalimporters.com'),
('CIF002', 'Cocoa Exports NG', 'Ghana', 'Medium', 'Clean', 'sales@cocoaexports.com'),
('CIF003', 'Steel Works Plc', 'Kenya', 'High', 'Flagged', 'contact@steelworks.ke');

-- Limits
INSERT INTO Limits (CustomerID, LimitType, Currency, TotalLimit, UtilizedLimit, ExpiryDate) VALUES
(1, 'Funded', 'USD', 1000000.00, 50000.00, '2026-12-31'),
(1, 'Non-Funded', 'USD', 2000000.00, 100000.00, '2026-12-31'),
(2, 'Funded', 'GHS', 5000000.00, 0.00, '2027-06-30');

-- LC Master
INSERT INTO LC_Master (LCNumber, CustomerID, BeneficiaryName, LCType, PaymentTerms, Amount, Currency, IssueDate, ExpiryDate, Status, Tenor) VALUES
('LC2026001', 1, 'China Machines Co', 'Import', 'Sight', 50000.00, 'USD', '2026-01-10', '2026-04-10', 'Issued', 90);
