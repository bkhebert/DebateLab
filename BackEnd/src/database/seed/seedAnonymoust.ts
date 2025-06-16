import { User } from "../models";

async function createAnonymousUser() {
  try {
    const [anon, created] = await User.findOrCreate({
      where: { id: 'anon' },
      defaults: {
        username: 'Anonymous',
        email: 'anon@system.local',
        password: 'anonymous', // Or hash it, up to you
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