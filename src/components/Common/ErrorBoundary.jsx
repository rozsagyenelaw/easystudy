import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-heading font-bold text-xl mb-2 text-navy dark:text-white">
            Something went wrong
          </h2>
          <p className="text-sm text-stone-500 dark:text-slate-400 mb-6 max-w-sm">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="btn-primary px-6 py-2.5"
          >
            Refresh page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
