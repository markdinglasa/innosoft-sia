
export const DEFAULT_ROLES = [
    {
        isLocked: true,
        code: 'ADMINISTRATOR',
        name: 'Administrator',
        description: 'Store administrator',
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        isLocked: true,
        code: 'CASHIER',
        name: 'Cashier',
        description: 'Store cahsier',
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
    {
        isLocked: true,
        code: 'TELLER',
        name: 'Teller',
        description: 'Store teller',
        isDefault: true,
        entryUser: 'admin', // user.username
        entryDateTime: new Date()
    },
]