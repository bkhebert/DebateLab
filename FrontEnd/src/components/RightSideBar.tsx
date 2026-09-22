
const RightSideBar = () => {
  return (
         <aside className="hidden lg:block lg:col-span-2 border-l border-border p-4 bg-background h-screen overflow-y-auto text-foreground">
        <h2 className="text-sm font-semibold text-foreground mb-2">Upcoming Features</h2>
        <ul className="text-xs space-y-2 text-muted-foreground">
          <li className="hover:text-primary transition-colors">Unlimited Analysis</li>
                            <li className="hover:text-primary transition-colors">Educational Tools</li>
            <li className="hover:text-primary transition-colors">Speech Recognition: </li>
                        <li className="hover:text-primary transition-colors italic">*Real-Time Debate Analysis for Speech</li>
           <li className="hover:text-primary transition-colors ">Debate Games</li>
           <li className="hover:text-primary transition-colors">1 v 25 debates</li>
           <li className="hover:text-primary transition-colors">Notifications System</li>
           <li className="hover:text-primary transition-colors">Team Debates</li>
           <li className="hover:text-primary transition-colors">Chrome Extension</li>
           <li className="hover:text-primary transition-colors">Mobile App</li>
          <li className="hover:text-primary transition-colors italic">* 5 Checks per 24 hours</li>
        </ul>
      </aside>
  )
}

export default RightSideBar;