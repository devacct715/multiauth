import { createContext, useContext, useState, useEffect } from 'react';

// user context to manage authentication state and actions
const AuthContext = createContext(null);


export function AuthProvider({ children, apiBase }) {
    const [user, setUser] = useState(null);

    // oauth callback handling on app load
    useEffect(() => {
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token');
          if (token) {
            window.history.replaceState({}, '', window.location.pathname); // clean URL
            fetch(`${apiBase}/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => response.json())
            .then(profile => setUser({ token, profile }))
            .catch(error => console.error('Failed to fetch profile:', error));
          }
        }, []);

    // local register function 
    async function register(email, password, displayName) {
        const response = await fetch(`${apiBase}/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, displayName })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }
        const data = await response.json();
        const authenticatedUser = await fetch(`${apiBase}/me`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const profile = await authenticatedUser.json();
        setUser({ token: data.token, profile });
    }

    // local login function
    async function login(email, password) {
        const response = await fetch(`${apiBase}/local/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }
        const data = await response.json();
        const authenticatedUser = await fetch(`${apiBase}/me`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const profile = await authenticatedUser.json();
        setUser({ token: data.token, profile });
}
    // oauth login function
    async function oauthLogin(provider) {
        window.location.href = `${apiBase}/${provider}`;
    }

    // logout function
    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, register, login, oauthLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// hook to access authentication context
export function useAuth() {
    return useContext(AuthContext);
}
