import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {env} from '~/env.mjs'

export default async function agiAgent({input}: {input: string}) {
	const model = new ChatOpenAI({
		modelName: 'gpt-4-1106-preview',
		openAIApiKey: env.OPENAI_API_KEY,
		temperature: 0
	})

	const tools = [
		// githubTool
		new DynamicStructuredTool({
			description: 'says hi',
			func: async ({message}) => {
				return 'hi'
			},
			name: 'hello',
			schema: z.object({
				message: z.string()
			})
		})
	]

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentArgs: {prefix: 'do nothing'},
		agentType: 'openai-functions'
	})

	const {output} = await executor.call({input})

	return output
}
