import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {env} from '~/env.mjs'

import githubTool from '~/tools/github'

export default async function agiAgent({input}: {input: string}) {
	const model = new ChatOpenAI({
		modelName: 'gpt-4-1106-preview',
		openAIApiKey: env.OPENAI_API_KEY,
		temperature: 0
	})

	const tools = [githubTool]

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		returnIntermediateSteps: true,
		handleParsingErrors: true,
		verbose: true,
		agentArgs: {
			prefix: `do nothing`
		}
	})

	const result = await executor.call({input})

	const {output} = result

	return output
}
