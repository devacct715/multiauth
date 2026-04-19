import { useAuth } from './AuthProvider';

const providerBrands = {
    auth0: {
        label: 'Sign in with Auth0',
        bgColor: 'black',
        textColor: 'white',
        borderColor: 'black',
    }, 
    bitbucket: {
        label: 'Sign in with BitBucket',
        bgColor: '#82B536',
        textColor: 'black',
        borderColor: '#82B536',
    },
    discord: {
        label: 'Sign in with Discord',
        bgColor: '#5865F2',
        textColor: 'white',
        borderColor: '#5865F2',
    },
    facebook: {
        label: 'Sign in with Facebook',
        bgColor: '#1877F2',
        textColor: 'white',
        borderColor: '#1877F2',
    },
    github: {
        label: 'Sign in with GitHub',
        bgColor: '#0FBF3E',
        textColor: 'white',
        borderColor: '#0FBF3E',
    },
    gitlab: {
        label: 'Sign in with GitLab',
        bgColor: '#FC6D26',
        textColor: 'white',
        borderColor: '#FC6D26',
    },
    google: {
        label: 'Sign in with Google',
        bgColor: 'white',
        textColor: 'black',
        borderColor: 'black',
    },
    notion: {
        label: 'Sign in with Notion',
        bgColor: 'black',
        textColor: 'white',
        borderColor: 'black',
    },
    slack: {
        label: 'Sign in with Slack',
        bgColor: 'purple',
        textColor: 'white',
        borderColor: 'purple',
    },
    spotify: {
        label: 'Sign in with Spotify',
        bgColor: '#1ED760',
        textColor: 'white',
        borderColor: '#1ED760',
    },
    twitch: {
        label: 'Sign in with Twitch',
        bgColor: '#9146FF',
        textColor: 'white',
        borderColor: '#9146FF',
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
        justifyContent: 'center',
        gap: '12px',
        padding: '10px 24px',
        fontSize: '14px',
        fontWeight: '500',
        color: brand.textColor,
        backgroundColor: brand.bgColor,
        border: `1px solid ${brand.borderColor}`,
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '320px',
        height: '44px',
        ...style
    };

    return (
        <button
            onClick={() => oauthLogin(provider)}
            className={className}
            style={buttonStyle}
        >
            <span>{brand.label}</span>
        </button>
    );
}
