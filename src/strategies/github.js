// GitHub OAuth 2.0 strategy implementation

export function GitHubStrategy(config) {
    return {
        name: 'github',
        type: 'oauth',
        authorizationURL: 'https://github.com/login/oauth/authorize',
        tokenURL: 'https://github.com/login/oauth/access_token',
        profileURL: 'https://api.github.com/user',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['user'],
        normalizeProfile: (profile) => { return {
            id: profile.id,
            provider: 'github',
            email: profile.email,
            displayName: profile.name || profile.login,
            avatarURL: profile.avatar_url,
            raw: profile
        }}
    }
}