 
export const DEFAULT_TAX = [
    {
        name: 'VAT',
        description: 'Value Added Tax',
        taxCode: 'Inclusive',
        rate: 12,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        name: 'Non-VAT',
        description: 'Non-VATable',
        taxCode: 'Inclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        name: 'LOCAL',
        description: 'Value Added Tax',
        taxCode: 'Exclusive',
        rate: 5,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        name: 'VAT-Exclusive',
        description: 'Value Added Tax - Exclusive',
        taxCode: 'Exclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        name: 'VAT-Exempt',
        description: 'Value Added Tax - Exempted',
        taxCode: 'Inclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        name: 'Zero Rated',
        description: 'Zero Rated Tax',
        taxCode: 'Inclusive',
        rate: 0,
        account: 'VAT payable - output', // account.account
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
]