import { OAuthType } from '../types/oauth.type';

export interface IOAuthState {
  type: OAuthType;
  key?: string;
}
