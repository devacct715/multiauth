// Google OAuth 2.0 strategy implementation

export function GoogleStrategy(config) {
    return {
        name: 'google',
        type: 'oauth',
        authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenURL: 'https://oauth2.googleapis.com/token',
        profileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['email', 'profile'],
        authParams: { access_type: 'offline' }, // Required for refresh token
        normalizeProfile: (profile) => { return {
            id: profile.sub,
            provider: 'google',
            email: profile.email,
            displayName: profile.name, 
            avatarURL: profile.picture,
            raw: profile
            }
        }
    }
}
