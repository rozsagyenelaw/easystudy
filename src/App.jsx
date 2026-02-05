import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import InstallBanner from './components/Layout/InstallBanner'
import WelcomeModal from './components/Layout/WelcomeModal'
import LoadingSpinner from './components/Common/LoadingSpinner'
import ErrorBoundary from './components/Common/ErrorBoundary'
import AchievementToast from './components/Common/AchievementToast'
import OfflineBanner from './components/Offline/OfflineBanner'
import { useAchievements } from './hooks/useAchievements'
import { useOnboarding } from './hooks/useOnboarding'

const Home = lazy(() => import('./pages/Home'))
const AskQuestion = lazy(() => import('./pages/AskQuestion'))
const SolutionPage = lazy(() => import('./pages/SolutionPage'))
const History = lazy(() => import('./pages/History'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const PracticeMode = lazy(() => import('./pages/PracticeMode'))
const FormulaSheets = lazy(() => import('./pages/FormulaSheets'))
const SharedSolution = lazy(() => import('./pages/SharedSolution'))
const Progress = lazy(() => import('./pages/Progress'))
const StudyPlan = lazy(() => import('./pages/StudyPlan'))
const Profile = lazy(() => import('./pages/Profile'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const SubjectBrowser = lazy(() => import('./pages/SubjectBrowser'))
const TopicDetail = lazy(() => import('./pages/TopicDetail'))

function AppContent() {
  const { newAchievement, dismissNewAchievement } = useAchievements()
  const { shouldShowOnboarding } = useOnboarding()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-warm-white dark:bg-navy text-stone-800 dark:text-slate-200 transition-colors duration-300">
        {!shouldShowOnboarding && <OfflineBanner />}
        {!shouldShowOnboarding && <Navbar />}
        <main className={shouldShowOnboarding ? '' : 'min-h-[calc(100vh-3.5rem)]'}>
          <Suspense fallback={<div className="py-20"><LoadingSpinner message="" /></div>}>
            {shouldShowOnboarding ? (
              <Onboarding />
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/solution/:id" element={<SolutionPage />} />
                <Route path="/history" element={<History />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/practice" element={<PracticeMode />} />
                <Route path="/formulas" element={<FormulaSheets />} />
                <Route path="/shared/:shareId" element={<SharedSolution />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/study-plan" element={<StudyPlan />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/topics" element={<SubjectBrowser />} />
                <Route path="/topics/:subjectId" element={<SubjectBrowser />} />
                <Route path="/topics/:subjectId/:topicId/:subtopicId" element={<TopicDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </Suspense>
        </main>
        {!shouldShowOnboarding && <Footer />}
        {!shouldShowOnboarding && <InstallBanner />}
        {!shouldShowOnboarding && <WelcomeModal />}
        <AchievementToast achievement={newAchievement} onDismiss={dismissNewAchievement} />
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
