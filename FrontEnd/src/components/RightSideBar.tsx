
const RightSideBar = () => {
  return (
         <aside className="hidden lg:block lg:col-span-2 border-l border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto dark:text-covenantlight dark:bg-covenantDark">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-indigo-500 mb-2">Upcoming Features</h2>
        <ul className="text-xs space-y-2 text-black  dark:text-indigo-500">
          <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">Unlimited Analysis</li>
           <li className="hover:text-black dark:hover:!text-primaryglow transition-colors ">Debate Games</li>
           <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">1 v 25 debates</li>
           <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">Notifications System</li>
           <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">Team Debates</li>
           <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">Chrome Extension</li>
           <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">Mobile App</li>
            <li className="hover:text-black dark:hover:!text-primaryglow transition-colors">Speech Recognition: </li>
                        <li className="hover:text-black dark:hover:!text-primaryglow transition-colors italic">*Real-Time Debate Analysis for Speech</li>
          <li className="hover:text-black dark:hover:!text-primaryglow transition-colors italic">* 5 Checks per 24 hours</li>
        </ul>
      </aside>
  )
}

export default RightSideBar;