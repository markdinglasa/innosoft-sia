/**
 * Get an existing user
 * @param {String} Username - Username of a user
 * @returns {Promise<JSON>} - returns a data of a user
 */
export const getUserByUsername = async (Username: string = ''): Promise<any> => {
  try {
    if (typeof Username !== 'string' || !Username) return []
    const user = await recordByFields(QUERY.q014x002, ['Username'], [NVarChar(255)], [Username])
    if (!user) return []
    return user[0]
  } catch (error) {
    console.log('Error Functions getUserByUsername' + error)
    return []
  }
}
