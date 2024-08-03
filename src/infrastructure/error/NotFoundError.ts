export class NotFoundError extends Error {
  public readonly cause?: Error

  public override name = this.constructor.name

  constructor(message: string, cause?: Error) {
    super(message)
    this.cause = cause
  }
}
