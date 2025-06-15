import { Separator } from "./ui/Separator";
import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft";

const Post = ({userName}) => {
  return (
        <div className="mx-3 p-2 mb-2 rounded-md border border-black p-3">
        <div className="">
          <div className="grid grid-cols-8 grid-rows-2 bg-cstmwhite">
            <div className="col-span-1 row-span-2 flex justify-center">
            <img
    src="/public/anonprofile.png"
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover mx-auto"
  /></div>
  <div className="col-span-7 font-bold ml-2">
    <div>{userName}</div>
  </div>
  <div className="col-span-7 italic ml-2 text-sm">Date</div>
  
  <div className="col-span-8 text-xs grid grid-cols-4 bg-yellow-500">
    <div className="bg-green-100  px-2 py-0.5 mx-0.5 rounded-md">Tags</div>
    </div>
  </div>
        <Separator className="bg-black/50  mt-1"/>
        <div className="grid grid-cols-4 auto-rows-auto text-xs mt-2">
        <div className="col-span-1 flex py-auto bg-white">
          <div className="bg-red-300 my-auto">Fallacies: 7</div>
        <FaBalanceScaleLeft className="mx-auto ml-1 my-auto bg-red-400"/>
        </div>

        <div className="my-auto mx-auto">Fallacy 1</div>
        <div className="my-auto mx-auto">Fallacy 2</div>
        </div>
        <Separator className="bg-black/50  mt-1"/>
        <div className="mx-3 overflow-x-visible">
          The Users Argument</div>
        </div>
        <Separator className="bg-black/50 mt-1"/>
        <div className="flex justify-center pt-2">
          <button className="p-2 py-1 bg-primarylight/80 text-black">DEBATE</button>
        </div>
        </div>
  )
}
export default Post;