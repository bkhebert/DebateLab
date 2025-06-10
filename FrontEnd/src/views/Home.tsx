import ArgumentForm from "../components/ArgumentForm";

function Home() {
 return (
    <>
      <div className="flex justify-end p-4">
        <button 
          className="text-cstmwhite bg-cstmblack px-4 py-1" 
          onClick={() => {
            document.documentElement.classList.toggle('dark');
          }}
        >
         Mode
        </button>
      </div>
      
      <div className="text-center mt-8">
        <div className="inline-block bg-cstmblack p-4 rounded-xl">
          <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-64 mx-auto" />
        </div>
        <ArgumentForm />
        <p className="text-lg italic">
          Instant facts for every opinion
        </p>
      </div>
      
      <div className="w-full h-2 bg-gradient-to-r from-red-primary via-neutral-400 to-blue-primary mb-8" />

      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-400 hover:bg-cstmgold text-cstmblack font-bold py-2 px-4 rounded"
      >
        Donate via PayPal
      </a>
    </>
  )
}

export default Home;