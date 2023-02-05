import * as path from 'path';

const BASE_PATH = path.join(
  process.cwd(),
  'src',
  'modules',
  'email',
  'templates',
);

export const EmailTemplate = {
  VERIFICATION_EMAIL: path.join(BASE_PATH, 'verification-email'),
  RESET_PASSWORD_EMAIL: path.join(BASE_PATH, 'reset-password'),
} as const;
