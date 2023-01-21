export class ServiceException<T> extends Error {
  public readonly message: T extends string
    ? Extract<T, string>
    : Extract<keyof T, string>;

  constructor(
    message?: T extends string ? Extract<T, string> : Extract<keyof T, string>,
  ) {
    super(message);
  }
}
