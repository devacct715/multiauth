// demo file

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Auth0Strategy, BitbucketStrategy, DiscordStrategy, FacebookStrategy, GitHubStrategy, GitLabStrategy,
    GoogleStrategy, LocalStrategy, NotionStrategy, 
    SlackStrategy, SpotifyStrategy, TwitchStrategy, createRouter, authMiddleware } from 'multiauth';

// load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

const strategies = [ 
    Auth0Strategy( {domain: process.env.AUTH0_DOMAIN, clientID: process.env.AUTH0_CLIENT_ID, clientSecret: process.env.AUTH0_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/auth0/callback' } ),
    BitbucketStrategy( {clientID: process.env.BITBUCKET_CLIENT_ID, clientSecret: process.env.BITBUCKET_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/bitbucket/callback' } ),
    DiscordStrategy( {clientID: process.env.DISCORD_CLIENT_ID, clientSecret: process.env.DISCORD_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/discord/callback' } ),
    FacebookStrategy( {clientID: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/facebook/callback' } ),
    GitHubStrategy( {clientID: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/github/callback' } ),
    GitLabStrategy( {clientID: process.env.GITLAB_CLIENT_ID, clientSecret: process.env.GITLAB_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/gitlab/callback' } ),
    GoogleStrategy( {clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/google/callback' } ),
    LocalStrategy(),
    NotionStrategy( {clientID: process.env.NOTION_CLIENT_ID, clientSecret: process.env.NOTION_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/notion/callback' } ),
    SlackStrategy( {clientID: process.env.SLACK_CLIENT_ID, clientSecret: process.env.SLACK_CLIENT_SECRET, callbackURL: 'https://cheryle-husbandless-unhappily.ngrok-free.dev/auth/slack/callback' } ),
    SpotifyStrategy( {clientID: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET, callbackURL: 'https://cheryle-husbandless-unhappily.ngrok-free.dev/auth/spotify/callback' } ),
    TwitchStrategy( {clientID: process.env.TWITCH_CLIENT_ID, clientSecret: process.env.TWITCH_CLIENT_SECRET, callbackURL: 'http://localhost:3000/auth/twitch/callback' } )]


const authRouter = createRouter(strategies);
app.use('/auth', authRouter);

// example protected route

app.get('/api/protected', authMiddleware(), (req, res) => {
    res.send(`Hello ${req.user.displayName}, you have accessed a protected route!`);
}
)

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});