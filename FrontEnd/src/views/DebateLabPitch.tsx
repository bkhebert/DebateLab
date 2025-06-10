
const DebateLabPitch = () => {
  const schoolsOfThought = [
    {
      name: 'Rationalists',
      color: 'bg-blue-600',
      coreBelief: 'Truth through logic and deduction'
    },
    {
      name: 'Empiricists',
      color: 'bg-emerald-600',
      coreBelief: 'Truth rooted in observation and data'
    },
    {
      name: 'Existentialists',
      color: 'bg-purple-600',
      coreBelief: 'Personal truth through choice and freedom'
    },
    {
      name: 'Metaphysicians',
      color: 'bg-amber-600',
      coreBelief: 'Truth beyond physical reality'
    }
  ];

  const futureFeatures = [
    "1v1 Debate Matchmaking",
    "Ideology Mapping ('I'll Die On This Hill' game)",
    "Premium Debate Hall (SaaS via Stripe)",
    "Real-time Fallacy Detection",
    "The Great Conversation (Open Forum)"
  ];

  return (
    <div className="flex flex-grow bg-red z-40">
    <div className="min-h-screen bg-gradient-to-br from-cstmdarkaccent/80 to-primarydark/80 text-cstmwhite p-6 rounded-xl">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 text-center">
       <img src="/debatelabfull.png" alt="DebateLab Logo" className="w-96 mx-auto bg-cstmneutral/70 rounded-md" />
        <p className="text-xl md:text-2xl mb-12 italic text-gray-300">
          "The antidote to the age of disinformation"
        </p>
        
        <div className="bg-black bg-opacity-50 rounded-xl p-8 backdrop-blur-sm border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-red-400">Current Product</h2>
          <p className="mb-8 text-lg leading-relaxed">
            DebateLab is an AI-powered <span className="font-bold text-yellow-300">reasonability engine</span> that analyzes arguments for logical fallacies, cognitive biases, and rhetorical flaws. Every posted argument receives an instant <span className="font-bold text-blue-300">fallacy audit</span>, helping users refine their thinking and engage in more productive discourse.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-emerald-400">Core Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Real-time <strong>fallacy detection</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Argument <strong>scoring system</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Philosophical <strong>schools of thought</strong></span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">Roadmap</h3>
              <ul className="space-y-3">
                {futureFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-400 mr-2">→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Schools of Thought */}
      <section className="max-w-6xl mx-auto py-12">
        <h2 className="text-4xl font-bold mb-12 text-center text-yellow-300">Schools of Thought</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schoolsOfThought.map((school) => (
            <div 
              key={school.name} 
              className={`${school.color} p-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <h3 className="text-2xl font-bold mb-3">{school.name}</h3>
              <p className="italic">{school.coreBelief}</p>
              <div className="mt-4 h-1 bg-white bg-opacity-30 rounded-full"></div>
              <button className="mt-4 px-4 py-2 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50 transition">
                Join {school.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Investment CTA */}
      <section className="max-w-4xl mx-auto py-20 text-center">
        <div className="bg-gradient-to-r from-red-900 to-blue-900 p-1 rounded-xl">
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Join the Intellectual Revolution</h2>
            <p className="mb-8 text-lg">
              We're seeking partners who believe in rebuilding <span className="text-yellow-300">reason-based discourse</span>. Whether through investment, donations, or joining our beta program, help us combat the crisis of mass disinformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg font-bold hover:opacity-90 transition">
                Invest in DebateLab
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:opacity-90 transition">
                Join Beta Program
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default DebateLabPitch;