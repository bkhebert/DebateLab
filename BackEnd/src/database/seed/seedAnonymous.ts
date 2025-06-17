import { User } from "../models/index.js";

async function createAnonymousUser() {
  console.log('creating anon...')
  try {
    const [anon, created] = await User.findOrCreate({
      where: { id: 42069 },
      defaults: {
        username: 'Anonymous',
        email: 'anon@system.local',
        password: 'anonymous', // Or hash it, up to you
        email_verified:  false,
        tokenVersion: 69,
      },
    });

    if (created) {
      console.log('✅ Anonymous user created.');
    } else {
      console.log('ℹ️ Anonymous user already exists.');
    }
  } catch (error) {
    console.error('❌ Failed to create anon user:', error);
  }
}

createAnonymousUser();

