import { useTheme } from '../../hooks/useTheme'
import MathRenderer from '../Common/MathRenderer'

export default function FormulaCard({ formula }) {
  const { isDark } = useTheme()

  return (
    <div className={`rounded-xl p-4 border transition-colors ${
      isDark
        ? 'bg-navy-light border-slate-700 hover:border-slate-600'
        : 'bg-white border-stone-200 hover:border-stone-300'
    }`}>
      <p className={`text-xs font-heading font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
        {formula.name}
      </p>
      <div className={`text-center py-2 ${isDark ? 'text-white' : 'text-navy'}`}>
        <MathRenderer text={`$$${formula.formula}$$`} />
      </div>
      {formula.note && (
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
          <MathRenderer text={formula.note} />
        </p>
      )}
    </div>
  )
}
