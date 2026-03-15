export class AppException extends Error {
  public statusCode: number
  public metadata?: any

  constructor(message: string, statusCode: number = 500, metadata?: any) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.metadata = metadata
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestException extends AppException {
  constructor(message: string = 'Bad Request', metadata?: any) {
    super(message, 400, metadata)
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized', metadata?: any) {
    super(message, 401, metadata)
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = 'Not Found', metadata?: any) {
    super(message, 404, metadata)
  }
}

export class InternalServerErrorException extends AppException {
  constructor(message: string = 'Internal Server Error', metadata?: any) {
    super(message, 500, metadata)
  }
}
