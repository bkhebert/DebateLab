
const RightSideBar = () => {
  return (
         <aside className="hidden lg:block lg:col-span-2 border-l border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto dark:text-covenantlight dark:bg-covenantDark">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-covenantLight mb-2">Trending Topics</h2>
        <ul className="text-xs text-gray-600 dark:text-covenantLight space-y-2">
          <li>#FreeSpeech</li>
          <li>#LogicalFallacies</li>
          <li>#Philosophy</li>
          <li>#Politics</li>
          <li>#Hard-coded</li>
        </ul>
      </aside>
  )
}

export default RightSideBar;