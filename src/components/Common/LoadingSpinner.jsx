import { motion } from 'framer-motion'

export default function LoadingSpinner({ message = 'Thinking...', size = 'md' }) {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8" role="status">
      <motion.div
        className={`${sizes[size]} rounded-full border-3 border-slate-300 border-t-accent dark:border-slate-600 dark:border-t-accent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-heading font-medium">
        {message}
      </p>
      <span className="sr-only">Loading</span>
    </div>
  )
}
