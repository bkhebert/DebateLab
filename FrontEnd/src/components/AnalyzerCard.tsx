import ArgumentForm from "./ArgumentForm";

type AnalyzerCardProps = {
  closeModal: () => void;
};

const AnalyzerCard = ({closeModal}: AnalyzerCardProps) => {


  return (
    <div className="rounded-md bg-cstmdarkaccent mx-4 my-4">

      <div className="grid grid-cols-3">
        <div className="col-start-2 text-center mt-3 md:mt-44 w-full">
          <div className="inline-block bg-cstmblack p-1 rounded-xl dark:border-solid dark:border-2 dark:border-primarylight/80 md:border-cstmwhite">
            <img
              src="/debatelabwhite.png"
              alt="DebateLab Logo"
              className="w-32 md:w-80 mx-auto"
            />
          </div>
        </div>
      <div className="mx-auto mr-1 ">
        <button 
        className="rounded rounded-full bg-cstmblack/80 m-1 text-sm"
        onClick={closeModal}
        >X</button>
      </div>
      </div>
        <p className="mb-1 font-mono text-center text-lg italic font-bold">
          A.I. Reasonability Checker
        </p>
      <ArgumentForm />
    </div>
  );
};

export default AnalyzerCard