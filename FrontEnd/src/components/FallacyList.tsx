import fallacies from "../assets/fallacies.json" with { type: 'json' }; 

export default function FallacyList({arrayOfFallacies}){
  console.log(arrayOfFallacies)
  return<>
      <div className="col-span-2">
      <h1 className="text-2xl font-bold mb-4 text-center font-mono">Logical Fallacies</h1>
      <ul>
        { arrayOfFallacies.map((listItem) => (
          fallacies[listItem.toLowerCase()] ?
          (
          <li>
            <ul className="p-4">
            <li className="text-center text-cstmred font-mono font-bold">{listItem}</li>
            <li className="text-xs">{fallacies[listItem.toLowerCase()].definition}</li>
            <li className="text-xs italic">Example: {fallacies[listItem.toLowerCase()].example}</li>
            </ul>
            </li>
          ) : (
            <li>
               <ul className="p-4">
              <li className="text-center text-cstmred font-bold">{listItem}</li>
              <li className="text-xs ">The Details On This Fallacy has not been stored in our repo yet</li>
            </ul>
            </li>
          )
        ))}
      </ul>
    </div>
  </>
}