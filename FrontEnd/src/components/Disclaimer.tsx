import { AlertTriangle } from "lucide-react"; // Optional icon for dramatic effect

const DisclaimerCard = () => {
  return (
    <div className="bg-neutral-950 border-2 border-red-700 rounded-md sm:p-2 md:p-6 md:mt-40 text-sm text-red-100 font-mono shadow-[0_0_30px_rgba(255,0,0,0.2)]">
      <div className="flex items-center mb-4">
        <AlertTriangle className="text-red-600 mr-2" />
        <h2 className="uppercase tracking-widest text-red-500 text-xs">
          Open Speech Protocol Notice
        </h2>
      </div>
      <p className="mb-2">
        Welcome to <span className="text-white font-semibold">[Your Site Name]</span>, a platform dedicated to open speech, rational debate, and philosophical inquiry.
      </p>
      <p className="mb-2">
        This site encourages the free exchange of ideas—even controversial, uncomfortable, or unpopular ones. Our AI tools are designed to surface logical fallacies and foster critical thought.
      </p>
      <p className="mb-2">
        <span className="text-red-400 font-bold">⚠︎ Views expressed by users do not represent those of [Your Site Name].</span>
      </p>
      <p className="mb-2">
        Content may be offensive, triggering, or objectionable. You are solely responsible for your participation.
      </p>
      <p className="mb-2">
        We do not censor opinions. However, we reserve the right to act against:</p>
        <ul className="list-disc list-inside ml-4 mt-1">
          <li>Calls for violence or harm</li>
          <li>Targeted harassment or doxxing</li>
          <li>Malicious platform misuse</li>
        </ul>
      
      <p className="mt-4 italic text-red-300">
        Use at your own discretion. Truth is not dictated—but discovered. Let arguments be strong, minds open, and fallacies exposed.
      </p>
    </div>
  );
};

export default DisclaimerCard;