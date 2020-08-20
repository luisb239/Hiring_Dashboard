export class CommonError {
  constructor(public errorType: ErrorType, public message: string) {
  }
}

export enum ErrorType {
  BAD_REQUEST, NOT_FOUND, CONFLICT, GONE, INTERNAL_SERVER
}
