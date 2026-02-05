const SUBJECT_KEYWORDS = {
  Math: [
    'equation', 'solve', 'integral', 'derivative', 'function', 'graph', 'algebra',
    'calculus', 'matrix', 'vector', 'probability', 'statistics', 'geometry',
    'triangle', 'circle', 'polynomial', 'factor', 'simplify', 'fraction',
    'logarithm', 'exponent', 'sin', 'cos', 'tan', 'limit', 'sum', 'series',
    'quadratic', 'linear', 'inequality', 'slope', 'intercept', 'area', 'volume',
  ],
  Physics: [
    'force', 'velocity', 'acceleration', 'momentum', 'energy', 'wave', 'frequency',
    'electric', 'magnetic', 'circuit', 'resistance', 'voltage', 'current',
    'gravity', 'mass', 'weight', 'newton', 'joule', 'watt', 'pressure',
    'thermodynamics', 'entropy', 'quantum', 'photon', 'relativity', 'optics',
    'friction', 'torque', 'angular', 'oscillation', 'pendulum',
  ],
  Chemistry: [
    'molecule', 'atom', 'element', 'compound', 'reaction', 'bond', 'ion',
    'acid', 'base', 'molar', 'concentration', 'solution', 'equilibrium',
    'oxidation', 'reduction', 'electron', 'proton', 'neutron', 'isotope',
    'organic', 'periodic table', 'valence', 'stoichiometry', 'enthalpy',
    'catalyst', 'polymer',
  ],
  Biology: [
    'cell', 'dna', 'rna', 'protein', 'gene', 'evolution', 'species',
    'photosynthesis', 'respiration', 'mitosis', 'meiosis', 'chromosome',
    'enzyme', 'organism', 'ecosystem', 'bacteria', 'virus', 'membrane',
    'tissue', 'organ', 'nervous system', 'immune', 'metabolism', 'mutation',
    'ecology', 'biodiversity', 'homeostasis',
  ],
  History: [
    'war', 'revolution', 'empire', 'dynasty', 'century', 'civilization',
    'democracy', 'colony', 'independence', 'treaty', 'constitution',
    'medieval', 'renaissance', 'industrial', 'ancient', 'modern',
    'political', 'economic', 'social movement',
  ],
  Languages: [
    'grammar', 'verb', 'noun', 'adjective', 'tense', 'conjugate', 'translate',
    'sentence', 'paragraph', 'essay', 'literature', 'poem', 'novel', 'syntax',
    'vocabulary', 'pronoun', 'preposition', 'metaphor', 'simile', 'rhetoric',
  ],
}

export function detectSubject(question) {
  const lower = question.toLowerCase()
  const scores = {}

  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    scores[subject] = keywords.reduce((score, keyword) => {
      return score + (lower.includes(keyword) ? 1 : 0)
    }, 0)
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return best[1] > 0 ? best[0] : null
}

export const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Languages', 'Other']
