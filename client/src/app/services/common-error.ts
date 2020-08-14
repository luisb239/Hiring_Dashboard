export class CommonError {
  constructor(public errorType: ErrorType, public message: string) {
  }
}

export enum ErrorType {
  NOT_FOUND, CONFLICT, PRECONDITION_FAILED, INTERNAL_SERVER
}
