import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export async function GET() {
	return new Response(await agi({
		input: 'add HI to the read me at https://github.com/RubricLab/sandbox'
	}))
}
