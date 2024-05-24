export default class StatusError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
    this.status = status;
  }
}