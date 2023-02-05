export interface IEmailData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}
