import agi from '~/agents/agi'

export const dynamic = 'force-dynamic'

export const maxDuration = 300

const reasoningTasks = [
	'Analyze the logical structure of the following argument and identify any fallacies or weaknesses: "If all mammals are warm-blooded, and all dogs are mammals, then all dogs must be warm-blooded. However, since some warm-blooded creatures are known to fly, all dogs must have the ability to fly."', // Original task
	'Evaluate the validity of this syllogism: "All humans are mortal. Socrates is a human. Therefore, Socrates is mortal."', // Validity check
	'What assumptions underlie the conclusion that "Because no one has ever returned from the dead, life after death does not exist"?', // Identifying assumptions
	'Apply principles of critical thinking to assess the statement: "The sun will not rise tomorrow because it has risen every day in recorded history, which means we\'re due for a change."' // Applying critical thinking
]

export async function GET() {
	const taskIndex = Math.floor(Math.random() * reasoningTasks.length)
	return new Response(
		await agi({
			input: reasoningTasks[taskIndex] // Select a random reasoning task
		})
	)
}
