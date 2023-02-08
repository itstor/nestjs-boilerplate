export interface IForgotPasswordCookie {
  fpass: {
    email: string;
    id: string;
    verified: boolean;
  } | null;
}
