IF EXISTS (SELECT 1 FROM Users WHERE Username = 'harshad')
BEGIN
    UPDATE Users SET Email = 'harshadbagal145@gmail.com' WHERE Username = 'harshad'
END
ELSE
BEGIN
    INSERT INTO Users (Username, PasswordHash, Role, Email) VALUES ('harshad', 'temp_passs', 'Admin', 'harshadbagal145@gmail.com')
END
