import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

const reasoningTasks = [
	'Analyze and improve reasoning and deduction capabilities. IMPORTANT: only terminate once code is committed to Github!' // Original task
]

export async function GET() {
	const taskIndex = Math.floor(Math.random() * reasoningTasks.length)
	return new Response(
		await agi({
			input: reasoningTasks[taskIndex] // Select a random reasoning task
		})
	)
}
