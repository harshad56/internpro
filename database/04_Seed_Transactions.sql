-- 04_Seed_Transactions.sql
-- Additional Seed Data for LCs and BGs to populate Dashboard

-- More LCs
INSERT INTO LC_Master (LCNumber, CustomerID, BeneficiaryName, LCType, PaymentTerms, Amount, Currency, IssueDate, ExpiryDate, Status, Tenor) VALUES
('LC-IMP-002', 1, 'Tech Solutions Inc', 'Import', 'Usance', 120000.00, 'USD', '2026-01-15', '2026-07-15', 'Submitted', 180),
('LC-EXP-003', 2, 'Global Tradings', 'Export', 'Sight', 75000.00, 'USD', '2026-02-01', '2026-05-01', 'Approved', 0),
('LC-IMP-004', 3, 'Heavy Machinery Co', 'Import', 'Sight', 500000.00, 'USD', '2026-02-10', '2026-08-10', 'Draft', 0),
('LC-EXP-005', 1, 'Agri Exports Ltd', 'Export', 'Usance', 250000.00, 'GBP', '2026-01-20', '2026-04-20', 'Issued', 60);

-- BGs
INSERT INTO BG_Master (BGNumber, CustomerID, BeneficiaryName, BGType, Amount, Currency, IssueDate, ExpiryDate, ClaimPeriod, Status) VALUES
('BG-PER-001', 1, 'Federal Ministry of Works', 'Performance', 100000.00, 'USD', '2026-01-05', '2027-01-05', 365, 'Issued'),
('BG-BID-002', 2, 'State Oil Corp', 'Bid Bond', 5000.00, 'USD', '2026-03-01', '2026-06-01', 90, 'Submitted'),
('BG-ADV-003', 3, 'Construction Giants', 'Advance Payment', 200000.00, 'EUR', '2026-02-15', '2026-12-15', 180, 'Approved'),
('BG-PER-004', 1, 'Local Govt', 'Performance', 50000.00, 'NGN', '2026-01-25', '2026-07-25', 180, 'Draft');
