import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

export async function GET() {
	return new Response(
		await agi({
			input: 'analyze and improve reasoning and deduction capabilities' // UPDATED INPUT FOR SELF-IMPROVEMENT TASK
		})
	)
}
