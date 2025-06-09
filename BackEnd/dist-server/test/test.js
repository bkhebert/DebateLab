import database from "../database/db.js";
import User from "../database/models/User.js";
import UserPhilosophy from "../database/models/UserPhilosophy.js";
const testUserPhilosophy = async () => {
    try {
        await database.authenticate();
        console.log('✅ Connected to database.');
        await database.sync({ alter: true }); // sync models (optional but helpful)
        // Create a user
        const newUser = await User.create({
            username: 'debate_hero', // replace with your actual user schema fields
            email: 'debate@example.com',
            password: 'secure123', // ideally hashed in real use
            tokenVersion: 0,
            email_verified: false
        });
        console.log('👤 New user created:', newUser.toJSON());
        // Add a UserPhilosophy entry
        const newPhilosophy = await UserPhilosophy.create({
            userId: newUser.id,
            category: 'Philosophy',
            school: 'Rationalism',
            description: 'Believes reason is the primary source of knowledge.',
            keyThinkers: ['Descartes', 'Leibniz'],
        });
        console.log('📚 New user philosophy added:', newPhilosophy.toJSON());
        // Fetch with association (optional)
        const userWithPhilosophies = await User.findByPk(newUser.id, {
            include: [UserPhilosophy],
        });
        console.dir(userWithPhilosophies?.toJSON(), { depth: null });
        console.log('✅ Test completed!');
    }
    catch (error) {
        console.error('❌ Error during test:', error);
    }
    finally {
        await database.close();
    }
};
testUserPhilosophy();
