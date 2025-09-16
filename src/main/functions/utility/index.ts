export const roleType = async (T: string): Promise<string> => {
  const types: { [key: string]: string } = {
    administrator: 'administrator',
    cashier: 'cashier',
    teller: 'teller'
  }
  return types[T] || 'none'
}
export const licenseDuration = async (Day: string): Promise<number> => {
  const durations: { [key: string]: number } = {
    '7': 7,
    '14': 14,
    '30': 30,
    '90': 90,
    '365': 365
  }
  return durations[Day] || 0
}
export const businessType = async (T: string): Promise<string> => {
  const businessTypes: { [key: string]: string } = {
    retail: 'retail',
    restaurant: 'restaurant',
    hotel: 'hotel'
  }
  return businessTypes[T] || 'none'
}
export const alphanumeric = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9]/g, '')
}

export const formatDateYYYYMMDD = (CurrentDate: Date) => {
  const month = String(CurrentDate.getMonth() + 1).padStart(2, '0') // Months are 0-based, add 1
  const day = String(CurrentDate.getDate()).padStart(2, '0')
  const year = CurrentDate.getFullYear()
  return `${year}${month}${day}`
}
export const formatDateYYYYMMDDHHMMSS = (CurrentDate: Date) => {
  const month = String(CurrentDate.getMonth() + 1).padStart(2, '0') // Months are 0-based, add 1
  const day = String(CurrentDate.getDate()).padStart(2, '0')
  const year = CurrentDate.getFullYear()
  const hour = String(CurrentDate.getHours()).padStart(2, '0')
  const min = String(CurrentDate.getMinutes()).padStart(2, '0')
  const sec = String(CurrentDate.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${min}${sec}`
}

export const formatDateDash = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based, add 1
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export const formatDateMMDDYYYY = (date: Date): string => {
  const month = String(new Date(date).getMonth() + 1).padStart(2, '0') // Months are 0-based, add 1
  const day = String(new Date(date).getDate()).padStart(2, '0')
  const year = new Date(date).getFullYear()
  return `${month}${day}${year}`
}
export function calculateAge(dateOfBirth: string) {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
export const formatDateSlash = (date: Date): string => {
  const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0')
  const day = new Date(date).getDate().toString().padStart(2, '0')
  const year = new Date(date).getFullYear()
  return `${month}/${day}/${year}`
}
export const formatDateFD = (CurrentDate: Date) => {
  const month = String(CurrentDate.getMonth() + 1).padStart(2, '0') // Months are 0-based, add 1
  const day = String(CurrentDate.getDate()).padStart(2, '0')
  const year = CurrentDate.getFullYear()
  // 12 hr format
  const hour = String(
    CurrentDate.getHours() ? CurrentDate.getHours() - 12 : CurrentDate.getHours()
  ).padStart(2, '0')
  const min = String(CurrentDate.getMinutes()).padStart(2, '0')
  const sec = String(CurrentDate.getSeconds()).padStart(2, '0')
  return `${month}/${day}/${year} ${hour}:${min}:${sec} ${CurrentDate.getHours() > 12 ? 'PM' : 'AM'}`
}

export const formatNumber = (value: number | undefined, defaultValue = 0): string =>
  (Math.round((value ?? defaultValue) * 100) / 100).toFixed(2)
