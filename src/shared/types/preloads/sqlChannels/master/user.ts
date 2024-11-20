export enum MstUser {
  getAllUser = 'get-all-user',
  getUserDetails = 'get-user-details', // requires Id
  deleteUser = 'delete-user', // requires Id
  updateUser = 'update-user', // requires Id & Data
  newUser = 'new-user' // requires Data
}
