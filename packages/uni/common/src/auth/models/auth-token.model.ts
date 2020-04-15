export interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  domain: string;
  payload?: any;
}
