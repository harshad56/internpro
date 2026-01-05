-- 03_Documents_Table.sql
CREATE TABLE TradeDocuments (
    DocumentID INT IDENTITY(1,1) PRIMARY KEY,
    ReferenceNumber NVARCHAR(50) NOT NULL, -- Links to LCNumber, BGNumber, etc.
    DocumentType NVARCHAR(50), -- Bill of Lading, Invoice, etc.
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    UploadedBy NVARCHAR(50),
    UploadDate DATETIME DEFAULT GETDATE()
);
