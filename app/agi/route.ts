import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

export async function GET() {
	return new Response(
		await agi({
			input: 'Analyze the logical structure of the following argument and identify any fallacies or weaknesses: "If all mammals are warm-blooded, and all dogs are mammals, then all dogs must be warm-blooded. However, since some warm-blooded creatures are known to fly, all dogs must have the ability to fly."' // UPDATED INPUT FOR SPECIFIC REASONING TASK
		})
	)
}
