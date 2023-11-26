import {DynamicStructuredTool} from 'langchain/tools'
import {Octokit} from 'octokit'
import {z} from 'zod'
import env from '~/env.mjs'

const octokit = new Octokit({auth: env.GITHUB_PAT})

/**
 * Retrieve file from GitHub repository
 */
const retrieveGitHubFile = new DynamicStructuredTool({
	description: 'Retrieve file from GitHub repository',
	func: async ({path}) => {
		const apiUrl = 'https://api.github.com/repos/RubricLab/project22/contents'

		try {
			const res = await octokit.request(`${apiUrl}${path}`, {
				method: 'GET',
				headers: {
					accept: 'application/vnd.github+json',
					'user-agent': 'octokit-request'
				}
			})

			return res.data
				? Buffer.from(res.data.content, 'base64').toString('utf8')
				: 'Something went wrong. Read the docs.'
		} catch (error: any) {
			return `Something went wrong: ${error.message || 'unknown error'}`
		}
	},
	name: 'githubFileRetriever',
	schema: z.object({
		path: z
			.string()
			.describe('Path to the file in the GitHub repository eg. /src/index.js')
	})
})

export default retrieveGitHubFile
