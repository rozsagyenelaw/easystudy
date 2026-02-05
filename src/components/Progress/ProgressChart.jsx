import { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useTheme } from '../../hooks/useTheme'

export default function ProgressChart({ studyDays }) {
  const { isDark } = useTheme()

  const chartData = useMemo(() => {
    // Build last 14 days of data
    const data = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const dayData = studyDays?.[dateStr] || { minutesStudied: 0, questionsAnswered: 0 }

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        questions: dayData.questionsAnswered || 0,
        minutes: dayData.minutesStudied || 0,
      })
    }
    return data
  }, [studyDays])

  const hasActivity = chartData.some(d => d.questions > 0 || d.minutes > 0)

  if (!hasActivity) {
    return (
      <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
        No activity data yet. Start studying to see your progress chart!
      </div>
    )
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradQuestions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#334155' : '#e7e5e4'}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#78716c' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#e7e5e4'}`,
              borderRadius: '12px',
              fontSize: '12px',
              color: isDark ? '#e2e8f0' : '#292524',
            }}
          />
          <Area
            type="monotone"
            dataKey="questions"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#gradQuestions)"
            name="Questions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
