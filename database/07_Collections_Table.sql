-- 07_Collections_Table.sql
CREATE TABLE Collections (
    CollectionID INT IDENTITY(1,1) PRIMARY KEY,
    ReferenceNumber NVARCHAR(50) UNIQUE NOT NULL,
    Type NVARCHAR(20) NOT NULL, -- Import / Export
    TenorType NVARCHAR(20), -- Sight / Usance
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL,
    DrawerName NVARCHAR(100), -- Exporter
    DraweeName NVARCHAR(100), -- Importer
    BankRef NVARCHAR(50),
    Status NVARCHAR(20) DEFAULT 'Lodged', -- Lodged, Accepted, Paid
    SubmissionDate DATETIME DEFAULT GETDATE()
);
