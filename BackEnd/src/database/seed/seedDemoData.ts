// Seeds the local dev database with fake users, profiles, posts, and replies
// so the site can be browsed as if it already had an active community.
//
// Run with: npm run seed:demo        (from BackEnd/)
// Undo with: npm run seed:demo:clean
//
// Every seeded user's email starts with "demo_" so the cleanup script can
// find (and only delete) rows this script created - it never touches real
// accounts. Re-running the seed script is safe: users are looked up by email
// first, so you just get more posts/replies layered on top of the same
// demo users rather than duplicate accounts.
import bcrypt from "bcrypt";
import { database, User, PoliticalView, Message, Reply } from "../models/index.js";

const DEMO_PASSWORD = "password123";

const SCHOOLS = [
  "The Rationalists",
  "The Empiricists",
  "The Humanists",
  "The Existentialists",
  "The Mystics",
  "The Skeptics",
  "The Tricksters",
  "The Undecided",
];

const DEMO_USERNAMES = [
  "quantum_queen", "skeptical_sam", "stoic_steve", "nihilist_nancy",
  "logic_larry", "empathic_emma", "absurdist_alex", "pragmatic_priya",
  "cynical_cindy", "idealist_ivan", "rational_rita", "mystic_marcus",
  "dialectic_dana", "contrarian_cole", "humanist_hana", "existential_eli",
  "trickster_tara", "undecided_uma",
];

// One realistic one-liner per sub-topic, grouped by subject, mirroring the
// subject/sub-topic list in FrontEnd/src/constants/debateTopics.tsx. Kept as
// a plain duplicated list here rather than a shared import - this repo has
// no shared package between FrontEnd/BackEnd (see root CLAUDE.md).
const TOPIC_ARGUMENTS: Record<string, string[]> = {
  "Physics & Cosmology": ["The fine-tuning of physical constants is best explained by a multiverse, not design."],
  "Artificial Intelligence": ["An AI system that can't explain its reasoning shouldn't be trusted with high-stakes decisions."],
  "Biotechnology & Ethics": ["Germline gene editing should be permitted once it's proven safe - banning it just pushes it underground."],
  "Climate Science": ["Carbon pricing is the single most effective lever we have, and we're not using it aggressively enough."],
  "Futurism & Transhumanism": ["Uploading a mind to a computer would not be 'you' continuing - it would be a copy that believes it's you."],
  "Skepticism & Pseudoscience": ["Extraordinary claims require extraordinary evidence, and most alternative medicine never clears that bar."],
  "Comparative Religion": ["Most world religions converge on the same core ethical claims, which suggests shared human psychology over revelation."],
  "Atheism & Secularism": ["You can build a complete, coherent moral framework without appeal to any god."],
  "Theology & Doctrine": ["The problem of evil remains the strongest argument against an omnibenevolent, omnipotent god."],
  "Mysticism & Esotericism": ["Mystical experiences are remarkably consistent across unconnected cultures, which is itself worth explaining."],
  "Religious Ethics": ["Divine command theory makes morality arbitrary - if God commanded cruelty, would cruelty become good?"],
  "New Age & Alternative Beliefs": ["Astrology persists not because it predicts anything, but because cold reading feels like insight."],
  "Ontology": ["Abstract objects like numbers exist independently of minds that think about them."],
  "Epistemology": ["We can never achieve certainty, only degrees of justified belief - and that's fine for practical purposes."],
  "Ethics & Morality": ["Moral realism survives the argument from disagreement just fine - people disagree about facts too."],
  "Metaphysics": ["Free will is compatible with determinism once you define 'free' as 'uncoerced', not 'uncaused'."],
  "Political Philosophy": ["Rawls' veil of ignorance is the best heuristic we have for designing fair institutions."],
  "Philosophy of Mind": ["Consciousness cannot be fully explained by physical processes alone - the hard problem is real."],
  "Cognitive Psychology": ["Most of what we call 'reasoning' is post-hoc justification for decisions made by intuition."],
  "Behavioral Psychology": ["Punishment is a worse behavior-change tool than reinforcement in almost every practical setting."],
  "Neuropsychology": ["Free will as commonly understood doesn't survive what we know about pre-conscious neural activity."],
  "Social Psychology": ["The bystander effect says more about diffusion of responsibility than about individual character."],
  "Psychoanalysis": ["Freud's falsifiable claims mostly failed replication, but his framing of the unconscious still shaped the field usefully."],
  "Evolutionary Psychology": ["Many modern anxieties are evolutionary mismatches - adaptive in ancestral environments, maladaptive now."],
  "Electoral Politics": ["Ranked-choice voting reduces polarization by removing the spoiler-vote incentive."],
  "Constitutional Issues": ["Originalism is a coherent interpretive method, not just a vehicle for preferred outcomes."],
  "Economic Policy": ["A universal basic income is more efficient than our current patchwork of means-tested welfare programs."],
  "Social Policy (Race, Gender, etc.)": ["Equality of opportunity and equality of outcome are both worth tracking, for different reasons."],
  "Foreign Policy (US-centric)": ["Military aid without diplomatic strategy just prolongs conflicts instead of resolving them."],
  "Political Theory (US context)": ["Checks and balances slow bad policy down, but they slow good policy down too - that's the tradeoff."],
  "International Relations": ["Economic interdependence reduces the likelihood of war between major trading partners."],
  "Geopolitics": ["Control of semiconductor supply chains is the defining geopolitical lever of this decade."],
  "Comparative Government": ["Parliamentary systems resolve legislative gridlock faster than presidential systems, at the cost of stability."],
  "Global Economic Systems": ["Developing economies need protectionist policy space that current trade rules don't really allow."],
  "Human Rights & NGOs": ["NGOs can do real good while also creating dependency that undermines local institution-building."],
  "War & Conflict Studies": ["Drone warfare lowers the political cost of starting conflicts, which should worry us regardless of its battlefield merits."],
};

const GENERAL_ARGUMENTS = [
  "If you can't explain your position to someone who disagrees with you, you probably don't understand it yourself.",
  "Most online arguments aren't actually about the stated topic - they're status contests wearing the topic as a costume.",
  "Changing your mind in public should be treated as a skill to admire, not a weakness to exploit.",
  "The strongest version of an opposing argument is usually more interesting than the weakest version of your own.",
  "Certainty is often just unexamined confidence wearing a nicer outfit.",
  "A good question is worth more than a clever answer.",
];

const FALLACY_POOL = [
  ["Strawman"],
  ["Ad Hominem"],
  ["Slippery Slope"],
  ["False Dichotomy"],
  ["Appeal to Authority"],
  [],
  [],
  [],
];

const REPLY_TEXTS = [
  "I don't think that follows - can you unpack the middle step?",
  "This is a fair point, but it proves too much if you apply it consistently.",
  "Strong agree. I'd add that the empirical evidence backs this up too.",
  "Counterpoint: the exception cases here are doing a lot of work against this claim.",
  "I used to think this too, but changed my mind after looking at the base rates.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = [];

  for (const username of DEMO_USERNAMES) {
    const email = `demo_${username}@example.com`;
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: {
        username,
        email,
        password: hashedPassword,
        email_verified: true,
        tokenVersion: 0,
        school: pick(SCHOOLS),
      },
    });
    users.push(user);
  }

  console.log(`Users ready: ${users.length}`);
  return users;
}

async function seedPoliticalViews(users: any[]) {
  const attributes = Object.keys(PoliticalView.getAttributes()).filter(
    (key) => !["id", "email", "createdAt", "updatedAt"].includes(key)
  );

  for (const user of users) {
    const [view] = await PoliticalView.findOrCreate({ where: { email: user.email } });
    const tagCount = 3 + Math.floor(Math.random() * 4); // 3-6 tags per user
    const chosenColumns = pickMany(attributes, tagCount);

    const updates: Record<string, string> = {};
    for (const column of chosenColumns) {
      const rawDefault = (PoliticalView.getAttributes() as any)[column].defaultValue;
      const parsed = JSON.parse(rawDefault);
      parsed.isSelected = true;
      updates[column] = JSON.stringify(parsed);
    }
    await view.update(updates);
  }

  console.log(`Political views seeded for ${users.length} users.`);
}

async function seedPostsAndReplies(users: any[]) {
  const createdMessages: any[] = [];

  for (const [subTopic, prompts] of Object.entries(TOPIC_ARGUMENTS)) {
    for (const argument of prompts) {
      const author = pick(users);
      const message = await Message.create({
        content: { argument, fallacies: pick(FALLACY_POOL) },
        topic: subTopic,
        userId: author.id,
      });
      createdMessages.push(message);
    }
  }

  for (const argument of GENERAL_ARGUMENTS) {
    const author = pick(users);
    const message = await Message.create({
      content: { argument, fallacies: pick(FALLACY_POOL) },
      topic: "The Great Conversation",
      userId: author.id,
    });
    createdMessages.push(message);
  }

  console.log(`Posts created: ${createdMessages.length}`);

  // Thread replies (some nested) onto a subset of the posts.
  const postsToReplyTo = pickMany(createdMessages, Math.min(15, createdMessages.length));
  let replyCount = 0;

  for (const message of postsToReplyTo) {
    const topLevelCount = 1 + Math.floor(Math.random() * 2); // 1-2 top-level replies
    for (let i = 0; i < topLevelCount; i++) {
      const replyAuthor = pick(users);
      const reply = await Reply.create({
        content: pick(REPLY_TEXTS),
        messageId: message.id,
        userId: replyAuthor.id,
        parentReplyId: null,
      });
      replyCount++;

      if (Math.random() < 0.5) {
        const childAuthor = pick(users);
        await Reply.create({
          content: pick(REPLY_TEXTS),
          messageId: message.id,
          userId: childAuthor.id,
          parentReplyId: reply.id,
        });
        replyCount++;
      }
    }
  }

  console.log(`Replies created: ${replyCount}`);
}

async function main() {
  try {
    await database.sync();
    const users = await seedUsers();
    await seedPoliticalViews(users);
    await seedPostsAndReplies(users);
    console.log("✅ Demo data seeded. Log in as any demo_<username>@example.com user with password:", DEMO_PASSWORD);
  } catch (error) {
    console.error("❌ Failed to seed demo data:", error);
  } finally {
    await database.close();
  }
}

main();
