
function Home() {
  return (
    <>
    <div className="text-center mt-8">
      <div className="flex justify-end">
        <button className="bg-red-primary px-4 mx-4 py-2 rounded-xl shadow text-neutral-light">
          <a href="/">Logout</a>
        </button>
      </div>
      <div className="inline-block bg-cstmblack p-4 rounded-xl">
        <img src="/debatelabwhite.png" alt="DebateLab Logo" className="w-64 mx-auto" />
        </div>
        <p className="text-gray-secondary text-lg italic">
          Instant facts for every opinion
        </p>
      </div>
      <div className="w-full h-2 bg-gradient-to-r from-red-primary via-neutral-400 to-blue-primary mb-8" />
    </>
  )
}

export default Home;