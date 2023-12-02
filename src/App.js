import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'
import ProjectItem from './components/ProjectItem'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeTab: categoriesList[0].id,
    projectsData: [],
  }

  componentDidMount() {
    this.getProjectsData(categoriesList[0].id)
  }

  getProjectsData = async categoryId => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = `https://apis.ccbp.in/ps/projects?category=${categoryId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProjectItem => ({
        id: eachProjectItem.id,
        name: eachProjectItem.name,
        imageUrl: eachProjectItem.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleCategoryTab = async event => {
    const selectCategoryId = event.target.value

    this.setState({
      activeTab: selectCategoryId,
    })

    await this.getProjectsData(selectCategoryId)
  }

  renderProjectItemDetailsView = () => {
    const {projectsData} = this.state
    return (
      <ul className="projects-list-items-container">
        {projectsData.map(eachItem => (
          <ProjectItem key={eachItem.id} projectItemDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => {
    const {activeTab} = this.state
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={() => this.getProjectsData(activeTab)}>
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#328af2" />
    </div>
  )

  renderProjectsData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeTab} = this.state
    return (
      <div className="app-container">
        <Header />
        <div className="body-container">
          <select
            className="drop-down"
            onChange={this.handleCategoryTab}
            value={activeTab}
          >
            {categoriesList.map(eachOption => (
              <option key={eachOption.id} value={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsData()}
        </div>
      </div>
    )
  }
}

export default App
