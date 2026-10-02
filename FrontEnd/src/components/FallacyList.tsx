import fallacies from "../assets/fallacies.json" with { type: 'json' }; 

export default function FallacyList({arrayOfFallacies, isDemo}){

  return<>
      <div className="col-span-2">
      <h3 className={`text-lg font-bold mb-4 mt-2 text-center font-mono md:text-xl ${isDemo ? 'lg:text-sm ' : ''}`}>Logical Fallacies</h3>
      <ul>
        { arrayOfFallacies.map((listItem) => (
          fallacies[listItem.toLowerCase()] ?
          (
          <li>
            <ul className="p-2 mx-2">
            <li className={`text-center text-lg text-cstmred font-mono font-bold md:text-2xl ${isDemo ? 'lg:text-sm ' : ''}`}>{listItem}</li>
            <li className={`text-s md:text-center md:text-xl ${isDemo ? 'lg:text-sm ' : ''}`}>{fallacies[listItem.toLowerCase()].definition}</li>
            <li className={`text-xs italic mt-1 text-center md:text-lg ${isDemo ? 'lg:text-sm ' : ''}`}>Example: {fallacies[listItem.toLowerCase()].example}</li>
            </ul>
            </li>
          ) : (
            <li>
               <ul className="p-2 mx-2">
              <li className={`text-center text-cstmred font-bold text-lg md:text-2xl ${isDemo ? 'lg:text-sm ' : ''}`}>{listItem}</li>
              <li className={`text-xs mt-1 md:text-center md:text-xl ${isDemo ? 'lg:text-sm ' : ''}`}>The Details On This Fallacy has not been stored in our repo yet</li>
            </ul>
            </li>
          )
        ))}
      </ul>
    </div>
  </>
}