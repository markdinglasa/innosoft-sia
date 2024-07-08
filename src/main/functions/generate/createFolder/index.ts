import { Response } from '@shared/types';
import fs from 'fs';

export const createFolder = (folderPath: string): Response => {
  try {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder created at ${folderPath}`);
        return {IsSomething: true, Message:`Folder created at ${folderPath}`}
    } else {
      console.log(`Folder already exists at ${folderPath}`);
      return {IsSomething: true, Message:`Folder already exists at ${folderPath}`}
    }
  } catch (error) {
    console.error(`Error creating folder: ${error}`);
    return {IsSomething: true, Message:`Error creating folder: ${error}`}
  }
};