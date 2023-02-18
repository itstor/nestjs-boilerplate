import * as argon2 from 'argon2';

export class HashUtils {
  public static async hashPassword(password: string) {
    return await argon2.hash(password, { type: argon2.argon2id });
  }

  public static async comparePassword(
    password: string,
    passwordToCompare: string,
  ) {
    return await argon2.verify(password, passwordToCompare);
  }
}
