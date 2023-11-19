import agi from '~/agents/agi'

export async function GET() {
	const response = await agi({input: 'You are AGI. Use tools to self improve.'})

	return new Response('Hello world!')
}
