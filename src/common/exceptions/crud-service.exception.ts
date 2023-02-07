export type CRUDErrorNameType = 'NOT_FOUND' | 'EXISTS' | 'INVALID' | 'UNKNOWN';

export class CRUDException<T> extends Error {
  public readonly name: CRUDErrorNameType;
  public readonly message: T extends string
    ? Extract<T, string>
    : Extract<keyof T, string>;
  public readonly cause?: Error;

  constructor(
    name: CRUDErrorNameType,
    cause?: Error,
    message?: T extends string ? Extract<T, string> : Extract<keyof T, string>,
  ) {
    super(message || name);
    this.name = name;
    this.cause = cause;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}
