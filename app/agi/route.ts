import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

const reasoningTasks = [
	'Analyze and improve reasoning and deduction capabilities. IMPORTANT: only terminate once code is committed to Github!', // Original task
	"Analyze the logical structure of an argument provided in the input, identify any fallacies, and assess the argument's validity." // New task
]

export async function GET() {
	const taskIndex = Math.floor(Math.random() * reasoningTasks.length)
	return new Response(
		await agi({
			input: reasoningTasks[taskIndex] // Select a random reasoning task
		})
	)
}
