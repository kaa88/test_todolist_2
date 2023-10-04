import projects from '../data//projects.json'
import { _wait } from '../utilities/utilities'


export const projectService = { // fake fetcher
	async getProjects() {
		await _wait()
		// return new Error('test error message')
		return projects
	}
}
