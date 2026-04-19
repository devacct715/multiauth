// core engine for handling authentication logic

// for state param
import crypto from 'crypto';

// generate URL for authentication based on the strategy configuration
export function generateAuthURL(strategy) {
    // provider-specific extra parameters
    let extraParams = '';
    if (strategy.authParams) {
        extraParams = '&'+ Object.entries(strategy.authParams).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    }
    return `${strategy.authorizationURL}?client_id=${strategy.clientID}&response_type=code&redirect_uri=${strategy.callbackURL}&scope=${encodeURIComponent(strategy.scope.join(' '))}${extraParams}&state=${crypto.randomBytes(16).toString('hex')}`;
}

// exchange authorization code for tokens
export async function exchangeCode(strategy, code) {
    let tokenBody;
    let headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'};
    if (strategy.credentialsInHeader) {
        headers['Authorization'] = 'Basic ' + Buffer.from(`${strategy.clientID}:${strategy.clientSecret}`).toString('base64');
        tokenBody = new URLSearchParams({
            code: code,
            redirect_uri: strategy.callbackURL,
            grant_type: 'authorization_code'
        });
    } else {
        tokenBody = new URLSearchParams({
            client_id: strategy.clientID,
            client_secret: strategy.clientSecret,
            code: code,
            redirect_uri: strategy.callbackURL,
            grant_type: 'authorization_code'
        });
    }
    const response = await fetch(strategy.tokenURL, {method: 'POST', headers: headers, body: tokenBody});
    const tokens = await response.json();
    return tokens;
}

// fetch user using access token
export async function fetchProfile(strategy, accessToken) {
    const response = await fetch(strategy.profileURL, {headers: {'Authorization': `Bearer ${accessToken}`, ...(strategy.profileHeaders ? strategy.profileHeaders : {})}});
    const profile = await response.json();
    return profile;
}

// authentication callback
export async function handleCallback(strategy, code) {
    const tokens = await exchangeCode(strategy, code);
    const accessToken = strategy.accessTokenPath ? strategy.accessTokenPath.split('.').reduce((obj, key) => obj[key], tokens) : tokens.access_token;
    const profile = await fetchProfile(strategy, accessToken);
    const normalizedProfile = strategy.normalizeProfile(profile);
    return normalizedProfile;
}