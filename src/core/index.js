// Core module for exports

// router
import { createRouter } from "./router.js";

// jwt middleware
import { authMiddleware } from "./jwt.js";

// strategies
import { Auth0Strategy } from "../strategies/auth0.js";
import { BitbucketStrategy } from "../strategies/bitbucket.js";
import { DiscordStrategy } from "../strategies/discord.js";
import { FacebookStrategy } from "../strategies/facebook.js";
import { GitHubStrategy } from "../strategies/github.js";
import { GitLabStrategy } from "../strategies/gitlab.js";
import { GoogleStrategy } from "../strategies/google.js";
import { LocalStrategy } from "../strategies/local.js";
import { NotionStrategy } from "../strategies/notion.js";
import { SlackStrategy } from "../strategies/slack.js";
import { SpotifyStrategy } from "../strategies/spotify.js";
import { TwitchStrategy } from "../strategies/twitch.js";

export {
    createRouter,
    authMiddleware,
    Auth0Strategy,
    BitbucketStrategy,
    DiscordStrategy,
    FacebookStrategy,
    GitHubStrategy,
    GitLabStrategy,
    GoogleStrategy,
    LocalStrategy,
    NotionStrategy,
    SlackStrategy,
    SpotifyStrategy,
    TwitchStrategy
}; 

