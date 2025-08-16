import { authorize, refresh, AuthConfiguration, AuthorizeResult, RefreshResult } from 'react-native-app-auth';

export type Provider = 'googleTasks' | 'todoist';

export interface OAuthTokens {
  accessToken: string;
  accessTokenExpirationDate?: string;
  refreshToken?: string;
  idToken?: string;
  tokenType?: string;
  scope?: string;
}

export async function oauthAuthorize(config: AuthConfiguration): Promise<OAuthTokens> {
  const result: AuthorizeResult = await authorize(config);
  return {
    accessToken: result.accessToken,
    accessTokenExpirationDate: result.accessTokenExpirationDate,
    refreshToken: result.refreshToken,
    idToken: result.idToken,
    tokenType: result.tokenType,
    scope: result.scopes?.join(' '),
  };
}

export async function oauthRefresh(config: AuthConfiguration, refreshToken: string): Promise<OAuthTokens> {
  const result: RefreshResult = await refresh(config, { refreshToken });
  return {
    accessToken: result.accessToken,
    accessTokenExpirationDate: result.accessTokenExpirationDate,
    refreshToken: result.refreshToken ?? refreshToken,
    idToken: result.idToken,
    tokenType: result.tokenType,
    scope: result.scopes?.join(' '),
  };
}