// Bitbucket OAuth 2.0 strategy implementation

export function BitbucketStrategy(config) {
    return {
        name: 'bitbucket',
        type: 'oauth',
        authorizationURL: 'https://bitbucket.org/site/oauth2/authorize',
        tokenURL: 'https://bitbucket.org/site/oauth2/access_token',
        profileURL: 'https://api.bitbucket.org/2.0/user',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['account', 'email'],
        credentialsInHeader: true, // Bitbucket requires client credentials in headers for token exchange
        normalizeProfile: (profile) => { return {
            id: profile.uuid,
            provider: 'bitbucket',
            email: null, // Bitbucket requires a separate API call to fetch email, which is not implemented here for simplicity
            displayName: profile.display_name,
            avatarURL: profile.links && profile.links.avatar ? profile.links.avatar.href : null,
            raw: profile
        }}
    }
}