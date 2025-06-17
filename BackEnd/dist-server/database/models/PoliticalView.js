import { DataTypes } from 'sequelize';
import database from '../db.js';
import User from './User.js';
const PoliticalView = database.define('PoliticalView', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'email',
        }
    },
    pro_life: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "pro_life", label: "Pro-Life", icon: "FaHeart", color: "bg-pink-600", isSelected: false }),
    },
    libertarian: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "libertarian", label: "Libertarian", icon: "GiLibertyWing", color: "bg-yellow-500", isSelected: false }),
    },
    pro_choice: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "pro_choice", label: "Pro-Choice", icon: "FaBalanceScale", color: "bg-red-500", isSelected: false }),
    },
    socialist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "socialist", label: "Socialist", icon: "GiHammerSickle", color: "bg-red-700", isSelected: false }),
    },
    anarchist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "anarchist", label: "Anarchist", icon: "FaGavel", color: "bg-black", isSelected: false }),
    },
    centrist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "centrist", label: "Centrist", icon: "FaBalanceScale", color: "bg-gray-500", isSelected: false }),
    },
    pacifist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "pacifist", label: "Pacifist", icon: "FaDove", color: "bg-blue-300", isSelected: false }),
    },
    feminist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "feminist", label: "Feminist", icon: "BsGenderFemale", color: "bg-pink-400", isSelected: false }),
    },
    mens_rights_advocate: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "mens_rights_advocate", label: "Men’s Rights Advocate", icon: "BsGenderMale", color: "bg-blue-400", isSelected: false }),
    },
    anti_capitalist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "anti_capitalist", label: "Anti-Capitalist", icon: "GiHammerSickle", color: "bg-green-900", isSelected: false }),
    },
    environmentalist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "environmentalist", label: "Environmentalist", icon: "FaLeaf", color: "bg-green-600", isSelected: false }),
    },
    climate_skeptic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "climate_skeptic", label: "Climate Skeptic", icon: "FaQuestion", color: "bg-yellow-300", isSelected: false }),
    },
    ai_doomer: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "ai_doomer", label: "AI Doomer", icon: "FaSkull", color: "bg-purple-700", isSelected: false }),
    },
    agnostic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "agnostic", label: "Agnostic", icon: "FaQuestion", color: "bg-gray-600", isSelected: false }),
    },
    atheist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "atheist", label: "Atheist", icon: "FaBiohazard", color: "bg-black text-white", isSelected: false }),
    },
    nihilist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "nihilist", label: "Nihilist", icon: "FaSkull", color: "bg-zinc-800", isSelected: false }),
    },
    traditionalist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "traditionalist", label: "Traditionalist", icon: "FaFire", color: "bg-orange-700", isSelected: false }),
    },
    absurdist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "absurdist", label: "Absurdist", icon: "FaSmile", color: "bg-lime-600", isSelected: false }),
    },
    free_speech_advocate: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "free_speech_advocate", label: "Free Speech Advocate", icon: "IoMdChatbubbles", color: "bg-indigo-600", isSelected: false }),
    }, cancel_culture_critic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "cancel_culture_critic", label: "Cancel Culture Critic", icon: "MdOutlineCancel", color: "bg-rose-600", isSelected: false }),
    },
    question_everything: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "question_everything", label: "Question Everything", icon: "FaQuestion", color: "bg-gray-700", isSelected: false }),
    },
    chaotic_neutral: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "chaotic_neutral", label: "Chaotic Neutral", icon: "FaDice", color: "bg-indigo-700", isSelected: false }),
    },
    progressive: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "progressive", label: "Progressive", icon: "GiThreeLeaves", color: "bg-emerald-500", isSelected: false }),
    },
    christian: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "christian", label: "Christian", icon: "FaCross", color: "bg-purple-900", isSelected: false }),
    },
    buddhist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "buddhist", label: "Buddhist", icon: "FaYinYang", color: "bg-yellow-400", isSelected: false }),
    },
    taoism: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "taoism", label: "Taoism", icon: "FaYinYang", color: "bg-teal-500", isSelected: false }),
    },
    judaic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "judaic", label: "Judaic", icon: "FaStarOfDavid", color: "bg-blue-800", isSelected: false }),
    },
    troll: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "troll", label: "Pro-Life", icon: null, color: "bg-pink-600", isSelected: false })
    },
    conservative: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "conservative", label: "Conservative", icon: "FaShieldAlt", color: "bg-red-900", isSelected: false }),
    },
    optimistic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "optimistic", label: "Optimistic", icon: "FaArrowAltCircleUp", color: "bg-blue-900", isSelected: false }),
    },
    sex_positive: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "sex_positive", label: "Sex-Positive", icon: "FaSmileWink", color: "bg-fuchsia-600", isSelected: false }),
    },
    jainism: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "jainism", label: "Jainism", icon: "FaHandPeace", color: "bg-pink-700", isSelected: false }),
    },
    islamic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "islamic", label: "Islamic", icon: "FaStarAndCrescent", color: "bg-green-800", isSelected: false }),
    },
    hinduism: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "hinduism", label: "Hinduism", icon: "FaFire", color: "bg-orange-600", isSelected: false }),
    },
    confucianism: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "confucianism", label: "Confucianism", icon: "FaYinYang", color: "bg-yellow-600", isSelected: false }),
    },
    sikhism: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "sikhism", label: "Sikhism", icon: "FaDharmachakra", color: "bg-red-600", isSelected: false }),
    },
    conspiracy_theorist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "conspiracy_theorist", label: "Conspiracy Theorist", icon: "FaUserSecret", color: "bg-slate-800", isSelected: false }),
    },
    jester: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "jester", label: "Jester", icon: "GiJesterHat", color: "bg-purple-600", isSelected: false }),
    },
    communist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "communist", label: "Communist", icon: "FaFistRaised", color: "bg-red-500", isSelected: false }),
    },
    shinto: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "shinto", label: "Shinto", icon: "FaTree", color: "bg-red-400", isSelected: false }),
    },
    rastafarian: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "rastafarian", label: "Rastafarian", icon: "FaCrown", color: 'bg-green-950', isSelected: false }),
    },
    psychedelics: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: JSON.stringify({ columnName: "psychedelics", label: "Psychedelics", icon: "FaSpinner", color: " bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-purple-500", isSelected: false }),
    },
}, {
    tableName: 'PoliticalView', // Explicitly specify table name
    timestamps: true, // Enables createdAt & updatedAt fields
});
export default PoliticalView;
