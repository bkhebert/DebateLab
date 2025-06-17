import ProfileBeliefs from "../components/ProfileBeliefs";
import TagSelector from "../components/TagSelector";
import { useState } from "react";
import SchoolOfThoughts from "../components/SchoolOfThoughts";
import useAuth from "../contexts/useAuth";
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
const Profile = () => {
  const [showBeliefs, setShowBeliefs] = useState(false);
  const [showTags, setShowTags] = useState(false);
   const [showProfileView, setShowProfileView] = useState(false);
   const [schoolOfThought, setSchoolOfThought] = useState(false);
   const { user } = useAuth();
  console.log(JSON.stringify(user))
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

  return (
    <div className="">
      { !showTags && !showBeliefs && !schoolOfThought && 
      <div className="grid grid-cols-1">
        <button className="bg-primary/80 p-2 m-2 rounded-md"onClick={toggleBeliefs}>
          My Beliefs
        </button>
        <button  className="bg-primary/80 p-2 m-2 rounded-md"onClick={toggleTags}>
          Tags
        </button>
        <button className="bg-primary/80 p-2 m-2 rounded-md"onClick={toggleSchoolOfThoughtView}>
          School Of Thought
        </button>
        <button className="bg-primary/80 p-2 m-2 rounded-md"onClick={toggleProfileView}>
          My Profile Card
        </button>
        
      </div> }
       <div className="grid grid-cols-1">
      { ( showTags || showBeliefs || schoolOfThought) && 
      <button className="bg-primary/80 p-2 m-2 rounded-md" onClick={toggleMenu}>Return To Edit Profile</button>}
      </div>
{   showBeliefs && <ProfileBeliefs isSelectingTopics={false}/>}
{   showTags && <TagSelector />}
{ schoolOfThought && <SchoolOfThoughts/>}
{ showProfileView && <UserProfileModal image={infoNeeded.img} tags={infoNeeded.tags} beliefs={infoNeeded.beliefs} onClose={toggleProfileView} />}
    </div>
  )
}

export default Profile;