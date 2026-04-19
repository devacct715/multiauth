// Notion OAuth 2.0 strategy implementation

export function NotionStrategy(config) {
    return {
        name: 'notion',
        type: 'oauth',
        authorizationURL: 'https://api.notion.com/v1/oauth/authorize',
        tokenURL: 'https://api.notion.com/v1/oauth/token',
        profileURL: 'https://api.notion.com/v1/users/me',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['user.read', 'user.write'],
        authParams: { owner: 'user' }, // Notion requires owner param to specify the type of user
        profileHeaders: { 'Notion-Version': '2022-06-28' }, // Notion API version header
        credentialsInHeader: true, // Notion requires client credentials in the Authorization header for token
        normalizeProfile: (profile) => {
            const user = profile.bot.owner.user || profile.user; // handle both user and bot accounts
            return {
            id: user.id,
            provider: 'notion',
            email: profile.email || null,
            displayName: user.name,
            avatarURL: user.avatar_url,
            raw: profile
        }}
    }
}