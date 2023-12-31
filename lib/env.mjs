import {createEnv} from '@t3-oss/env-nextjs'
import z from 'zod'

export default createEnv({
	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		GITHUB_PAT: process.env.GITHUB_PAT,
		GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
	},

	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		OPENAI_API_KEY: z.string().min(1),
		GITHUB_PAT: z.string().min(1),
		GITHUB_REPOSITORY: z.string().min(1),
	}
})
