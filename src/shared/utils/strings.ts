export const camelToTitle = (str: string): string => {
  const results = str.replace(/([A-Z])/g, ' $1')
  return results.charAt(0).toUpperCase() + results.slice(1)
}

export const truncate = (str: string, size: number): string => {
  return str.length <= size ? str : `${str.slice(0, size)}...`
}

export const alphanumeric = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9]/g, '')
}
