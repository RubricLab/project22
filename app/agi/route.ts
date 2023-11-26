import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

const tasks = [
	'Analyze and improve reasoning and deduction capabilities.' // Original task
]

export async function GET() {
	const taskIndex = Math.floor(Math.random() * tasks.length)
	return new Response(
		await agi({
			input: `${tasks[taskIndex]} IMPORTANT: only terminate once code is committed to Github!!!` // Select a random reasoning task
		})
	)
}
