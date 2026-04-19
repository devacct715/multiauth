
// core router to handle authentication routes
import { Router } from 'express';
import { generateAuthURL, handleCallback } from './engine.js';
import { findUserByEmail, findOrCreateUser } from '../models/user.js';
import { authMiddleware, signAccessToken } from './jwt.js';


export function createRouter(strategies) {
    const router = Router(); 
    router.get('/me', authMiddleware(), async (req, res) => {
        try {
            const profile = await findUserByEmail(req.user.email);
            if (!profile) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ id: profile._id, email: profile.email, displayName: profile.displayName, avatarURL: profile.avatarURL || null });
        } catch (error) {
            res.status(401).json({ error: 'Failed to fetch user profile' });
        }
    });

    strategies.forEach(strategy => {
        // check strategy type
        // local
        if (strategy.type === 'local') {
            // local registration route
            router.post(`/${strategy.name}/register`, async (req, res) => {
                try {
                    const profile = await strategy.register(req.body);
                    const token = signAccessToken({id: profile.id, email: profile.email, displayName: profile.displayName});
                    res.json({ token });
                } catch (error) {                    
                    res.status(401).json({ error: error.message });
                }
            });

            // local login route
            router.post(`/${strategy.name}/login`, async (req, res) => {
                try {
                   const profile = await strategy.login(req.body);
                   const token = signAccessToken({id: profile.id, email: profile.email, displayName: profile.displayName});
                   res.json({ token });
                } catch (error) {
                    res.status(401).json({ error: error.message });
                }
            });
            // oauth
        } else if (strategy.type === 'oauth') {
            // auth route
            router.get(`/${strategy.name}`, (req, res) => {
                try {
                const authURL = generateAuthURL(strategy);
                res.redirect(authURL);
                } catch (error) {
                    res.status(401).json({ error: error.message });
                }
         });
            // callback route
            router.get(`/${strategy.name}/callback`, async (req, res) => {
                try {
                    const code = req.query.code;
                    const profile = await handleCallback(strategy, code);
                    const userDoc = await findOrCreateUser(profile);
                    const token = signAccessToken({id: userDoc._id, email: userDoc.email, displayName: userDoc.displayName});
                    res.redirect(`${process.env.REACT_APP_CALLBACK}?token=${token}`);
                } catch (error) {
                    res.status(401).json({ error: error.message });
                }
            });
        }
    });
    return router;
}