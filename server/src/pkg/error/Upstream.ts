import StatusError from './StatusError';

export default class Upstream extends StatusError {
  name = 'Upstream';

  constructor(upstreamError: Error) {
    super(upstreamError.message, 501);
    this.cause = upstreamError;
  }
}
