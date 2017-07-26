import ExtendableError from 'es6-error';

export class TableNotFoundError extends ExtendableError {
  constructor(message = 'The table with the id given is not found!', code = 404) {
    super(message);
    this.code = code;
  }
}

export class RecordNotFoundError extends ExtendableError {
  constructor(message = 'The record with the id given is not found!', code = 404) {
    super(message);
    this.code = code;
  }
}

export class TokenInvalidError extends ExtendableError {
  constructor(message = 'The Table Access Token provided is invalid!', code = 401) {
    super(message);
    this.code = code;
  }
}

export class TokenNotWritableError extends ExtendableError {
  constructor(message = 'The token provided is not allowed to make changes on records of this table!', code = 401) {
    super(message);
    this.code = code;
  }
}
