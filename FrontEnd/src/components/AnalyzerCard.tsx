import ArgumentForm from "./ArgumentForm";

type AnalyzerCardProps = {
  closeModal: () => void | null;
  topic?: string,
  showLogo?: boolean,
  isDemo?: boolean,
  showExit?: boolean,
};

const AnalyzerCard = ({closeModal, topic, showLogo, isDemo, showExit}: AnalyzerCardProps) => {

  return (
    <div className={`rounded-md lg:rounded-sm bg-primarylight/70  mx-4 my-4 lg:mt-36 `}>

      <div className="grid grid-cols-3 lg:mt-5">
          {isDemo && <p className="hidden lg:block col-span-3 mt-1 text-center text-3xl mt-3 mt-7 mb-4">
         Try it Now
        </p>}
        <p className="hidden lg:block col-span-3 text-center italic text-xs">A.I. Reasonability Checker</p>
        <div className={`col-start-2 ${showLogo ? ' ': 'lg:hidden'} text-center mt-3 lg:mt-5 w-full`}>
          <div className="inline-block  bg-cstmblack p-1 rounded-xl dark:border-solid dark:border-2 dark:border-primarylight/80 md:border-cstmwhite">
            <img
              src="/debatelabwhite.png"
              alt="DebateLab Logo"
              className="w-32 md:w-80 mx-auto"
            />
          </div>
        </div>
      <div className="mx-auto mr-1 ">
        {!isDemo && showExit && <button 
        className="rounded bg-red-400/80 dark:bg-cstmblack/80 m-1 text-sm p-3"
        onClick={closeModal}
        >X</button>}
      </div>
      </div>
        <p className="lg:hidden mb-1 font-mono text-center text-lg italic font-bold">
          A.I. Reasonability Checker
        </p>
         
      <ArgumentForm topic={topic} isDemo={isDemo} closeModal={closeModal}/>
    </div>
  );
};

export default AnalyzerCard