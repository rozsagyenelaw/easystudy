import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import InstallBanner from './components/Layout/InstallBanner'
import WelcomeModal from './components/Layout/WelcomeModal'
import LoadingSpinner from './components/Common/LoadingSpinner'

const Home = lazy(() => import('./pages/Home'))
const AskQuestion = lazy(() => import('./pages/AskQuestion'))
const SolutionPage = lazy(() => import('./pages/SolutionPage'))
const History = lazy(() => import('./pages/History'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-warm-white dark:bg-navy text-stone-800 dark:text-slate-200 transition-colors duration-300">
            <Navbar />
            <main className="min-h-[calc(100vh-3.5rem)]">
              <Suspense fallback={<div className="py-20"><LoadingSpinner message="" /></div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/ask" element={<AskQuestion />} />
                  <Route path="/solution/:id" element={<SolutionPage />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <InstallBanner />
            <WelcomeModal />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
