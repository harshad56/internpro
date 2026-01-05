CREATE TABLE ChargesConfig (
    ChargeID INT PRIMARY KEY IDENTITY(1,1),
    Product NVARCHAR(100) NOT NULL,
    ChargeType NVARCHAR(100) NOT NULL,
    Rate NVARCHAR(50) NOT NULL,
    Basis NVARCHAR(50) NOT NULL,
    Currency NVARCHAR(10) NOT NULL
);

INSERT INTO ChargesConfig (Product, ChargeType, Rate, Basis, Currency)
VALUES 
('Letter of Credit', 'Issuance Commission', '0.125%', 'Per Quarter', 'USD'),
('Bank Guarantee', 'Issuance Commission', '2.00%', 'Per Annum', 'USD'),
('All Products', 'SWIFT Charge', '25.00', 'Flat', 'USD'),
('Trade Loan', 'Interest Rate', 'LIBOR + 2.5%', 'Per Annum', 'USD'),
('Collection', 'Handling Fee', '0.1%', 'Flat', 'USD');
