import { useState, useEffect, useMemo } from 'react'

// Static imports of topic data
import mathData from '../data/topics/math.json'
import physicsData from '../data/topics/physics.json'
import chemistryData from '../data/topics/chemistry.json'
import biologyData from '../data/topics/biology.json'
import historyData from '../data/topics/history.json'

const ALL_SUBJECTS = [mathData, physicsData, chemistryData, biologyData, historyData]

export function useTopicContent() {
  const subjects = ALL_SUBJECTS

  const getSubject = (subjectId) => {
    return subjects.find(s => s.subject.toLowerCase() === subjectId?.toLowerCase()) || null
  }

  const getTopic = (subjectId, topicId) => {
    const subject = getSubject(subjectId)
    if (!subject) return null
    return subject.topics.find(t => t.id === topicId) || null
  }

  const getSubtopic = (subjectId, topicId, subtopicId) => {
    const topic = getTopic(subjectId, topicId)
    if (!topic) return null
    return topic.subtopics.find(s => s.id === subtopicId) || null
  }

  const searchTopics = (query) => {
    if (!query || query.length < 2) return []
    const q = query.toLowerCase()
    const results = []

    for (const subject of subjects) {
      for (const topic of subject.topics) {
        for (const subtopic of topic.subtopics) {
          if (
            subtopic.name.toLowerCase().includes(q) ||
            subtopic.theory.toLowerCase().includes(q) ||
            topic.name.toLowerCase().includes(q)
          ) {
            results.push({
              subject: subject.subject,
              subjectIcon: subject.icon,
              topicId: topic.id,
              topicName: topic.name,
              subtopicId: subtopic.id,
              subtopicName: subtopic.name,
            })
          }
        }
      }
    }

    return results.slice(0, 10)
  }

  // Flatten all subtopics for browsing
  const allSubtopics = useMemo(() => {
    const result = []
    for (const subject of subjects) {
      for (const topic of subject.topics) {
        for (const subtopic of topic.subtopics) {
          result.push({
            subject: subject.subject,
            subjectIcon: subject.icon,
            topicId: topic.id,
            topicName: topic.name,
            ...subtopic,
          })
        }
      }
    }
    return result
  }, [])

  return {
    subjects,
    allSubtopics,
    getSubject,
    getTopic,
    getSubtopic,
    searchTopics,
  }
}
