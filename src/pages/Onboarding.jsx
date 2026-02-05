import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOnboarding } from '../hooks/useOnboarding'
import WelcomeScreen from '../components/Onboarding/WelcomeScreen'
import GradeLevelSelector from '../components/Onboarding/GradeLevelSelector'
import SubjectInterestPicker from '../components/Onboarding/SubjectInterestPicker'
import GoalPicker from '../components/Onboarding/GoalPicker'
import TutorialSlides from '../components/Onboarding/TutorialSlides'

export default function Onboarding() {
  const { step, setStep, completeOnboarding, updatePrefs, prefs } = useOnboarding()
  const [grade, setGrade] = useState(prefs.grade || '')
  const [subjects, setSubjects] = useState(prefs.subjects || [])
  const [goal, setGoal] = useState(prefs.goal || '')

  const handleGradeNext = () => {
    updatePrefs({ grade })
    setStep(2)
  }

  const handleSubjectsNext = () => {
    updatePrefs({ subjects })
    setStep(3)
  }

  const handleGoalNext = () => {
    updatePrefs({ goal })
    setStep(4)
  }

  const handleComplete = () => {
    completeOnboarding()
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <WelcomeScreen key="welcome" onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <GradeLevelSelector
            key="grade"
            value={grade}
            onChange={setGrade}
            onNext={handleGradeNext}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <SubjectInterestPicker
            key="subjects"
            value={subjects}
            onChange={setSubjects}
            onNext={handleSubjectsNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <GoalPicker
            key="goal"
            value={goal}
            onChange={setGoal}
            onNext={handleGoalNext}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <TutorialSlides
            key="tutorial"
            onComplete={handleComplete}
            onBack={() => setStep(3)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
