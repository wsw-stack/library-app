export const oktaConfig = {
    clientId: '0oakej6ys3glIWCRJ5d7',
    issuer: 'https://dev-11954395.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpCheck: true
}