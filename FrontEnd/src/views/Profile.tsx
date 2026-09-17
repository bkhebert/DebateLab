import ProfileBeliefs from "../components/ProfileBeliefs";
import TagSelector from "../components/TagSelector";
import { useEffect, useState } from "react";
import SchoolOfThoughts from "../components/SchoolOfThoughts";
import useAuth from "../contexts/useAuth";
import { tokenManager } from "../utils/tokenManager";
const infoNeeded = {
  img: '/anonprofile.png',
  tags: ['pro-life', 'environmentalist'],
  beliefs: [{
    category: 'Philosophy',
    subCategory: 'Ontology',
    description: 'there is no god',
  }],

};

import UserProfileModal from "../components/ViewProfile";
import axios from "axios";
import baseURL from "../constants/constant";
import { Button } from "../components/ui/Button";
const Profile = () => {
  const [showBeliefs, setShowBeliefs] = useState(false);
  const [showTags, setShowTags] = useState(false);
   const [showProfileView, setShowProfileView] = useState(false);
   const [schoolOfThought, setSchoolOfThought] = useState(false);
   const { user } = useAuth();
   const [userDetails, setUserDetails] = useState<any>(user);

   const handleClick = () => {
     setShowProfileView(!showProfileView);
   }

  const toggleBeliefs = () => {
    setShowBeliefs(!showBeliefs);
  }

    const toggleTags = () => {
    setShowTags(!showTags);
  }
   
  const toggleProfileView = () => {
setShowProfileView(!showProfileView);
  }
    const toggleSchoolOfThoughtView = () => {
setSchoolOfThought(!schoolOfThought);
  }

  const toggleMenu = () => {
    setShowTags(false);
    setShowBeliefs(false);
    setShowProfileView(false);
    setSchoolOfThought(false);
  }

  const[tags, setTags] = useState([]);
  useEffect(() => {
    axios.get(`${baseURL}/api/profile/me/data`, 
      {
  headers: {
    'Authorization': `Bearer ${tokenManager.getToken()}`, // 🔑 Token in header
    'Content-Type': 'application/json'
      }
    }
    ).then((userdetails) => {

      setUserDetails(userdetails);

    if (!userdetails.data.politicalViews) return;

    const selectedTags = Object.values(userdetails.data.politicalViews)
      .reduce<{label: string, color: string}[]>((acc, viewString) => {
     
        try {
          const view = JSON.parse(viewString as string);
          return view.isSelected 
            ? [...acc, { label: view.label, color: view.color }] 
            : acc;
        } catch {
          return acc;
        }
      }, []);

    setTags(selectedTags);
    })
  }, [])

  return (
    <div className="">
 {!showTags && !showBeliefs && !schoolOfThought && (
  <div className="grid grid-cols-1 gap-4 px-4 py-6 max-w-md mx-auto">
    <Button variant="legacyGradient" size="menu" onClick={toggleBeliefs}>
      👁 My Beliefs
    </Button>
    <Button variant="legacyGradient" size="menu" onClick={toggleTags}>
      🏷 Tags
    </Button>
    <Button variant="legacyGradient" size="menu" onClick={toggleSchoolOfThoughtView}>
      🧠 School of Thought
    </Button>
    <Button variant="legacyGradient" size="menu" onClick={toggleProfileView}>
      🪪 My Profile Card
    </Button>
  </div>
)}
       <div className="grid grid-cols-1">
      { ( showTags || showBeliefs || schoolOfThought) &&
      <Button variant="legacyGradient" size="menu" className="mx-2 my-2" onClick={toggleMenu}>Return To Edit Profile</Button>}
      </div>
{   showBeliefs && <ProfileBeliefs isSelectingTopics={false} topicChosen={false} feedtopic={false}/>}
{   showTags && <TagSelector />}
{ schoolOfThought && <SchoolOfThoughts/>}
{ showProfileView && <UserProfileModal school={user.school as string} image={infoNeeded.img} tags={tags.map((tag) => tag.label)} beliefs={userDetails.data.philosophies} username={user.username as string} onClose={toggleProfileView} />}
    </div>
  )
}

export default Profile;