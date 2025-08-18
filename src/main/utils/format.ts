export const formatNumber = (value: number | undefined, defaultValue = 0): string =>
  (Math.round((value ?? defaultValue) * 100) / 100).toFixed(2)
