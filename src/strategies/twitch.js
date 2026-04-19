// Twitch OAuth 2.0 strategy implementation

export function TwitchStrategy(config) {
    return {
        name: 'twitch',
        type: 'oauth',
        authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
        tokenURL: 'https://id.twitch.tv/oauth2/token',
        profileURL: 'https://api.twitch.tv/helix/users',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['user:read:email'],
        profileHeaders: { 'Client-ID': config.clientID }, // Twitch requires Client-ID in profile request
        normalizeProfile: (profile) => {
            const user = profile.data && profile.data.length > 0 ? profile.data[0] : {}; // Twitch returns user info in data array
            return {
                id: user.id,
                provider: 'twitch',
                email: user.email,
                displayName: user.display_name,
                avatarURL: user.profile_image_url,
                raw: profile
            }
        }
    }    
}
