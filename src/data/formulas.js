export const FORMULA_DATA = {
  Math: {
    Algebra: [
      { name: 'Quadratic Formula', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', note: 'For $ax^2 + bx + c = 0$' },
      { name: 'Difference of Squares', formula: 'a^2 - b^2 = (a+b)(a-b)', note: '' },
      { name: 'Binomial Expansion', formula: '(a+b)^2 = a^2 + 2ab + b^2', note: '' },
      { name: 'Sum of Geometric Series', formula: 'S_n = a \\cdot \\frac{1-r^n}{1-r}', note: 'Where $a$ is first term, $r$ is ratio' },
      { name: 'Logarithm Properties', formula: '\\log_b(xy) = \\log_b x + \\log_b y', note: '' },
      { name: 'Change of Base', formula: '\\log_b a = \\frac{\\ln a}{\\ln b}', note: '' },
    ],
    Geometry: [
      { name: 'Area of Circle', formula: 'A = \\pi r^2', note: '' },
      { name: 'Circumference', formula: 'C = 2\\pi r', note: '' },
      { name: 'Area of Triangle', formula: 'A = \\frac{1}{2}bh', note: '' },
      { name: 'Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', note: '' },
      { name: 'Distance Formula', formula: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', note: '' },
      { name: 'Volume of Sphere', formula: 'V = \\frac{4}{3}\\pi r^3', note: '' },
    ],
    Trigonometry: [
      { name: 'Sine Rule', formula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}', note: '' },
      { name: 'Cosine Rule', formula: 'c^2 = a^2 + b^2 - 2ab\\cos C', note: '' },
      { name: 'Pythagorean Identity', formula: '\\sin^2\\theta + \\cos^2\\theta = 1', note: '' },
      { name: 'Double Angle (sin)', formula: '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta', note: '' },
      { name: 'Double Angle (cos)', formula: '\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta', note: '' },
      { name: 'Tangent', formula: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}', note: '' },
    ],
    Calculus: [
      { name: 'Power Rule', formula: '\\frac{d}{dx}x^n = nx^{n-1}', note: '' },
      { name: 'Chain Rule', formula: '\\frac{d}{dx}f(g(x)) = f\'(g(x)) \\cdot g\'(x)', note: '' },
      { name: 'Product Rule', formula: '(fg)\' = f\'g + fg\'', note: '' },
      { name: 'Integration by Parts', formula: '\\int u\\,dv = uv - \\int v\\,du', note: '' },
      { name: 'Fundamental Theorem', formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)', note: 'Where $F\'(x) = f(x)$' },
      { name: 'Area Under Curve', formula: 'A = \\int_a^b f(x)\\,dx', note: '' },
    ],
  },
  Physics: {
    Kinematics: [
      { name: 'Velocity', formula: 'v = u + at', note: '' },
      { name: 'Displacement', formula: 's = ut + \\frac{1}{2}at^2', note: '' },
      { name: 'Velocity-Displacement', formula: 'v^2 = u^2 + 2as', note: '' },
      { name: 'Average Velocity', formula: 'v_{avg} = \\frac{s}{t}', note: '' },
    ],
    Forces: [
      { name: "Newton's Second Law", formula: 'F = ma', note: '' },
      { name: 'Weight', formula: 'W = mg', note: '$g \\approx 9.81\\,m/s^2$' },
      { name: 'Friction', formula: 'f = \\mu N', note: '' },
      { name: 'Gravitational Force', formula: 'F = \\frac{Gm_1m_2}{r^2}', note: '' },
      { name: 'Hooke\'s Law', formula: 'F = -kx', note: '' },
    ],
    Energy: [
      { name: 'Kinetic Energy', formula: 'KE = \\frac{1}{2}mv^2', note: '' },
      { name: 'Potential Energy', formula: 'PE = mgh', note: '' },
      { name: 'Work', formula: 'W = Fd\\cos\\theta', note: '' },
      { name: 'Power', formula: 'P = \\frac{W}{t}', note: '' },
      { name: 'Work-Energy Theorem', formula: 'W_{net} = \\Delta KE', note: '' },
    ],
    Electricity: [
      { name: 'Ohm\'s Law', formula: 'V = IR', note: '' },
      { name: 'Power (electrical)', formula: 'P = IV = I^2R = \\frac{V^2}{R}', note: '' },
      { name: 'Coulomb\'s Law', formula: 'F = k\\frac{q_1q_2}{r^2}', note: '' },
      { name: 'Capacitance', formula: 'C = \\frac{Q}{V}', note: '' },
      { name: 'Series Resistance', formula: 'R_{total} = R_1 + R_2 + \\ldots', note: '' },
      { name: 'Parallel Resistance', formula: '\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\ldots', note: '' },
    ],
  },
  Chemistry: {
    Stoichiometry: [
      { name: 'Moles', formula: 'n = \\frac{m}{M}', note: '$m$ = mass, $M$ = molar mass' },
      { name: 'Concentration', formula: 'c = \\frac{n}{V}', note: 'mol/L' },
      { name: 'Dilution', formula: 'c_1V_1 = c_2V_2', note: '' },
      { name: 'Percent Yield', formula: '\\%\\text{yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100', note: '' },
    ],
    'Gas Laws': [
      { name: 'Ideal Gas Law', formula: 'PV = nRT', note: '$R = 8.314\\,J/(mol \\cdot K)$' },
      { name: 'Boyle\'s Law', formula: 'P_1V_1 = P_2V_2', note: 'At constant T' },
      { name: 'Charles\'s Law', formula: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}', note: 'At constant P' },
      { name: 'Combined Gas Law', formula: '\\frac{P_1V_1}{T_1} = \\frac{P_2V_2}{T_2}', note: '' },
    ],
    Equilibrium: [
      { name: 'Equilibrium Constant', formula: 'K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}', note: 'For $aA + bB \\rightleftharpoons cC + dD$' },
      { name: 'pH', formula: 'pH = -\\log[H^+]', note: '' },
      { name: 'pOH', formula: 'pOH = -\\log[OH^-]', note: '' },
      { name: 'pH + pOH', formula: 'pH + pOH = 14', note: 'At 25°C' },
      { name: 'Gibbs Free Energy', formula: '\\Delta G = \\Delta H - T\\Delta S', note: '' },
    ],
  },
}

export const FORMULA_SUBJECTS = Object.keys(FORMULA_DATA)
