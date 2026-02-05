import { useTheme } from '../../hooks/useTheme'
import PracticeQuestion from './PracticeQuestion'
import PracticeResults from './PracticeResults'

export default function PracticeSession({
  questions,
  currentIndex,
  currentQuestion,
  answers,
  revealedSolutions,
  revealedHints,
  sessionComplete,
  timerEnabled,
  timePerQuestion,
  totalTime,
  setAnswer,
  revealHint,
  revealSolution,
  nextQuestion,
  previousQuestion,
  finishSession,
  reset,
}) {
  const { isDark } = useTheme()

  if (sessionComplete) {
    return (
      <PracticeResults
        questions={questions}
        answers={answers}
        revealedSolutions={revealedSolutions}
        totalTime={totalTime}
        onPracticeAgain={reset}
        onReviewQuestion={(i) => {
          // Just reset completion to review
          reset()
        }}
      />
    )
  }

  if (!currentQuestion) return null

  const isLast = currentIndex === questions.length - 1

  return (
    <div className="space-y-5">
      <PracticeQuestion
        question={currentQuestion}
        questionIndex={currentIndex}
        total={questions.length}
        answer={answers[currentIndex]}
        onAnswerChange={(val) => setAnswer(currentIndex, val)}
        revealedHintCount={revealedHints[currentIndex] || 0}
        onRevealHint={() => revealHint(currentIndex)}
        solutionRevealed={!!revealedSolutions[currentIndex]}
        onRevealSolution={() => revealSolution(currentIndex)}
        timerEnabled={timerEnabled}
        timePerQuestion={timePerQuestion}
      />

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={previousQuestion}
          disabled={currentIndex === 0}
          className={`btn-secondary flex-1 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          ← Previous
        </button>
        {isLast ? (
          <button onClick={finishSession} className="btn-primary flex-1">
            Finish ✓
          </button>
        ) : (
          <button onClick={nextQuestion} className="btn-primary flex-1">
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
