
const RightSideBar = () => {
  return (
         <aside className="hidden lg:block lg:col-span-2 border-l border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Trending Topics</h2>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>#FreeSpeech</li>
          <li>#LogicalFallacies</li>
          <li>#Philosophy</li>
          <li>#Politics</li>
        </ul>
      </aside>
  )
}

export default RightSideBar;