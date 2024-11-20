export enum MstAccount {
  getAllAccounts = 'get-all-accounts',
  getAccountDetails = 'get-account-details', // requires Id
  deleteAccount = 'delete-account', // requires Id
  updateAccount = 'update-account', // requires Id & Data
  newAccount = 'new-account' // requires Data
}
