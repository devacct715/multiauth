
# MultiAuth

A Node.js authentication middleware package for React + Express applications.

MultiAuth uses a unified, strategy-based interface for adding authentication. Each provider is a minimal configuration object using a shared engine, making it easy to add new providers within minutes and with just a few lines of code. The package handles the entire OAuth lifecycle (authorization, token exchange, profile normalization) automatically, stores users in MongoDB with a unified schema across all providers, manages JWT sessions with protected route middleware, and includes a React SDK with a pre-built hook and branded login buttons. 


## Features
- 12 authentication strategies: 11 OAuth providers + local email/password
- Shared OAuth engine: automatic token exchange, profile fetching, and normalization
- Local authentication: email/password registration and login with bcrypt hashing
- Unified MongoDB user model: store local and OAuth users in one collection with automatic account linking by email (OAuth only)
- JWT session management: access token signing, verification, and Express middleware for protected routes
- React SDK: `AuthProvider` context, `useAuth()` hook, and branded `LoginButton` components for all 11 OAuth providers

## Supported Providers
| Provider  |      Type      |                                        Notes                                              |
| --------  | -------------- | ----------------------------------------------------------------------------------------- |                                                                   
| Local     | Email/Password | bcrypt hashing                                                                            |
| Auth0     | OAuth 2.0/OIDC | requires `domain` in config                                                               | 
| Bitbucket | OAuth 2.0      | does not return email address; client credentials in auth header for token exchange       |
| Discord   | OAuth 2.0      |                                                                                           |
| Facebook  | OAuth 2.0      |                                                                                           |
| GitHub    | OAuth 2.0      |                                                                                           |
| GitLab    | OAuth 2.0      |                                                                                           |
| Google    | OAuth 2.0      | access_type = offline for refresh token                                                   |
| Notion    | OAuth 2.0      | requires `Notion-Version` in header; client credentials in auth header for token exchange |
| Slack     | OAuth 2.0      | `user_scopes` for identity scopes; application requires secure callback URL               |
| Spotify   | OAuth 2.0      | application requires secure callback URL                                                  |
| Twitch    | OAuth 2.0      | requires `Client-ID` in header                                                            |    

## Installation

```bash
npm install multiauth
```

## Quick Start

**1. Environment Variables**
Create a `.env` file in your project root:
```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/your-db-name

# JWT
JWT_SECRET=your-random-secret-string

# OAuth Provider Credentials (add for each provider)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Callback URL (where users return after OAuth)
REACT_APP_CALLBACK=your-app-domain.com/home
```
*Note: Auth0 requires a 'domain' value (Auth0 tenant URL)*
```env
# Auth0 Config
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
```

**2. Server Setup (Express)**
```javascript
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // if using local hosts in development
import { createRouter, LocalStrategy, GoogleStrategy, FacebookStrategy } from 'multiauth';

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Configure strategies
const strategies = [
    LocalStrategy(), 
    GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback' // replace with your server's URL - must match what's registered in the provider's developer console
    }),
    FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    })
];

// Mount auth routes
const authRouter = createRouter(strategies);
app.use('/auth', authRouter)

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```
This example creates the following routes:
|        Route             |      Method    |                     Description                 |                                 
| ------------------------ | -------------- | ----------------------------------------------- |              
| `/auth/local/register`   | POST           | Register with display name, email, and password |
| `/auth/local/login`      | POST           | Login with email and password                   |
| `/auth/google`           | GET            | Redirect to Google login                        |
| `/auth/google/callback`  | GET            | Handle Google OAuth callback                    |
| `/auth/facebook`         | GET            | Redirect to Facebook login                      |
| `/auth/facebook/callback`| GET            | Handle Facebook OAuth callback                  |                                                                
| `/auth/me`               | GET            | Get current user profile (requires JWT)         |


**3. Client Setup (React)**
```jsx
import { AuthProvider, useAuth, LoginButton } from 'multiauth';
import { useState } from 'react';

function App() {
    return (
        <AuthProvider apiBase="http://localhost:3000/auth">
            <LoginPage />
        </AuthProvider>
    );
}

function LoginPage() {
    const { user, login, register, logout } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (user) {
        return (
            <div>
                <h2>Welcome, {user.profile.displayName}!</h2>
                <button onClick={logout}>Logout</button>
            </div>
        );
    } 
    
    return (
        <div>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={()=>login(email, password)}>Login</button>

            <LoginButton provider="google" />
            <LoginButton provider="facebook" />
        </div>
    );
 
}
```

## Protected Routes
Use `authMiddleware()` to protect any Express route. The middleware verifies the JWT from the `Authorization` header and attaches the user's information to `req.user`.
```javascript
import { authMiddleware } from 'multiauth';

app.get('/api/profile', authMiddleware(), (req, res) => {
    // req.user contains { id, email, displayName } from the JWT
    res.json({ message: `Hello, ${req.user.displayName}` }); 
})
```
The client sends the JWT with each request:
```javascript
const { user } = useAuth();

const response = await fetch('http://localhost:3000/api/profile', {
    headers: { 'Authorization': `Bearer ${user.token}` }
});
```

## API Reference
#### Server-Side (Express)
**Strategies**
Each strategy accepts a config object with `clientID`, `clientSecret`, and `callbackURL`:
```javascript
Auth0Strategy({ clientID, clientSecret, callbackURL, domain }) // domain is your Auth0 tenant URL
BitBucketStrategy({ clientID, clientSecret, callbackURL })
DiscordStrategy({ clientID, clientSecret, callbackURL })
FacebookStrategy({ clientID, clientSecret, callbackURL })
GitHubStrategy({ clientID, clientSecret, callbackURL })
GitLabStrategy({ clientID, clientSecret, callbackURL })
GoogleStrategy({ clientID, clientSecret, callbackURL })
NotionStrategy({ clientID, clientSecret, callbackURL })
SlackStrategy({ clientID, clientSecret, callbackURL })
SpotifyStrategy({ clientID, clientSecret, callbackURL })
TwitchStrategy({ clientID, clientSecret, callbackURL })
LocalStrategy() // no config needed
```
**`createRouter(strategies)`**
Accepts an array of strategy instances and returns an Express router with all authentication routes mounted automatically.
```javascript
const authRouter = createRouter([GoogleStrategy({...}), LocalStrategy()]);
app.use('/auth', authRouter);
```
**`authMiddleware()`**
Returns Express middleware that verifies the JWT from the `Authorization: Bearer <token>` header. On success, attaches the decoded token payload to `req.user`. On failure, returns a 401 response.

#### Client-Side (React)

**`<AuthProvider apiBase="...">`**
Wraps your application and manages authentication state. The apiBase prop should point to your Express auth routes (e.g., `http://localhost:3000/auth`).

**`useAuth()`**
Returns an object with:
|        Property                          |  Type    |                       Description                          |                                 
| ---------------------------------------- | -------- | ---------------------------------------------------------- |              
| `user`                                   | Object   | Contains `token` and `profile` if logged in, `null` if not |
| `login(email, password)`                 | Function | Login with email and password                              |        
| `register(email, password, displayName)` | Function | Register a new local account                               |                       
| `oauthLogin(provider)`                   | Function | Redirect to Oauth provider (e.g., `oauthLogin('google')`)  |
| `logout()`                               | Function | Clear auth state                                           |

**`<LoginButton provider="...">`**
Renders a branded OAuth login button. Accepts `provider`(required), `style`(optional), and `className`(optional) props.
```jsx
<LoginButton provider="google" />
<LoginButton provider="facebook" />
```
## Limitations
- Account linking not supported between OAuth and local auth
- State parameter not verified on callback
- Refresh token rotation not implemented
- No email verification for local registration

## Future Enhancements
- Account linking
- State verification
- Refresh token rotation
- Email verification

