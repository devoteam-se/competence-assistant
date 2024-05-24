import StatusError from './StatusError';

export default class Unauthorized extends StatusError {
  name = 'Unauthorized';

  constructor(message = 'Unauthorized', cause?: unknown) {
    super(message, 401);
    this.cause = cause;
  }
}
