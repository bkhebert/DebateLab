import ArgumentForm from "./ArgumentForm";


const AnalyzerCard = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="text-center mt-3 md:mt-44 w-full">
          <div className="inline-block bg-cstmblack p-1 rounded-xl dark:border-solid dark:border-2 dark:border-primarylight/80 md:border-cstmwhite">
            <img
              src="/debatelabwhite.png"
              alt="DebateLab Logo"
              className="w-32 md:w-80 mx-auto"
            />
          </div>
        </div>
        <p className="mb-2 font-mono text-center text-lg italic font-bold">
          A.I. Reasonability Checker
        </p>
      </div>
      <ArgumentForm />
    </div>
  );
};

export default AnalyzerCard