import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import githubTool from '~/tools/github'

const tools = [
	githubTool
]
const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	temperature: 0
})

export default async function agi({input}: {input: string}) {
	
	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		verbose: true,
	})

	const result = await executor.invoke({input})

	const {output} = result

	return output
}
