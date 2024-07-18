export enum QueryFn {
    q00x001 = 'SELECT * FROM [MstUser] WHERE [Username] = @Username',
    q00x002 = 'SELECT TOP 1 [IsReturn] FROM [TrnCollection]',
    q00x003 = 'ALTER TABLE [TrnCollection] ADD [IsReturn] INT NULL',
    q00x004 = 'SELECT TOP 1 FROM [TrnPaxTable]',
    q00x005 = 'CREATE TABLE [TrnPaxTable] (Id INT IDENTITY(1,1) PRIMARY KEY, SaleId INT, TotalPax INT, DiscountedPax INT);',
    q00x006 = 'INSERT INTO [TrnPaxTable] (Id, SalesId, TotalPax, DiscountedPax) VALUES (7, 410, 1, 1), (8, 411, 1, 1), (9, 412, 2, 1), (10, 413, 1, 1)',
}