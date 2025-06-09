import { Topic } from "../models/index.js";

const topicNames = [
  'Abortion',
  'Tariffs',
  'Gun Control',
  'The Border',
  'DOGE',
  'Middle East',
];

const seedTopics = async () => {
  const topicObjects = [];
  for (let name of topicNames) {
    topicObjects.push({ name });
  }
  try {
    await Topic.sync({ force: true }); // Clear table of topic data
    await Topic.bulkCreate(topicObjects);
    console.log(`${topicNames.length} topics seeded.`)
  } catch (error) {
    console.error('Failed to seed topics:', error);
  }
};

seedTopics();
