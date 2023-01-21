export type CRUDErrorType = 'NOT_FOUND' | 'EXISTS' | 'INVALID' | 'UNKNOWN';

export class CRUDException<T> extends Error {
  public readonly message: T extends string
    ? Extract<T, string>
    : Extract<keyof T, string>;

  public readonly name: CRUDErrorType;

  constructor(
    name: CRUDErrorType,
    message?: T extends string ? Extract<T, string> : Extract<keyof T, string>,
  ) {
    super(message);
    this.name = name;
  }
}
