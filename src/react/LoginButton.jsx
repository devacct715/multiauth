import { useAuth } from './AuthProvider';
import auth0 from './logos/auth0.png';
import bitbucket from './logos/bitbucket.png';
import discord from './logos/discord.png';
import facebook from './logos/facebook.svg';
import github from './logos/github.png';
import gitlab from './logos/gitlab.png';
import google from './logos/google.png'; 
import notion from './logos/notion.png';
import slack from './logos/slack.png';
import spotify from './logos/spotify.svg';
import twitch from './logos/twitch.svg';

const providerBrands = {
    auth0: {
        label: 'Sign in with Auth0',
        logo: auth0, 
    }, 
    bitbucket: {
        label: 'Sign in with BitBucket',
        logo: bitbucket
    },
    discord: {
        label: 'Sign in with Discord',
        logo: discord
    },
    facebook: {
        label: 'Sign in with Facebook',
        logo: facebook
    },
    github: {
        label: 'Sign in with GitHub',
        logo: github
    },
    gitlab: {
        label: 'Sign in with GitLab',
        logo: gitlab
    },
    google: {
        label: 'Sign in with Google',
        logo: google
    },
    notion: {
        label: 'Sign in with Notion',
        logo: notion
    },
    slack: {
        label: 'Sign in with Slack',
        width: 'auto',
        logo: slack
    },
    spotify: {
        label: 'Sign in with Spotify',
        logo: spotify
    },
    twitch: {
        label: 'Sign in with Twitch',
        logo: twitch
    }
};

export function LoginButton({ provider, style, className }) {
    const { oauthLogin } = useAuth();
    const brand = providerBrands[provider];

    if (!brand) {
        return <button onClick={() => oauthLogin(provider)}>Sign in with {provider}</button>;
    }

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        ...style
    }

    const logoStyle = {
        height: '24px',
        width: brand.width ? brand.width : '24px',
        marginRight: '8px'
    }

    return (
        <button
            onClick={() => oauthLogin(provider)}
            className={className}
            style={buttonStyle}
        >
            <img src={brand.logo} style={logoStyle} alt={provider} />
            <span>{brand.label}</span>
        </button>
    );
}
