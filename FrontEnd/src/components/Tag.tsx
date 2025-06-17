import axios from "axios";
import { tokenManager } from "../utils/tokenManager";
import baseURL from "../constants/constant";
const Tag = ({tag, updateView}) => {
  


  return (
  <div
            key={tag.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-white text-sm font-medium ${tag.color} hover:scale-105 transition-transform`}
            onClick={() => { updateView(tag)}}
          >
            <span className="text-lg">{tag.icon}</span>
            <span>{tag.label}</span>
   </div>
  )
}

export default Tag;