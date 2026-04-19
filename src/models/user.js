import mongoose from 'mongoose'; 

// schema + model
const userSchema = new mongoose.Schema({ email: { type: String, unique: true, sparse: true }, // allow multiple null emails
    passwordHash: String,
    displayName: String,
    avatarURL: String,
    providers: [{ provider: String, providerId: String }]}, // support multiple auth providers per user
    {timestamps: true});

const User = mongoose.model('User', userSchema);

// find user by email
export async function findUserByEmail(email) {
    const foundUser = await User.findOne({ email });
    return foundUser;
}

// create user
export async function createUser({ email, passwordHash, displayName, avatarURL, provider, providerId }) {
    const newUser = await User.create({ email, passwordHash, displayName, avatarURL, providers: [{ provider, providerId }] });
    return newUser;
}

// receives normalized profile and either finds existing user or creates new one (oauth)
export async function findOrCreateUser(profile) {
    let dbProfile = await findUserByEmail(profile.email);
    // if user exists, check if provider is already linked
    if (dbProfile) {
        const existingProvider = dbProfile.providers.find(p => p.provider === profile.provider);
        // add provider if not linked yet
        if (!existingProvider) {
            dbProfile.providers.push({ provider: profile.provider, providerId: profile.id });
            await dbProfile.save();
        }
    // if user doesn't exist, create new one
    } else {
        dbProfile = await createUser({ email: profile.email, passwordHash: null, displayName: profile.displayName, avatarURL: profile.avatarURL, provider: profile.provider, providerId: profile.id });
    }
    return dbProfile;
}

