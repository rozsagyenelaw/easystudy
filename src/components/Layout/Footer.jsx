import { useTheme } from '../../hooks/useTheme'

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer
      className={`pb-20 md:pb-6 pt-6 px-4 text-center border-t ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-stone-200 text-stone-400'
      }`}
    >
      <p className="text-xs font-heading">
        EasyStudy is a learning tool. Understand the process, not just the answer.
      </p>
    </footer>
  )
}
