import ArgumentForm from "../components/ArgumentForm";

function Home() {
 return (
    <>

      
      <div className="text-center mt-8 md:max-w-2xl">
        <div className="inline-block bg-cstmblack p-4 rounded-xl">
          <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-64 md:w-80 mx-auto" />
        </div>
        <ArgumentForm />
        <p className="text-lg italic">
          Instant facts for every opinion
        </p>
      </div>
      
      <div className="w-full h-2 mb-8" />
          {/* <a href='/About'>About</a> */}
      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-400/80 hover:bg-cstmgold text-cstmblack font-bold py-2 px-4 rounded"
      >
        Donate via PayPal
      </a>
    </>
  )
}

export default Home;