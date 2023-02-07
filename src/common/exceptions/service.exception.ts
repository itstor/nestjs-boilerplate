export class ServiceException<T> extends Error {
  public readonly name: T extends string
    ? Extract<T, string>
    : Extract<keyof T, string>;

  public readonly cause?: Error;

  constructor(
    name: T extends string ? Extract<T, string> : Extract<keyof T, string>,
    cause?: Error,
    message?: string,
  ) {
    super(message || name);
    this.name = name;
    this.cause = cause;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}
