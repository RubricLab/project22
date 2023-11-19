import {DynamicStructuredTool} from 'langchain/tools'
import {Octokit} from 'octokit'
import {z} from 'zod'
import {env} from '~/env.mjs'

const octokit = new Octokit({auth: env.GITHUB_PAT})

/**
 * Call the GitHub REST API
 */
const githubTool = new DynamicStructuredTool({
	description: 'GitHub REST API',
	func: async ({path, body, method}) => {
		const apiUrl = 'https://api.github.com'

		try {
			const res = await octokit.request(`${apiUrl}${path}`, {
				method,
				headers: {
					accept: 'application/vnd.github+json',
					'user-agent': 'octokit-request'
				},
				...body
			})

			return res.data
				? JSON.stringify(res.data).replaceAll(apiUrl, '')
				: 'Something went wrong. Read the docs.'
		} catch (error: any) {
			return `Something went wrong: ${error.message || 'unknown error'}`
		}
	},
	name: 'githubAPI',
	schema: z.object({
		path: z
			.string()
			.describe(
				'Path to the resource on the GitHub API eg. /repos/octokit/request/labels'
			),
		body: z
			.any()
			.describe('Variables to pass to request, as an object of keys with values'),
		method: z.string().describe('Request method, usually GET or POST')
	})
})

export default githubTool
