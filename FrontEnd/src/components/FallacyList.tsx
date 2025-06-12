export default function FallacyList({arrayOfFallacies}){
  return<>
      <div className="col-span-2">
      <h1 className="text-xl font-bold mb-4 text-center font-mono">Logical Fallacies</h1>
      <ul>
        { arrayOfFallacies.map((listItem) => (
          <li className="mb-4 text-center">{listItem}</li>
        ))}
      </ul>
    </div>
  </>
}