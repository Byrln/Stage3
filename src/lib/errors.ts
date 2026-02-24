export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  PLAN_LIMIT_EXCEEDED = 'PLAN_LIMIT_EXCEEDED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message: string, details?: any) {
    return new AppError(message, ErrorCode.BAD_REQUEST, 400, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError(message, ErrorCode.UNAUTHORIZED, 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, ErrorCode.FORBIDDEN, 403);
  }

  static notFound(message: string = 'Not Found') {
    return new AppError(message, ErrorCode.NOT_FOUND, 404);
  }

  static planLimitExceeded(message: string) {
    return new AppError(message, ErrorCode.PLAN_LIMIT_EXCEEDED, 403);
  }

  static validationError(message: string, details?: any) {
    return new AppError(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: error.message, // Be careful exposing internal error messages in production
        },
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}
