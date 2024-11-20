import { format } from 'date-fns'; // Using date-fns for date formatting

// Function to generate the file name
export const generateSIAName = (): string => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'MM_yyyy');
  return `${formattedDate}.csv`;
};