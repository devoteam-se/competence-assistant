import StatusError from './StatusError';

export default class Forbidden extends StatusError {
  name = 'Forbidden';

  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}
