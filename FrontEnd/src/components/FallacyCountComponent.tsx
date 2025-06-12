import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft"
export default function FallacyCountComponent({fallacyCount}){

  return(<>

      <div className="flex flex-col items-center m-4 bg-cstmblack/10 rounded-xl p-2 border border-cstmblack/25">
      <FaBalanceScaleLeft className="w-full h-full mt-1 max-w-[6em] text-cstmblack dark:text-cstmwhite md:max-w-[6em] lg:max-w-[8em]" />
      <p className="font-mono text-md text-lg text-center text-cstmblack dark:text-cstmwhite">Fallacies </p>
      <div className="flex flex-col items-center">
        <p className="px-5 text-center border border-cstmblack/40 rounded-full text-cstmred font-bold bg-cstmwhite">{fallacyCount}</p>
      </div>
      </div>
  </>)
};