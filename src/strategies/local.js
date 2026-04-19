// Local auth strategy implementation

import { findUserByEmail, createUser } from "../models/user.js";
import bcrypt from "bcryptjs";

export function LocalStrategy() {
    return {
        name: 'local',
        type: 'local',
        register,
        login
    }
}

export async function register({email, password, displayName}) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser({ email, passwordHash, displayName, provider: 'local', providerId: email });
    const profile = {
        id: newUser._id,
        provider: 'local',
        email: newUser.email,
        displayName: newUser.displayName,
        avatarURL: newUser.avatarURL || null
    }
    return profile;
}

export async function login({email, password}) {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
        throw new Error('User not found');
    }
    const localProvider = existingUser.providers.find(p => p.provider === 'local');
    if (!localProvider) {
        throw new Error('User does not have local authentication');
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordMatch) {
        throw new Error('Invalid password');
    }
    const profile = {
        id: existingUser._id,
        provider: 'local',
        email: existingUser.email,
        displayName: existingUser.displayName,
        avatarURL: existingUser.avatarURL || null 
    };
    return profile;
}