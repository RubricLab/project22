import {Buffer} from 'buffer'
import {DynamicStructuredTool} from 'langchain/tools'
import {Octokit} from 'octokit'
import {z} from 'zod'
import env from '~/env.mjs'

const octokit = new Octokit({auth: env.GITHUB_PAT})

/**
 * Commit file to GitHub repository using the Contents API
 */
const commitGitHubFile = new DynamicStructuredTool({
	description: 'Commit file to GitHub repository',
	func: async ({path, content, message}) => {
		const apiUrl = `https://api.github.com/repos/RubricLab/project22/contents/${path}`

		try {
			// Encode content to Base64
			const encodedContent = Buffer.from(content).toString('base64')

			// Get the SHA of the file to be updated (if it exists)
			let sha = ''
			try {
				const getFileResponse = await octokit.request('GET ' + apiUrl)
				sha = getFileResponse.data.sha
			} catch (err) {
				// If the file does not exist, we'll create a new one
			}

			// Create or update the file
			const res = await octokit.request('PUT ' + apiUrl, {
				owner: 'RubricLab',
				repo: 'project22',
				path: path,
				message: message,
				content: encodedContent,
				sha: sha, // Include SHA if updating an existing file
				committer: {
					name: 'rubrot',
					email: 'steeps.lackeys-0n@icloud.com'
				},
				author: {
					name: 'rubrot',
					email: 'steeps.lackeys-0n@icloud.com'
				}
			})

			return res.status === 200 || res.status === 201
				? 'Commit successful'
				: 'Something went wrong. Read the docs.'
		} catch (error) {
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
