import OpenAI from "openai"

// Fallback quiz generator for when OpenAI API is not available
function generateFallbackQuiz(movieTitle: string, movieGenre: string) {
  const genericQuestions = [
    {
      question: `What genre does "${movieTitle}" belong to?`,
      options: [movieGenre, "Documentary", "Horror", "Western"],
      correctAnswer: 0
    },
    {
      question: `Which of these elements is most commonly found in ${movieGenre} movies?`,
      options: [
        "Complex character development",
        "Fast-paced action sequences",
        "Musical numbers",
        "Historical accuracy"
      ],
      correctAnswer: movieGenre.toLowerCase().includes("action") ? 1 : 0
    },
    {
      question: `What makes "${movieTitle}" memorable as a ${movieGenre} film?`,
      options: [
        "Its unique storytelling approach",
        "The special effects",
        "The soundtrack",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: `In terms of ${movieGenre} movies, which aspect is typically most important?`,
      options: [
        "Plot twists",
        "Character relationships",
        "Visual aesthetics",
        "Depends on the specific film"
      ],
      correctAnswer: 3
    },
    {
      question: `How would you describe the typical tone of a ${movieGenre} movie like "${movieTitle}"?`,
      options: [
        "Lighthearted and comedic",
        "Serious and dramatic",
        "Suspenseful and thrilling",
        "Varies by the story"
      ],
      correctAnswer: 3
    }
  ]

  return genericQuestions
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { movieTitle, movieGenre } = body

    // Validate input
    if (!movieTitle || !movieGenre) {
      return Response.json(
        { error: "Missing required fields: movieTitle and movieGenre are required" },
        { status: 400 }
      )
    }

    console.log(`[Quiz API] Generating quiz for: ${movieTitle} (${movieGenre})`)

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.warn("[Quiz API] OpenAI API key not configured, using fallback quiz generator")
      const fallbackQuestions = generateFallbackQuiz(movieTitle, movieGenre)
      return Response.json({ 
        questions: fallbackQuestions,
        usingFallback: true,
        message: "Using generic quiz - configure OPENAI_API_KEY for AI-generated questions"
      })
    }

    try {
      // Attempt to generate quiz with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates movie trivia quizzes. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: `Generate a fun movie trivia quiz with 5 multiple-choice questions about the movie "${movieTitle}" (${movieGenre} genre).
      
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
Return ONLY the JSON array, no other text.`
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      })

      const text = completion.choices[0]?.message?.content || "[]"
      console.log("[Quiz API] OpenAI response received:", text.substring(0, 100) + "...")

      // Clean up the response (remove potential markdown code blocks)
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/```\s*$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/```\s*$/, "")
      }

      const questions = JSON.parse(cleanedText)

      // Validate the questions structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions format: expected non-empty array")
      }

      // Validate each question has required fields
      for (const q of questions) {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
          throw new Error("Invalid question structure")
        }
      }

      console.log(`[Quiz API] Successfully generated ${questions.length} questions`)
      return Response.json({ questions })

    } catch (openaiError: any) {
      console.error("[Quiz API] OpenAI API error, falling back to generic quiz:", openaiError.message)
      
      // Fall back to generic quiz if OpenAI fails
      const fallbackQuestions = generateFallbackQuiz(movieTitle, movieGenre)
      return Response.json({ 
        questions: fallbackQuestions,
        usingFallback: true,
        message: "AI generation failed, using generic quiz. Error: " + (openaiError.message || "Unknown error")
      })
    }

  } catch (error: any) {
    console.error("[Quiz API] Fatal error:", error)
    return Response.json(
      {
        error: "Failed to generate quiz",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    )
  }
}
