import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export async function GET() {
	return new Response(await agi({
		input: 'begin self improvement' // CHANGE THIS
	}))
}
