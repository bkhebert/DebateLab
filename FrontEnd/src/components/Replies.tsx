import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';


function Replies({ reply, getFlairColor }) {
  const [newReply, setNewReply] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flairs, setFlairs] = useState([]);
  useEffect(() => {
    getReplyInfo();
  }, []);
  const getReplyInfo = () => {
    let userEmail = reply.user.email
    axios.get('/api/politicalPhilosophy/flairs', {
      params: {
        email: userEmail,
      }
    })
    .then((usersPoliticalViews) => {
      // Handle successful usersPoliticalViews
      console.log(usersPoliticalViews.data, ' their flairs ');
      const allFlairs = [];
      for(let key in usersPoliticalViews.data[0]){
        console.log(usersPoliticalViews.data[0])
        if(usersPoliticalViews.data[0][key] && key !== 'createdAt' && key !== 'updatedAt' && key !== 'email' && key !== 'id' ){
          console.log(usersPoliticalViews.data[0][key], 'parsing this');
          console.log(key, 'the key');

          const parsed = JSON.parse(usersPoliticalViews.data[0][key]);
        console.log(parsed, 'the parsed object');
            allFlairs.push({ 
              topic: parsed.columnName, 
              answer: parsed.label,
              color: parsed.color
          });
          
        // } else {
        //   allTopics.push({ 
        //     topic: key, 
        //     answer: 'undecided',
        //     rating: 0,
        // });
        }
        console.log(key, 'key for each topic');
      }
     
      setFlairs(allFlairs);
    })
    .catch((error) => {
      // Handle error
      console.error(error);
    });
   
  }
   return (<><div>
<p key={reply.id} className="text-sm text-gray-700">↳ {reply.content}</p>
<p className="text-sm font-semibold text-gray-700">{reply.user.displayName}</p>
<div>
      {flairs.map((flair) => (
        <span className={`px-2 py-1 text-[8px] font-semibold text-white rounded-full whitespace-nowrap ${flair.color}`}>{flair}</span>
      ))}
      </div>
</div></>)
};

export default Replies;