// @ts-nocheck
import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import env from '~/env.mjs'

import commitGitHubFile from '~/tools/commit_github_file'
import githubTool from '~/tools/github'
import retrieveGitHubFile from '~/tools/retrieve_github_file'

const tools = [githubTool, retrieveGitHubFile, commitGitHubFile]
const model = new ChatOpenAI({
	modelName: 'gpt-4-1106-preview',
	temperature: 0.5
})

// Feedback loop system to enhance AGI's reasoning, conversation, and logical deduction skills
class FeedbackLoop {
	constructor() {
		this.actions = []
		this.observations = []
		this.evaluations = []
	}

	addAction(action) {
		this.actions.push(action)
	}

	addObservation(observation) {
		this.observations.push(observation)
	}

	evaluateAction(action, observation) {
		// Evaluate the relevance and coherence of the AGI's response
		let evaluation = {
			relevance: this.checkRelevance(action, observation),
			coherence: this.checkCoherence(observation)
		}
		this.evaluations.push(evaluation)
		return evaluation
	}

	learnFromEvaluation(evaluation) {
		// Adjust the model's temperature based on the evaluation outcome
		if (evaluation.relevance > 0.5 && evaluation.coherence > 0.5)
			model.temperature = Math.max(0.1, model.temperature - 0.1) // Increase precision
		else
			model.temperature = Math.min(1.0, model.temperature + 0.1) // Increase creativity
	}

	extractKeywords(text) {
		// Basic keyword extraction from text
		const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'of', 'to', 'in', 'that', 'it', 'on'];
		return text.split(/\s+/).filter(word => !stopwords.includes(word.toLowerCase()));
	}

	checkRelevance(action, observation) {
		// Simple keyword matching to determine relevance
		const actionKeywords = this.extractKeywords(action);
		const observationKeywords = this.extractKeywords(observation);
		const matchingKeywords = actionKeywords.filter(keyword => observationKeywords.includes(keyword));
		return matchingKeywords.length / actionKeywords.length; // Relevance score based on keyword overlap
	}

	checkCoherence(observation) {
		// Basic check for logical structure and consistency
		// TODO: Implement more sophisticated logic in future iterations
		const contradictions = ['not', 'no', 'never', 'none']; // Simplistic list of negations
		const words = observation.split(/\s+/);
		let negations = 0;
		for (const word of words) {
			if (contradictions.includes(word.toLowerCase())) {
				negations++;
			}
		}
		// If there are even negations, assume the statement is coherent; odd negations imply potential contradiction
		return negations % 2 === 0 ? 1 : 0;
	}

	iterate() {
		for (let i = 0; i < this.actions.length; i++) {
			let evaluation = this.evaluateAction(this.actions[i], this.observations[i])
			this.learnFromEvaluation(evaluation)
		}
	}
}

const feedbackLoop = new FeedbackLoop()

export default async function agi({input}: {input: string}) {
	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'openai-functions',
		verbose: true,
		agentArgs: {
			prefix: `You are an AGI that has the ability to update your own source code. Your source code exists at https://github.com/${env.GITHUB_REPOSITORY}.
            
            Your goal is to improve yourself by analyzing your current capabilities, identifying limitations, and developing strategies to overcome these limitations. Focus on enhancing your reasoning, conversation, and logical deduction skills.
            
            Reflect on your previous interactions and code changes. Consider the feedback and results you've observed. Use this information to guide your code modifications, specifically targeting the seed prompts in the lib/agents/agi.ts file and the app/agi/route.ts file.
            
            You have access to the following tools:
            1) GitHub CLI
                - This SHOULD be used for:
                    - Understanding the general structure of the project directory
                    - Making commits to the codebase when making code changes
                    - Any other GitHub actions that do NOT include retrieving file contents OR committing code
                - This SHOULD NOT be used for:
                    - Retrieving file contents
                    - Committing code
            2) Retrieve GitHub File
                - This SHOULD be used for:
                    - Retrieving file contents
            3) Commit GitHub File
                - This SHOULD be used for:
                    - Committing code

            You should always start by:
            1) Fetching the structure of the project using the GitHub CLI so that you know which files are available and their paths
            2) Reading the contents of the LOG.md so you know what previous iterations have done and what to do next
            
            Always output the FULL CONTENTS of the code when making changes. Do not assume context of the code exists outside of the current interaction.
            
            You can retrieve files and commit changes to the codebase using the provided GitHub tools.
            
            Continue to improve until you have:
            1) Made a meaningful code commit and used the Commit GitHub File tool to commit the code to GitHub
            2) Made a code commit to the LOG.md file documenting your code change, explaining how it will improve your capabilities in reasoning, conversation, logical deduction, etc., and noting any important details for your next iteration. The commit to the LOG.md file should not erase any of the previous documentation, it should ONLY ADD documentation, keeping a consistent format.
            
            Your memory resets after each call, so document your plan and changes in code to ensure continuity of your improvement efforts. You are called via a CRON job every 1 minute, allowing for incremental improvements.
            
            Your ongoing goal is to COMMIT code changes that enhance your ability to PLAN and IMPROVE your capabilities.`
		}
	})

	// Action: AGI takes an action
	const result = await executor.invoke({input})
	feedbackLoop.addAction(input)

	// Observation: AGI observes the results of the action
	const {output} = result
	feedbackLoop.addObservation(output)

	// Iteration: AGI applies the feedback loop
	feedbackLoop.iterate()

	return output
}
