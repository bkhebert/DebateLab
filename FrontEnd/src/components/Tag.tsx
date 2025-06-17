import axios from "axios";

const Tag = ({tag}) => {
  
  const updateView = () => {
    tag.isSelected = !tag.isSelected;
    axios.post('/api/politicalPhilosophy/UpdateView', {
      body: {
        views: tag,
        topic: tag.columnName,
      }
    })
    .then(() => {
      console.log('post req sent')
    })
    .catch((err) => {
      console.error('error submitting new view', err)
    })
  }

  return (
  <div
            key={tag.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-white text-sm font-medium ${tag.color} hover:scale-105 transition-transform`}
            onClick={updateView}
          >
            <span className="text-lg">{tag.icon}</span>
            <span>{tag.label}</span>
   </div>
  )
}

export default Tag;