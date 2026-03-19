 
export const DEFAULT_TAX = [
    {
       name: 'VAT',
        description: 'Value Added Tax',
        code: 'Inclusive',
        rate: 12,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
       name: 'Non-VAT',
        description: 'Non-VATable',
        code: 'Inclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
       name: 'LOCAL',
        description: 'Value Added Tax',
        code: 'Exclusive',
        rate: 5,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
       name: 'VAT-Exclusive',
        description: 'Value Added Tax - Exclusive',
        code: 'Exclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
       name: 'VAT-Exempt',
        description: 'Value Added Tax - Exempted',
        code: 'Inclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
       name: 'Zero Rated',
        description: 'Zero Rated Tax',
        code: 'Inclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
]