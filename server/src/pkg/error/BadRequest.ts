import StatusError from './StatusError';

export default class BadRequest extends StatusError {
  name = 'BadRequest';

  constructor(message = 'Bad request') {
    super(message, 400);
  }
}
