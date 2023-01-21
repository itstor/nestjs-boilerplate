import { DatabaseType, TypeORMError } from 'typeorm';

export class DBUtils {
  public static getColumnFromError(error: TypeORMError, dbType: DatabaseType) {
    const message = error.message;

    if (dbType === 'postgres') {
      return message.split('"')[1].split('"')[0];
    }
    if (dbType === 'sqlite') {
      return message.split(':')[2].split('.').at(-1)?.trim();
    }
  }
}
