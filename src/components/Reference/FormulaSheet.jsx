import { useTheme } from '../../hooks/useTheme'
import FormulaCard from './FormulaCard'

export default function FormulaSheet({ subject, categories }) {
  const { isDark } = useTheme()

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, formulas]) => (
        <div key={category}>
          <h3 className={`font-heading font-semibold text-base mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formulas.map((formula, i) => (
              <FormulaCard key={i} formula={formula} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
