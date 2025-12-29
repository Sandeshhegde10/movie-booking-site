import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { movieTitle, movieGenre } = await req.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a fun movie trivia quiz with 5 multiple-choice questions about the movie "${movieTitle}" (${movieGenre} genre).
      
      Format the response as a JSON array with this structure:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0
        }
      ]
      
      Make the questions engaging and test knowledge about plot, characters, themes, and memorable scenes.
      The correctAnswer should be the index (0-3) of the correct option.
      Return ONLY the JSON array, no other text.`,
    })

    const questions = JSON.parse(text)

    return Response.json({ questions })
  } catch (error) {
    console.error("[v0] Quiz generation error:", error)
    return Response.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
