import ArgumentForm from "../components/ArgumentForm";

function Home() {
 return (
  <div className=''>
    <div className="flex flex-col">

      
      <div className="text-center mt-3 md:mt-44 w-full">
        <div className="inline-block bg-cstmblack p-1 rounded-xl dark:border-solid dark:border-2 dark:border-primarylight/80 md:border-cstmwhite">
          <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-32 md:w-80 mx-auto" />
        </div>
      </div>
        <p className="mb-2 font-mono text-center text-lg italic font-bold">
          A.I. Reasonability Checker
        </p>
      
    </div>
        <ArgumentForm />
      <div className="flex justify-center mt-4 md:mt-12">
          {/* <a href='/About'>About</a> */}
      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-400/80 hover:bg-cstmgold text-cstmblack font-bold py-2 px-4 rounded"
      >
        Analyze
      </a>
      </div>
    </div>
  )
}

export default Home;