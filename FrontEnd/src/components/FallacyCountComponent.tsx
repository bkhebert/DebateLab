import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft"
export default function FallacyCountComponent({fallacyCount}){

  return(<>

      <div className="flex flex-col items-center m-4">
      <FaBalanceScaleLeft className="w-full h-full mt-1 max-w-[6em] text-white md:max-w-[6em] lg:max-w-[8em]" />
      <p className="font-mono text-md text-lg text-center text-cstmwhite">Fallacies #{fallacyCount}</p>
      </div>
  </>)
};