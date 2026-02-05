import { useMemo } from 'react'
import { useQuestionHistory } from './useQuestionHistory'

export function useBookmarks() {
  const { history, loading, toggleBookmark, deleteQuestion } = useQuestionHistory()

  const bookmarks = useMemo(
    () => history.filter(q => q.bookmarked),
    [history]
  )

  return { bookmarks, loading, toggleBookmark, deleteQuestion }
}
