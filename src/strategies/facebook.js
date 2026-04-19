// Facebook OAuth 2.0 strategy implementation

export function FacebookStrategy(config) {
    return {
        name: 'facebook',
        type: 'oauth',
        authorizationURL: 'https://www.facebook.com/v25.0/dialog/oauth',
        tokenURL: 'https://graph.facebook.com/v25.0/oauth/access_token',
        profileURL: 'https://graph.facebook.com/me?fields=id,name,email,picture',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['email', 'public_profile'],
        normalizeProfile: (profile) => { return {
            id: profile.id,
            provider: 'facebook',
            email: profile.email,
            displayName: profile.name,
            avatarURL: profile.picture && profile.picture.data ? profile.picture.data.url : null,
            raw: profile
        }}
    }
}