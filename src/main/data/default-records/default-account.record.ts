
export const DEFAULT_ACCOUNT = [
        {
            
            name: 'Cash on hand',
            type: 'Asset',
           // code:'CASH_ON_HAND',
            code: '1100',
            isDefault: true,
            entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Accounts Receivable - Sales',
            type: 'Asset',
            code: '1200',
            //code:'ACCOUNTS_RECEIVABLE_SALES',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Inventory',
            type: 'Asset',
            code: '1400',
            //code:'INVENTORY',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'VAT payable - output',
            type: 'Liability',
            code: '2200',
            //code:'VAT_PAYABLE_OUTPUT',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'VAT payable - input',
            type: 'Liability',
            code: '2300',
           // code:'VAT_PAYABLE_INPUT',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Sales',
            type: 'Sales',
            code: '4100',
            //code:'SALES',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Cost of Sales',
            type: 'Expenses',
            code: '5100',
           // code:'COST_OF_SALES',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Local tax payable',
            type: 'Liability',
            code: '2400',
            //code:'LOCAL_TAX_PAYABLE',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Accounts payable',
            type: 'Liability',
            code: '2100',
           // code:'ACCOUNTS_PAYABLE',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Accounts receivable - others',
            type: 'Asset',
            code: '1300',
            //code:'ACCOUNTS_RECEIVABLE_OTHERS',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        },
        {
            
            name: 'Returns',
            type: 'Expenses',
            code: '5101',
           // code:'RETURNS',
            isDefault: true,
             entryUser: 'admin', // user.username
            entryDateTime: new Date(),
            isLocked: true,
        }   
    ]