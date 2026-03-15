import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { BadRequestException } from '../exceptions'

/**
 * Validates a plain object against a class-validator decorated class.
 * @param cls The class to validate against.
 * @param plain The plain object to validate.
 * @returns The transformed class instance if validation succeeds.
 * @throws BadRequestException with detailed error messages if validation fails.
 */
export async function transformAndValidate<T extends object>(
  cls: new () => T,
  plain: any
): Promise<T> {
  const instance = plainToInstance(cls, plain)
  const errors = await validate(instance)

  if (errors.length > 0) {
    const message = formatValidationErrors(errors)
    throw new BadRequestException(message)
  }

  return instance
}

/**
 * Formats class-validator Errors into a readable string.
 */
function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints).join(', ')
      }
      if (error.children && error.children.length > 0) {
        return formatValidationErrors(error.children)
      }
      return `Invalid value for ${error.property}`
    })
    .join('; ')
}
