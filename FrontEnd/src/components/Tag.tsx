import axios from "axios";
import { tokenManager } from "../utils/tokenManager";
import baseURL from "../constants/constant";
const Tag = ({tag, updateView, icon}) => {
  


  return (
    <div>

    { typeof tag.color === "string" && <div
            key={tag.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-white text-sm font-medium  ${tag.color}  hover:scale-105 transition-transform`}
            onClick={() => { updateView(tag)}}
          >
            <span className="text-lg">{icon}</span>
            <span>{tag.label}</span>
   </div>}
   </div>
  )
}

export default Tag;