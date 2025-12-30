"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Trophy, ArrowRight } from "lucide-react"
import { getMovies } from "@/app/actions/get-movies"
import type { Movie } from "@/lib/types"

interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

export default function QuizPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quizMessage, setQuizMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoviesData = async () => {
      const data = await getMovies()
      setMovies(data)
    }
    fetchMoviesData()
  }, [])

  const startQuiz = async (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId)
    if (!movie) return

    setLoading(true)
    setSelectedMovie(movieId)
    setQuizMessage(null)

    try {
      console.log("[Quiz] Requesting quiz for:", movie.title, movie.genre)

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieTitle: movie.title,
          movieGenre: movie.genre,
        }),
      })

      console.log("[Quiz] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate quiz")
      }

      const data = await response.json()
      console.log("[Quiz] Response data:", data)

      if (data.error) {
        console.error("[Quiz] Quiz API error:", data.error)
        alert(`Quiz generation failed: ${data.error}. Please check your OpenAI API key in .env file.`)
        setQuestions([])
      } else if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions)

        // Show message if using fallback
        if (data.usingFallback) {
          setQuizMessage(data.message || "Using generic quiz questions")
          console.warn("[Quiz] Using fallback quiz:", data.message)
        } else {
          setQuizMessage(null)
        }
      } else {
        console.error("[Quiz] Invalid response format:", data)
        alert("Invalid response from quiz API. Please try again.")
        setQuestions([])
      }
    } catch (error: any) {
      console.error("[Quiz] Failed to load quiz:", error)
      alert(`Failed to generate quiz: ${error.message}. Please check the console for details.`)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    if (!questions || questions.length === 0 || !questions[currentQuestion]) {
      console.error("[v0] No questions available")
      return
    }

    setSelectedAnswer(answerIndex)

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }, 1000)
  }

  const resetQuiz = () => {
    setSelectedMovie(null)
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setQuizMessage(null)
  }

  const movie = movies.find((m) => m.id === selectedMovie)

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="cinematic-spotlight" style={{ top: "15%", right: "25%" }} />
      <div className="cinematic-spotlight" style={{ bottom: "15%", left: "25%", animationDelay: "3s" }} />

      <Header />

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Movie Quiz</span>
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              Test Your <span className="gradient-text">Movie Knowledge</span>
            </h1>
            <p className="text-muted-foreground">
              Challenge yourself with AI-generated trivia about your favorite films
            </p>
          </div>

          {/* Movie Selection */}
          {!selectedMovie && !loading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {movies.map((m) => (
                <Card
                  key={m.id}
                  className="group cursor-pointer overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all hover:scale-[1.02] hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/20"
                  onClick={() => startQuiz(m.id)}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={m.image || "/placeholder.svg"}
                      alt={m.title}
                      className="h-24 w-16 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="font-bold">{m.title}</h3>
                      <p className="text-sm text-muted-foreground">{m.genre}</p>
                      <Button
                        size="sm"
                        className="mt-2 w-fit"
                        onClick={(e) => {
                          e.stopPropagation()
                          startQuiz(m.id)
                        }}
                      >
                        Start Quiz
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <Card className="card-cinematic">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Sparkles className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
                  <p className="text-lg font-medium">Generating your quiz...</p>
                  <p className="text-sm text-muted-foreground">AI is crafting unique questions</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback Message */}
          {quizMessage && selectedMovie && questions.length > 0 && !loading && (
            <div className="mb-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                    Note: {quizMessage}
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Configure your OpenAI API key in the .env file to enable AI-generated questions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Questions */}
          {selectedMovie && questions && questions.length > 0 && !showResult && !loading && (
            <Card className="card-cinematic">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1} of {questions.length}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Score: {score}/{questions.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-medium">{questions[currentQuestion].question}</p>

                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant={selectedAnswer === idx ? "default" : "outline"}
                      className={`h-auto justify-start p-4 text-left ${selectedAnswer !== null
                        ? idx === questions[currentQuestion].correctAnswer
                          ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                          : selectedAnswer === idx
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : ""
                        : ""
                        }`}
                      onClick={() => selectedAnswer === null && handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-background/50 text-sm font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {showResult && movie && (
            <Card className="card-cinematic">
              <CardContent className="py-12 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/20 p-4 shadow-lg shadow-primary/30">
                    <Trophy className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <h2 className="mb-2 text-3xl font-bold">Quiz Complete!</h2>
                <p className="mb-6 text-xl">
                  You scored <span className="gradient-text font-bold">{score}</span> out of {questions.length}
                </p>
                <p className="mb-8 text-muted-foreground">
                  {score === questions.length
                    ? "Perfect! You're a true movie expert!"
                    : score >= questions.length / 2
                      ? "Great job! You know your movies well!"
                      : "Keep watching and try again!"}
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={resetQuiz}>Try Another Movie</Button>
                  <Button variant="outline" onClick={() => (window.location.href = "/")}>
                    Back to Movies
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
