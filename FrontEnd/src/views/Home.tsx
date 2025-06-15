
import AnalyzerCard from "../components/AnalyzerCard";
function Home() {
 return (
  <div className=''>
    <AnalyzerCard />
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