// Auth0 OAuth 2.0 strategy implementation

export function Auth0Strategy(config) {
    return {
        name: 'auth0',
        type: 'oauth',
        authorizationURL: `https://${config.domain}/authorize`,
        tokenURL: `https://${config.domain}/oauth/token`,
        profileURL: `https://${config.domain}/userinfo`,
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['openid', 'profile', 'email'],
        normalizeProfile: (profile) => { return {
            id: profile.sub,
            provider: 'auth0',
            email: profile.email,
            displayName: profile.name,
            avatarURL: profile.picture,
            raw: profile
        }}
    }
}