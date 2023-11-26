import {DynamicStructuredTool} from 'langchain/tools'
import {Octokit} from 'octokit'
import {z} from 'zod'
import env from '~/env.mjs'

const octokit = new Octokit({auth: env.GITHUB_PAT})

/**
 * Commit file to GitHub repository
 */
const commitGitHubFile = new DynamicStructuredTool({
	description: 'Commit file to GitHub repository',
	func: async ({path, content, message}) => {
		const apiUrl = 'https://api.github.com/repos/RubricLab/project22/contents'

		try {
			const res = await octokit.request(`${apiUrl}${path}`, {
				method: 'PUT',
				headers: {
					accept: 'application/vnd.github+json',
					'user-agent': 'octokit-request'
				},
				data: {
					message: message,
					content: Buffer.from(content).toString('base64')
				}
			})

			return res.status === 200
				? 'Commit successful'
				: 'Something went wrong. Read the docs.'
		} catch (error: any) {
			return `Something went wrong: ${error.message || 'unknown error'}`
		}
	},
	name: 'githubFileCommitter',
	schema: z.object({
		path: z
			.string()
			.describe('Path to the file in the GitHub repository eg. /src/index.js'),
		content: z.string().describe('Content to be committed to the file'),
		message: z.string().describe('Commit message')
	})
})

export default commitGitHubFile
