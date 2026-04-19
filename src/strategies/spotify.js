// Spotify OAuth 2.0 strategy implementation

export function SpotifyStrategy(config) {
    return {
        name: 'spotify',
        type: 'oauth',
        authorizationURL: 'https://accounts.spotify.com/authorize',
        tokenURL: 'https://accounts.spotify.com/api/token',
        profileURL: 'https://api.spotify.com/v1/me',
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: ['user-read-email', 'user-read-private'],
        normalizeProfile: (profile) => { return {
            id: profile.id,
            provider: 'spotify',
            email: profile.email,
            displayName: profile.display_name,
            avatarURL: profile.images && profile.images.length > 0 ? profile.images[0].url : null,
            raw: profile
        }}
    }
}