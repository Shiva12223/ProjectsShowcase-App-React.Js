import './index.css'

const ProjectItem = props => {
  const {projectItemDetails} = props
  const {name, imageUrl} = projectItemDetails

  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} />
      <div>
        <p>{name}</p>
      </div>
    </li>
  )
}

export default ProjectItem
