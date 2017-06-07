import ExtendableError from 'es6-error';

export class NotFoundError extends ExtendableError {
  constructor(message = 'The content is not found!') {
    super(message);
  }
}
