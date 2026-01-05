CREATE TABLE AuditLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    Action VARCHAR(50) NOT NULL, -- e.g., 'Login', 'Create', 'Approve'
    EntityName VARCHAR(50), -- e.g., 'LC_Master', 'User'
    EntityID VARCHAR(50), -- e.g., 'LC2026001'
    PerformedBy VARCHAR(100), -- Username
    Timestamp DATETIME DEFAULT GETDATE(),
    Details NVARCHAR(MAX) -- Optional JSON or text details
);
