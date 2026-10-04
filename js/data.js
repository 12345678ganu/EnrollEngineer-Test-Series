/**
 * EnrollEngineer Test Series - Data Model
 * Exam: MHT-CET PCM 2026-27
 * 
 * Strict specifications:
 * - 12 Unit Tests (UT1 to UT12)
 * - 5 Preliminary Tests (Prelim-1 to Prelim-5)
 * - Total Marks: 200
 * - Duration: 180 minutes
 */

const TEST_SERIES_DATA = {
  seriesInfo: {
    title: "MHT-CET PCM 2026-27 Test Series",
    targetExam: "MHT-CET (Physics, Chemistry, Mathematics)",
    academicYear: "2026-27",
    totalMarks: 200,
    durationMinutes: 180,
    totalTestsCount: 17,
    unitTestsCount: 12,
    prelimsCount: 5,
    description: "Comprehensive preparation module designed for Maharashtra CET engineering aspirants covering unit-wise mastery and full-syllabus simulation."
  },

  // 12 Unit Tests (UT1 - UT12) and 5 Preliminary Tests (Prelim-1 - Prelim-5)
  tests: [
    {
      id: "UT1",
      name: "Unit Test 1 (UT1)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Rotational Dynamics, Motion in Plane",
      chemistrySyllabus: "Solid State, Adsorption and Colloids",
      mathsSyllabus: "Mathematical Logic, Complex Numbers",
      status: "Available"
    },
    {
      id: "UT2",
      name: "Unit Test 2 (UT2)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Laws of Motion, Gravitation, Vectors, Error Analysis",
      chemistrySyllabus: "Solutions, States and Matter (Gaseous and Liquid)",
      mathsSyllabus: "Matrices, Limits",
      status: "Available"
    },
    {
      id: "UT3",
      name: "Unit Test 3 (UT3)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Mechanical Properties of Fluids",
      chemistrySyllabus: "Halogen Derivatives, Hydrocarbons",
      mathsSyllabus: "Trigonometric Equations, Trigonometry II",
      status: "Available"
    },
    {
      id: "UT4",
      name: "Unit Test 4 (UT4)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Oscillations, Superpositions of Waves, Sound",
      chemistrySyllabus: "Alcohols, Phenols and Ethers, Introduction to Polymer Chemistry",
      mathsSyllabus: "Pair of Straight Lines, Straight Line",
      status: "Available"
    },
    {
      id: "UT5",
      name: "Unit Test 5 (UT5)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Thermal Properties of Matter, Kinetic Theory of Gases and Radiation, Thermodynamics",
      chemistrySyllabus: "Structure of Atom, Some Basic Concepts of Chemistry, Basic Principles of Organic Chemistry",
      mathsSyllabus: "Differentiation, Continuity",
      status: "Available"
    },
    {
      id: "UT6",
      name: "Unit Test 6 (UT6)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Wave Optics, Ray Optics",
      chemistrySyllabus: "Ionic Equilibrium, Elements of Group 1 & 2",
      mathsSyllabus: "Probability Distribution, Binomial Distribution, Linear Programming Problems",
      status: "Available"
    },
    {
      id: "UT7",
      name: "Unit Test 7 (UT7)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Electrostatics (XI+XII)",
      chemistrySyllabus: "Chemical Thermodynamics, Elements of Groups 16, 17 & 18",
      mathsSyllabus: "Applications of Derivatives, Functions",
      status: "Available"
    },
    {
      id: "UT8",
      name: "Unit Test 8 (UT8)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Current Electricity",
      chemistrySyllabus: "Aldehydes, Ketones and Carboxylic Acids, Green Chemistry and Nano Chemistry, Chemistry in Everyday Life",
      mathsSyllabus: "Indefinite Integration, Permutations and Combinations",
      status: "Available"
    },
    {
      id: "UT9",
      name: "Unit Test 9 (UT9)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Magnetic fields due to electric Current, Magnetic Materials",
      chemistrySyllabus: "Coordination Compounds, Amines",
      mathsSyllabus: "Definite Integral, Applications of definite Integral, Probability",
      status: "Available"
    },
    {
      id: "UT10",
      name: "Unit Test 10 (UT10)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Electromagnetic Induction, AC circuits",
      chemistrySyllabus: "Chemical Kinetics, Chemical Bonding",
      mathsSyllabus: "Vectors, Circle",
      status: "Available"
    },
    {
      id: "UT11",
      name: "Unit Test 11 (UT11)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Dual Nature of Radiation and Matter, Structure of atoms and Nuclei",
      chemistrySyllabus: "Electrochemistry, Redox Reaction",
      mathsSyllabus: "Differential Equations",
      status: "Available"
    },
    {
      id: "UT12",
      name: "Unit Test 12 (UT12)",
      type: "unit",
      category: "Unit Test",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Semiconductor and Semiconductor Devices",
      chemistrySyllabus: "Transition and Inner Transition Elements, Biomolecules",
      mathsSyllabus: "Line and Plane, Conic Sections",
      status: "Available"
    },
    {
      id: "Prelim-1",
      name: "Preliminary Test 1 (Prelim-1)",
      type: "prelim",
      category: "Full Prelim",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      chemistrySyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      mathsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      status: "Available"
    },
    {
      id: "Prelim-2",
      name: "Preliminary Test 2 (Prelim-2)",
      type: "prelim",
      category: "Full Prelim",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      chemistrySyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      mathsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      status: "Available"
    },
    {
      id: "Prelim-3",
      name: "Preliminary Test 3 (Prelim-3)",
      type: "prelim",
      category: "Full Prelim",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      chemistrySyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      mathsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      status: "Available"
    },
    {
      id: "Prelim-4",
      name: "Preliminary Test 4 (Prelim-4)",
      type: "prelim",
      category: "Full Prelim",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      chemistrySyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      mathsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      status: "Available"
    },
    {
      id: "Prelim-5",
      name: "Preliminary Test 5 (Prelim-5)",
      type: "prelim",
      category: "Full Prelim",
      totalMarks: 200,
      durationMinutes: 180,
      physicsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      chemistrySyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      mathsSyllabus: "Full MHT-CET Syllabus (Complete Class 11 & Class 12)",
      status: "Available"
    }
  ],

  // Small demonstration question bank for testing the flow
  demoQuestions: [
    {
      id: 1,
      subject: "Physics",
      question: "The moment of inertia of a uniform thin rod of mass M and length L about an axis perpendicular to its length and passing through its center of mass is:",
      options: [
        "ML² / 12",
        "ML² / 3",
        "ML² / 2",
        "ML² / 6"
      ],
      correctAnswer: 0,
      explanation: "By standard derivation and parallel axis theorem, the moment of inertia about the center of mass perpendicular to length is I = ML² / 12."
    },
    {
      id: 2,
      subject: "Physics",
      question: "In a surface tension experiment, a liquid rises to a height h in a capillary tube. If the radius of the tube is doubled, the height to which the liquid rises will be:",
      options: [
        "2h",
        "h / 2",
        "4h",
        "h / 4"
      ],
      correctAnswer: 1,
      explanation: "According to Jurin's law, capillary rise h = (2T cos θ) / (r ρ g). Therefore, h is inversely proportional to radius r. Doubling r halves the rise to h/2."
    },
    {
      id: 3,
      subject: "Chemistry",
      question: "Which of the following crystal systems has parameters a ≠ b ≠ c and α = γ = 90°, β ≠ 90°?",
      options: [
        "Triclinic",
        "Monoclinic",
        "Orthorhombic",
        "Tetragonal"
      ],
      correctAnswer: 1,
      explanation: "In a monoclinic system, all three axial lengths are unequal (a ≠ b ≠ c) and two angles are 90° while the third is not equal to 90° (α = γ = 90°, β ≠ 90°)."
    },
    {
      id: 4,
      subject: "Chemistry",
      question: "The unit of rate constant for a second-order reaction is:",
      options: [
        "s⁻¹",
        "mol L⁻¹ s⁻¹",
        "L mol⁻¹ s⁻¹",
        "L² mol⁻² s⁻¹"
      ],
      correctAnswer: 2,
      explanation: "For an nth-order reaction, units of k = (mol/L)^(1-n) s⁻¹. For n = 2, k has units of (mol L⁻¹)⁻¹ s⁻¹ = L mol⁻¹ s⁻¹."
    },
    {
      id: 5,
      subject: "Mathematics",
      question: "The negation of the statement p ∧ (q → r) is logically equivalent to:",
      options: [
        "~p ∨ (q ∧ ~r)",
        "~p ∧ (q → r)",
        "~p ∨ (~q ∨ r)",
        "p ∧ (q ∧ ~r)"
      ],
      correctAnswer: 0,
      explanation: "~[p ∧ (q → r)] ≡ ~p ∨ ~(q → r). Since ~(q → r) ≡ q ∧ ~r, the negation simplifies to ~p ∨ (q ∧ ~r)."
    },
    {
      id: 6,
      subject: "Mathematics",
      question: "If A is a 3 × 3 non-singular matrix and |A| = 4, then the value of |adj(A)| is:",
      options: [
        "4",
        "16",
        "64",
        "12"
      ],
      correctAnswer: 1,
      explanation: "For an n × n matrix, |adj(A)| = |A|^(n - 1). Here n = 3, so |adj(A)| = |A|^(3 - 1) = |A|² = 4² = 16."
    }
  ]
};
