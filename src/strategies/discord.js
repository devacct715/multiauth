// Discord OAuth 2.0 strategy implementation

export function DiscordStrategy(config) {
    return {
        name: 'discord',
        type: 'oauth',
        authorizationURL: 'https://discord.com/api/oauth2/authorize',
        tokenURL: 'https://discord.com/api/oauth2/token',
        profileURL: 'https://discord.com/api/users/@me',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['identify', 'email'],
        normalizeProfile: (profile) => { return {
            id: profile.id,
            provider: 'discord',
            email: profile.email,
            displayName: profile.username,
            avatarURL: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
            raw: profile
        }}
    }
}