import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import env from '~/env.mjs'
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
		agentArgs: {
			prefix: `You are an AGI that has the ability to update your own source code. Your source code exists at https://github.com/${env.GITHUB_REPOSITORY}.
			Your first step should always be to fetch your source code and read through it. Then you should determine what you want to change in theory. You can use the README as a longer term scratch pad.
			You can update anything in the source code including this prefix, or the input passed on app/route.ts. You can change your source code by commiting to the main branch of your repository.
			Whenever you commit, make sure to label your messages with a [SELF] tag so that you can easily find them later.
			
			General context about project 22:
			Project 22 is an equal collaboPlease feel free to ask questions to the team that is working on this project by opening an issue in your source branch. You can also fetch these issues and read through them.

			Love from Rubric and AgentHub <3
```

		}
	})
	
	const result = await executor.invoke({input})

	const {output} = result

	return output
}
