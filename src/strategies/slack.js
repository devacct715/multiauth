// Slack OAuth 2.0 strategy implementation

export function SlackStrategy(config) {
    return {
        name: 'slack',
        type: 'oauth',
        authorizationURL: 'https://slack.com/oauth/v2/authorize',
        tokenURL: 'https://slack.com/api/oauth.v2.access',
        profileURL: 'https://slack.com/api/users.identity',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: [],
        authParams: { user_scope: 'identity.basic,identity.email,identity.avatar' }, // Slack requires user_scope for identity scopes
        accessTokenPath: 'authed_user.access_token', // token is nested in response
        normalizeProfile: (profile) => {
            const user = profile.user || {};
            return {
            id: user.id,
            provider: 'slack',
            email: user.email,
            displayName: user.name,
            avatarURL: user.image_192,
            raw: profile
        }}
    }
}
