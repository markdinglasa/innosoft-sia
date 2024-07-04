
export const roleType = async (T: string): Promise<string> => {
    const types: { [key: string]: string } = {
      'administrator': 'administrator',
      'cashier': 'cashier',
      'teller': 'teller'
    };
  
    return types[T] || 'none';
  }
  
  export const licenseDuration = async (Day: string): Promise<number> => {
    const durations: { [key: string]: number } = {
      '7': 7,
      '14': 14,
      '30': 30,
      '90': 90,
      '365': 365
    };
  
    return durations[Day] || 0;
  }
  
  
  export const businessType = async (T: string): Promise<string> => {
    const businessTypes: { [key: string]: string } = {
      retail: 'retail',
      restaurant: 'restaurant',
      hotel: 'hotel'
    };
  
    return businessTypes[T] || 'none';
  }
  
  export const alphanumeric = (input: string): string => {
    return input.replace(/[^a-zA-Z0-9]/g, '')
  }
  