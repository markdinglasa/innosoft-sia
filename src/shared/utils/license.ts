export const type = (T: string): string => {
  let type: string = 'none'
  try {
    switch (T) {
      case 'administrator':
        type = 'administrator'
        break
      case 'cashier':
        type = 'cashier'
        break
      case 'teller':
        type = 'teller'
        break
      default:
        type
        break
    }
    return type
  } catch (error: any) {
    return type
  }
}

export const duration = (Day: string): number => {
  try {
    let day: number = 0
    switch (Day) {
      case '7':
        day = 7
        break
      case '14':
        day = 14
        break
      case '30':
        day = 30
        break
      case '90':
        day = 90
        break
      case '365':
        day = 365
        break
      default:
        day
        break
    }
    return day
  } catch (error: any) {
    return 0
  }
}

export const business = (T: string): string => {
  let type: string = 'none'
  try {
    switch (T) {
      case 'retail':
        type = 'retail'
        break
      case 'restaurant':
        type = 'restaurant'
        break
      case 'hotel':
        type = 'hotel'
        break
      default:
        type
        break
    }
    return type
  } catch (error: any) {
    return type
  }
}
