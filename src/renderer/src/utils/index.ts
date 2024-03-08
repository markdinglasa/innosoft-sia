import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

//ClassName merger
export const cn = (..._args: ClassValue[]) => {
  return twMerge(clsx(..._args))
}
