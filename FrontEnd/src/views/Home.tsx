import ArgumentForm from "../components/ArgumentForm";

function Home() {
  return (
    <>
    <div className="text-center mt-8">
      <div className="flex justify-end">
        {/* <button onClick={() => {
  document.documentElement.classList.toggle('dark');
}}>
  Toggle Theme
</button> */}
        {/* <button className="bg-red-primary px-4 mx-4 py-2 rounded-xl shadow text-neutral-light">
          <a href="/">Logout</a>
        </button> */}
      </div>
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