// GitLab OAuth 2.0 strategy implementation

export function GitLabStrategy(config) {
    return {
        name: 'gitlab',
        type: 'oauth',
        authorizationURL: 'https://gitlab.com/oauth/authorize',
        tokenURL: 'https://gitlab.com/oauth/token',
        profileURL: 'https://gitlab.com/api/v4/user',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['read_user'],
        normalizeProfile: (profile) => { return {
            id: profile.id,
            provider: 'gitlab',
            email: profile.email || profile.public_email, // GitLab may return email in public_email if it's not private
            displayName: profile.name,
            avatarURL: profile.avatar_url,
            raw: profile
        }}
    }
}