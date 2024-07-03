import { ACCESS_TOKEN_SECRET } from '@shared/constants';
import jwt from 'jsonwebtoken';

/**
 * Creates a new token
 * @param {number} User - User Id
 * @returns {Promise<String>} - returns a string of encrypted token
*/

export const generateToken = async (User: number = 0): Promise<string> => {
    let flag = '';
    try {
        if (isNaN(User) || typeof User !== 'number') return flag;
        return jwt.sign({ User }, ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    } catch(error: any) {
        console.log('Error Functions generateToken: Error' + error);
        return flag;
    }
}