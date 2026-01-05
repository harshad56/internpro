-- 05_Seed_BGs.sql
-- Seed Data for Bank Guarantees ONLY

INSERT INTO BG_Master (BGNumber, CustomerID, BeneficiaryName, BGType, Amount, Currency, IssueDate, ExpiryDate, ClaimPeriod, Status) VALUES
('BG-PER-001', 1, 'Federal Ministry of Works', 'Performance', 100000.00, 'USD', '2026-01-05', '2027-01-05', 365, 'Issued'),
('BG-BID-002', 2, 'State Oil Corp', 'Bid Bond', 5000.00, 'USD', '2026-03-01', '2026-06-01', 90, 'Submitted'),
('BG-ADV-003', 3, 'Construction Giants', 'Advance Payment', 200000.00, 'EUR', '2026-02-15', '2026-12-15', 180, 'Approved'),
('BG-PER-004', 1, 'Local Govt', 'Performance', 50000.00, 'NGN', '2026-01-25', '2026-07-25', 180, 'Draft');
