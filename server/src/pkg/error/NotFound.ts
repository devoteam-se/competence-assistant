import StatusError from './StatusError';

export default class NotFound extends StatusError {
  name = 'NotFound';

  constructor(message = 'Not found') {
    super(message, 404);
  }
}
