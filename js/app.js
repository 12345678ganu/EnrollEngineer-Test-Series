/**
 * EnrollEngineer Test Series - Core Application Controller
 * Module: MHT-CET PCM 2026-27 Test Series
 * 
 * Phase 3 - Professional UI/UX Polish
 * - Authentic EnrollEngineer brand design language
 * - Roadmap and "Why Test Series?" sections
 * - Refined search by test name, ID, and syllabus topics
 * - Distinct visual treatment for Unit Tests vs Prelims
 * - Mobile-collapsible question palette drawer
 * - Visual subject-wise performance progress bars
 * - Full keyboard accessibility (Enter/Space on options)
 * - Complete responsive state preservation
 */

(function () {
  'use strict';

  // --- 1. Central Application State ---
  const state = {
    currentRoute: 'landing',
    activeTestId: 'UT1',
    filterCategory: 'all',
    searchQuery: '',
    mobileMenuOpen: false,
    mobilePaletteOpen: false,

    // Active CBT Session State
    session: {
      testId: null,
      currentQuestionIndex: 0,
      userAnswers: {},       // { [questionId]: selectedOptionIndex }
      markedForReview: {},   // { [questionId]: true/false }
      visitedQuestions: {},  // { [questionId]: true }
      timeRemainingSeconds: 180 * 60, // Default 180 mins = 10,800 secs
      timerInterval: null,
      isSubmitted: false
    },

    // Active Review Filter on Result Page
    resultFilter: 'all' // 'all' | 'correct' | 'incorrect' | 'skipped'
  };

  // --- 2. DOM Elements Cache ---
  const elements = {
    appContent: document.getElementById('app-content'),
    mobileMenuBtn: document.getElementById('mobile-menu-toggle'),
    mobileNavDrawer: document.getElementById('mobile-nav-drawer'),
    navTestSeriesBtn: document.getElementById('nav-test-series-btn'),
    mobileTestSeriesLink: document.getElementById('mobile-test-series-link'),
    submitModal: document.getElementById('submit-modal'),
    modalResumeBtn: document.getElementById('modal-resume-btn'),
    modalConfirmBtn: document.getElementById('modal-confirm-btn')
  };

  // --- 3. Storage Helpers ---
  const STORAGE_KEYS = {
    activeSession: (testId) => `ee_active_session_${testId}`,
    testResult: (testId) => `ee_test_result_${testId}`
  };

  function saveActiveSession() {
    if (!state.session.testId || state.session.isSubmitted) return;
    const dataToSave = {
      testId: state.session.testId,
      currentQuestionIndex: state.session.currentQuestionIndex,
      userAnswers: state.session.userAnswers,
      markedForReview: state.session.markedForReview,
      visitedQuestions: state.session.visitedQuestions,
      timeRemainingSeconds: state.session.timeRemainingSeconds,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.activeSession(state.session.testId), JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadActiveSession(testId) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.activeSession(testId));
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
      return null;
    }
  }

  function clearActiveSession(testId) {
    try {
      localStorage.removeItem(STORAGE_KEYS.activeSession(testId));
    } catch (e) {
      console.warn('LocalStorage clear failed:', e);
    }
  }

  function saveTestResult(testId, resultData) {
    try {
      localStorage.setItem(STORAGE_KEYS.testResult(testId), JSON.stringify(resultData));
    } catch (e) {
      console.warn('LocalStorage save result failed:', e);
    }
  }

  function loadTestResult(testId) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.testResult(testId));
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage load result failed:', e);
      return null;
    }
  }

  // --- 4. Timer Engine ---

  function startTimer() {
    stopTimer();
    updateTimerDisplay();

    state.session.timerInterval = setInterval(() => {
      if (state.session.timeRemainingSeconds > 0) {
        state.session.timeRemainingSeconds--;
        updateTimerDisplay();

        // Auto-save every 5 seconds to reduce write frequency
        if (state.session.timeRemainingSeconds % 5 === 0) {
          saveActiveSession();
        }
      } else {
        // Time expired! Auto-submit the test
        stopTimer();
        alert('Time is up! Your test will now be submitted automatically.');
        finishTest();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.session.timerInterval) {
      clearInterval(state.session.timerInterval);
      state.session.timerInterval = null;
    }
  }

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  function updateTimerDisplay() {
    const timerElem = document.getElementById('cbt-timer');
    if (timerElem) {
      timerElem.textContent = formatTime(state.session.timeRemainingSeconds);
      if (state.session.timeRemainingSeconds < 300) {
        timerElem.style.color = '#dc2626';
        timerElem.parentElement.style.borderColor = '#f87171';
        timerElem.parentElement.style.background = '#fef2f2';
      }
    }
  }

  // Debug Hook: Allows rapid testing of timer and submission
  window.__setTestTimer = function (seconds) {
    state.session.timeRemainingSeconds = parseInt(seconds, 10);
    updateTimerDisplay();
    saveActiveSession();
    console.log(`[Debug Hook] Test timer manually set to ${seconds} seconds.`);
  };

  // --- 5. CBT Question & Palette Helpers ---

  function getTestQuestions(testId) {
    return TEST_SERIES_DATA.demoQuestions || [];
  }

  function getQuestionStatus(qId, index) {
    const isAnswered = state.session.userAnswers[qId] !== undefined && state.session.userAnswers[qId] !== null;
    const isMarked = !!state.session.markedForReview[qId];
    const isVisited = !!state.session.visitedQuestions[qId];

    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  }

  // --- 6. View Renderers ---

  /**
   * Screen 1: Test Series Landing Page
   */
  function renderLandingView() {
    const info = TEST_SERIES_DATA.seriesInfo;

    return `
      <section class="hero-section">
        <div class="container">
          <div class="hero-pill">
            <span>✨</span> MHT-CET PCM 2026–27 Test Series
          </div>

          <h1 class="hero-title">
            Prepare Smarter. Test Better. <span class="gradient-text">Score Higher.</span>
          </h1>

          <p class="hero-description">
            A structured preparation module designed for Maharashtra CET engineering aspirants. Master your syllabus through 12 focused unit tests and 5 full-syllabus prelim examinations under realistic test conditions.
          </p>

          <div class="hero-actions">
            <a href="#dashboard" class="btn btn-primary" id="explore-tests-btn">
              Explore Tests (17 Total) →
            </a>
            <a href="#dashboard" class="btn btn-secondary">
              View Test Schedule
            </a>
          </div>

          <!-- Key Statistics Ribbon -->
          <div class="stats-ribbon">
            <div class="stat-box">
              <div class="stat-value">17</div>
              <div class="stat-label">Total Mock Tests</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">12</div>
              <div class="stat-label">Unit Tests (UT1 - UT12)</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">5</div>
              <div class="stat-label">Full Prelims</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">200</div>
              <div class="stat-label">Marks / 180 Minutes</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Preparation Roadmap Section -->
      <section class="roadmap-section">
        <div class="container">
          <div class="section-header">
            <div class="section-subtitle">Structured Preparation Roadmap</div>
            <h2 class="section-title">Your Step-by-Step Path to Engineering Admission</h2>
          </div>

          <div class="roadmap-grid">
            <div class="roadmap-card">
              <div class="roadmap-step">01</div>
              <h3>Unit-wise Practice</h3>
              <p>Master fundamental concepts topic-by-topic across Physics, Chemistry, and Mathematics through 12 focused Unit Tests aligned with the curriculum.</p>
            </div>

            <div class="roadmap-card">
              <div class="roadmap-step">02</div>
              <h3>Progressive Preparation</h3>
              <p>Pinpoint knowledge gaps after every attempt, analyze question solutions, and build time-management confidence with dynamic performance tracking.</p>
            </div>

            <div class="roadmap-card">
              <div class="roadmap-step">03</div>
              <h3>Full-Syllabus Prelims</h3>
              <p>Simulate the pressure of the actual exam with 5 comprehensive Prelims covering the entire Class 11 and Class 12 PCM syllabus under 180-minute timers.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Test Series Section -->
      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <div class="section-subtitle">Why EnrollEngineer Test Series?</div>
            <h2 class="section-title">Engineered for Academic Excellence</h2>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon-wrapper">💻</div>
              <h3>Authentic CBT Interface</h3>
              <p>Practice with realistic test navigation, interactive question palette, timer controls, and review flags to get familiar with test-day environments.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrapper">🎯</div>
              <h3>Syllabus-Aligned Coverage</h3>
              <p>Every test is mapped to the exact prescribed chapters for Maharashtra State Board and entrance syllabus across Physics, Chemistry, and Mathematics.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrapper">📊</div>
              <h3>Dynamic Performance Review</h3>
              <p>Instant scoring, accuracy percentages, subject-level breakdowns, and comprehensive step-by-step explanatory solutions for every single question.</p>
            </div>
          </div>

          <!-- Bottom CTA Banner -->
          <div style="margin-top: 50px; background: var(--gradient-brand-subtle); border: 1px solid rgba(79, 70, 229, 0.2); border-radius: var(--radius-xl); padding: 36px; text-align: center;">
            <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--color-navy); margin-bottom: 10px;">
              Ready to evaluate your MHT-CET PCM readiness?
            </h3>
            <p style="color: var(--color-muted); margin-bottom: 22px; max-width: 580px; margin-left: auto; margin-right: auto; font-size: 0.95rem;">
              Start with Unit Test 1 (Rotational Dynamics, Motion in Plane, Solid State & Logic) or browse the full test series catalog.
            </p>
            <a href="#dashboard" class="btn btn-primary">Go to Test Dashboard →</a>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Screen 2: Test Series Dashboard
   */
  function renderDashboardView() {
    const tests = TEST_SERIES_DATA.tests;

    // Filter tests based on category and search query
    const filteredTests = tests.filter(test => {
      const matchesCategory =
        state.filterCategory === 'all' ||
        (state.filterCategory === 'unit' && test.type === 'unit') ||
        (state.filterCategory === 'prelim' && test.type === 'prelim');

      const q = state.searchQuery.toLowerCase();
      const matchesSearch =
        test.id.toLowerCase().includes(q) ||
        test.name.toLowerCase().includes(q) ||
        test.physicsSyllabus.toLowerCase().includes(q) ||
        test.chemistrySyllabus.toLowerCase().includes(q) ||
        test.mathsSyllabus.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    const testCardsHtml = filteredTests.map(test => {
      const pastResult = loadTestResult(test.id);
      const isCompleted = !!pastResult;

      return `
        <div class="test-card ${test.type === 'unit' ? 'type-unit' : 'type-prelim'}" data-testid="${test.id}">
          <div>
            <div class="test-card-top">
              <span class="badge ${test.type === 'unit' ? 'badge-unit' : 'badge-prelim'}">
                ${test.category}
              </span>
              <span class="badge ${isCompleted ? 'badge-available' : 'badge-unit'}" style="${isCompleted ? 'background: #dcfce7; color: #15803d;' : ''}">
                ${isCompleted ? '✓ Completed' : 'Available'}
              </span>
            </div>

            <h3 class="test-card-title">${test.name}</h3>

            <div class="test-meta-pills">
              <span class="test-meta-pill">⏱ ${test.durationMinutes} Mins</span>
              <span class="test-meta-pill">🎯 ${test.totalMarks} Marks</span>
            </div>

            <div style="font-size: 0.84rem; color: var(--color-slate); line-height: 1.45; margin-bottom: 18px; background: var(--bg-subtle); padding: 10px 12px; border-radius: var(--radius-sm);">
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">
                <strong style="color: var(--color-blue);">P:</strong> ${test.physicsSyllabus}
              </div>
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <strong style="color: #059669;">C:</strong> ${test.chemistrySyllabus}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: auto;">
            <a href="#details/${test.id}" class="btn btn-secondary view-details-link" style="flex: 1; padding: 8px 12px; font-size: 0.86rem; min-height: 40px;">
              View Details
            </a>
            <a href="#test/${test.id}" class="btn btn-primary start-test-link" style="flex: 1; padding: 8px 12px; font-size: 0.86rem; min-height: 40px;">
              ${isCompleted ? 'Retake' : 'Start Test'}
            </a>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="container" style="padding: 40px 24px;">
        <div class="dashboard-header-bar">
          <div>
            <h1 style="font-size: 2rem; font-weight: 800; color: var(--color-navy); margin-bottom: 6px;">
              MHT-CET PCM 2026–27 Test Dashboard
            </h1>
            <p style="color: var(--color-muted); font-size: 0.95rem;">
              Structured practice module featuring 12 unit tests and 5 full-syllabus prelims designed for engineering entrance excellence.
            </p>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
            <!-- Category Tabs -->
            <div class="filter-tabs" role="tablist">
              <button class="filter-tab ${state.filterCategory === 'all' ? 'active' : ''}" data-category="all" role="tab" aria-selected="${state.filterCategory === 'all'}">
                All Tests (17)
              </button>
              <button class="filter-tab ${state.filterCategory === 'unit' ? 'active' : ''}" data-category="unit" role="tab" aria-selected="${state.filterCategory === 'unit'}">
                Unit Tests (12)
              </button>
              <button class="filter-tab ${state.filterCategory === 'prelim' ? 'active' : ''}" data-category="prelim" role="tab" aria-selected="${state.filterCategory === 'prelim'}">
                Prelims (5)
              </button>
            </div>

            <!-- Search Bar -->
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                class="search-input" 
                id="dashboard-search-input"
                placeholder="Search test name, ID, or chapter..." 
                value="${state.searchQuery}"
                aria-label="Search tests by name, ID or syllabus topic"
              />
            </div>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="test-cards-grid">
          ${testCardsHtml || '<div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); color: var(--color-muted);">No matching tests found. Try adjusting your search query.</div>'}
        </div>
      </div>
    `;
  }

  /**
   * Screen 3: Test Details Page
   */
  function renderDetailsView(testId) {
    const test = TEST_SERIES_DATA.tests.find(t => t.id === testId) || TEST_SERIES_DATA.tests[0];

    return `
      <div class="container details-container">
        <a href="#dashboard" style="display: inline-flex; align-items: center; gap: 6px; color: var(--color-blue); font-weight: 600; font-size: 0.9rem; margin-bottom: 20px;">
          ← Back to Tests
        </a>

        <div class="card" style="padding: 34px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 22px;">
            <div>
              <span class="badge ${test.type === 'unit' ? 'badge-unit' : 'badge-prelim'}" style="margin-bottom: 8px;">
                ${test.category} • MHT-CET PCM 2026-27
              </span>
              <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--color-navy); margin-top: 4px; line-height: 1.2;">
                ${test.name}
              </h1>
            </div>

            <div style="display: flex; gap: 14px;">
              <div style="background: var(--bg-subtle); padding: 12px 18px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-light);">
                <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-blue);">${test.totalMarks}</div>
                <div style="font-size: 0.72rem; color: var(--color-muted); font-weight: 700; letter-spacing: 0.04em;">TOTAL MARKS</div>
              </div>
              <div style="background: var(--bg-subtle); padding: 12px 18px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-light);">
                <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-purple);">${test.durationMinutes} min</div>
                <div style="font-size: 0.72rem; color: var(--color-muted); font-weight: 700; letter-spacing: 0.04em;">DURATION</div>
              </div>
            </div>
          </div>

          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-navy); margin-top: 24px;">
            Prescribed Syllabus Breakdown
          </h3>

          <div class="syllabus-grid">
            <div class="syllabus-card physics">
              <h4>⚛️ Physics Syllabus</h4>
              <p>${test.physicsSyllabus}</p>
            </div>

            <div class="syllabus-card chemistry">
              <h4>🧪 Chemistry Syllabus</h4>
              <p>${test.chemistrySyllabus}</p>
            </div>

            <div class="syllabus-card maths">
              <h4>📐 Mathematics Syllabus</h4>
              <p>${test.mathsSyllabus}</p>
            </div>
          </div>

          <div style="background: var(--gradient-brand-subtle); border: 1px solid rgba(79, 70, 229, 0.2); border-radius: var(--radius-md); padding: 22px; margin-bottom: 30px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-navy); margin-bottom: 8px;">
              Instructions & Test Guidelines
            </h4>
            <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--color-slate); line-height: 1.65;">
              <li>The test will automatically count down from <strong>${test.durationMinutes} minutes</strong> upon launch.</li>
              <li>Navigate between questions using <strong>Previous</strong>, <strong>Save & Next</strong>, or the <strong>Question Palette</strong>.</li>
              <li>You may flag questions using <strong>Mark for Review & Next</strong> to revisit them before submission.</li>
              <li>Your responses are saved continuously in your session. Please do not close your browser tab until finished.</li>
            </ul>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <a href="#dashboard" class="btn btn-secondary">
              ← Return to Dashboard
            </a>
            <a href="#test/${test.id}" class="btn btn-primary" id="start-test-btn" style="padding: 12px 34px; font-size: 1.05rem;">
              Start Test Now →
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Screen 4: CBT Test Taking Interface
   */
  function renderTestView(testId) {
    const test = TEST_SERIES_DATA.tests.find(t => t.id === testId) || TEST_SERIES_DATA.tests[0];
    const questions = getTestQuestions(testId);
    const qIndex = state.session.currentQuestionIndex;
    const currentQ = questions[qIndex] || questions[0];

    // Mark current question as visited
    if (currentQ) {
      state.session.visitedQuestions[currentQ.id] = true;
    }

    // Palette counts
    let answeredCount = 0;
    let notAnsweredCount = 0;
    let markedCount = 0;
    let notVisitedCount = 0;

    questions.forEach((q, idx) => {
      const status = getQuestionStatus(q.id, idx);
      if (status === 'answered') answeredCount++;
      else if (status === 'marked') markedCount++;
      else if (status === 'not-answered') notAnsweredCount++;
      else notVisitedCount++;
    });

    const selectedOption = currentQ ? state.session.userAnswers[currentQ.id] : undefined;

    return `
      <div class="container" style="padding: 15px 24px;">
        <!-- Top CBT Bar -->
        <div class="cbt-top-bar">
          <div>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-blue); text-transform: uppercase; letter-spacing: 0.05em;">
              MHT-CET PCM 2026-27
            </span>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--color-navy); margin-top: 2px;">
              ${test.name}
            </h2>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="timer-badge" aria-label="Time Remaining">
              <span>⏱</span>
              <span id="cbt-timer">${formatTime(state.session.timeRemainingSeconds)}</span>
            </div>
            <button class="btn btn-primary" id="cbt-submit-btn" style="padding: 8px 22px; font-size: 0.9rem; min-height: 40px;">
              Submit Test
            </button>
          </div>
        </div>

        <!-- Mobile Palette Toggle Bar (Visible only on tablets & phones) -->
        <div class="mobile-palette-toggle-bar">
          <button id="mobile-palette-toggle-btn" class="btn btn-secondary" style="width: 100%; font-size: 0.88rem; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>📋</span>
            <span>${state.mobilePaletteOpen ? 'Hide Question Palette' : `View Question Palette (${questions.length} Questions)`}</span>
          </button>
        </div>

        <!-- Main CBT Layout -->
        <div class="cbt-container">
          <!-- Question Arena -->
          <div class="cbt-question-arena">
            <div>
              <div class="question-header">
                <span style="font-weight: 700; color: var(--color-navy); font-size: 1rem;">
                  Question ${qIndex + 1} of ${questions.length}
                </span>
                <span class="badge badge-unit">${currentQ.subject}</span>
              </div>

              <div class="question-text">
                ${currentQ.question}
              </div>

              <div class="options-list" id="cbt-options-list" role="radiogroup" aria-label="Question Options">
                ${currentQ.options.map((opt, i) => `
                  <div 
                    class="option-item ${selectedOption === i ? 'selected' : ''}" 
                    data-opt-index="${i}"
                    tabindex="0"
                    role="radio"
                    aria-checked="${selectedOption === i}"
                    aria-label="Option ${String.fromCharCode(65 + i)}: ${opt}"
                  >
                    <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                    <span style="flex: 1;">${opt}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action Bar -->
            <div class="cbt-action-bar">
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary" id="btn-clear-response" style="font-size: 0.85rem; padding: 8px 14px; min-height: 40px;">
                  Clear Response
                </button>
                <button class="btn btn-outline" id="btn-mark-review" style="font-size: 0.85rem; padding: 8px 14px; min-height: 40px;">
                  Mark for Review & Next
                </button>
              </div>

              <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary" id="btn-prev-question" style="font-size: 0.85rem; padding: 8px 16px; min-height: 40px;" ${qIndex === 0 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                  ← Previous
                </button>
                <button class="btn btn-primary" id="btn-save-next" style="font-size: 0.85rem; padding: 8px 20px; min-height: 40px;">
                  ${qIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next →'}
                </button>
              </div>
            </div>
          </div>

          <!-- Question Palette Side Panel -->
          <div class="cbt-palette-panel ${state.mobilePaletteOpen ? 'mobile-open' : ''}">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; color: var(--color-navy);">
              Question Palette
            </h4>

            <div class="palette-legend">
              <div class="legend-item">
                <span class="legend-dot answered"></span>
                <span>Answered (${answeredCount})</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot not-answered"></span>
                <span>Unanswered (${notAnsweredCount})</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot marked"></span>
                <span>Review (${markedCount})</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot not-visited"></span>
                <span>Not Visited (${notVisitedCount})</span>
              </div>
            </div>

            <div class="palette-grid">
              ${questions.map((q, idx) => {
                const status = getQuestionStatus(q.id, idx);
                const isCurrent = idx === qIndex;
                return `
                  <button 
                    class="palette-btn ${status} ${isCurrent ? 'current' : ''}" 
                    data-q-index="${idx}"
                    title="Jump to Question ${idx + 1} (${status})"
                    aria-label="Question ${idx + 1}, status ${status}"
                  >
                    ${idx + 1}
                  </button>
                `;
              }).join('')}
            </div>

            <div style="margin-top: auto; padding-top: 20px;">
              <button id="palette-finish-btn" class="btn btn-outline" style="width: 100%; font-size: 0.85rem; min-height: 40px;">
                Submit Test →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Screen 5: Result & Performance Analysis Page
   */
  function renderResultView(testId) {
    const test = TEST_SERIES_DATA.tests.find(t => t.id === testId) || TEST_SERIES_DATA.tests[0];
    const questions = getTestQuestions(testId);
    const result = loadTestResult(testId);

    if (!result) {
      return `
        <div class="container" style="max-width: 900px; padding: 60px 24px; text-align: center;">
          <div class="card" style="padding: 40px;">
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy); margin-bottom: 12px;">
              No Result Found for ${test.name}
            </h2>
            <p style="color: var(--color-muted); margin-bottom: 24px;">
              You have not submitted this test yet. Start an attempt to view your comprehensive score.
            </p>
            <a href="#test/${test.id}" class="btn btn-primary">Start Test Now</a>
          </div>
        </div>
      `;
    }

    // Filter review questions
    const filteredQuestions = questions.filter(q => {
      const userChoice = result.userAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      const isSkipped = userChoice === undefined || userChoice === null;

      if (state.resultFilter === 'correct') return isCorrect;
      if (state.resultFilter === 'incorrect') return !isCorrect && !isSkipped;
      if (state.resultFilter === 'skipped') return isSkipped;
      return true;
    });

    return `
      <div class="container" style="max-width: 960px; padding: 40px 24px;">
        <!-- Header Scorecard -->
        <div class="card" style="padding: 36px; text-align: center; margin-bottom: 30px;">
          <span class="badge badge-available" style="margin-bottom: 12px; background: #dcfce7; color: #15803d;">
            ✓ Test Successfully Submitted
          </span>
          <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--color-navy); margin-bottom: 6px;">
            Performance Analysis
          </h1>
          <p style="color: var(--color-muted); font-size: 0.95rem; margin-bottom: 28px;">
            ${test.name} • MHT-CET PCM 2026-27
          </p>

          <!-- Metrics Ribbon -->
          <div class="stats-ribbon" style="margin-bottom: 30px;">
            <div class="stat-box">
              <div class="stat-value" style="color: var(--color-blue);">
                ${result.totalScore} / ${test.totalMarks}
              </div>
              <div class="stat-label">Total Score</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color: ${result.accuracy >= 70 ? 'var(--status-answered)' : 'var(--status-warning)'};">
                ${result.accuracy}%
              </div>
              <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color: var(--status-answered);">
                ${result.correctCount}
              </div>
              <div class="stat-label">Correct Answers</div>
            </div>
            <div class="stat-box">
              <div class="stat-value" style="color: var(--status-not-answered);">
                ${result.incorrectCount}
              </div>
              <div class="stat-label">Incorrect Answers</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="retake-test-btn">
              ↻ Retake Test
            </button>
            <a href="#dashboard" class="btn btn-primary">
              Back to Dashboard
            </a>
          </div>
        </div>

        <!-- Subject-Wise Performance Table with Progress Bars -->
        <div class="card" style="padding: 28px; margin-bottom: 30px;">
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-navy); margin-bottom: 16px;">
            Subject-Wise Performance
          </h3>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-light); color: var(--color-muted);">
                  <th style="padding: 10px;">Subject</th>
                  <th style="padding: 10px;">Questions</th>
                  <th style="padding: 10px; color: var(--status-answered);">Correct</th>
                  <th style="padding: 10px; color: var(--status-not-answered);">Incorrect</th>
                  <th style="padding: 10px;">Skipped</th>
                  <th style="padding: 10px; width: 180px;">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                ${Object.keys(result.subjectBreakdown).map(subj => {
                  const s = result.subjectBreakdown[subj];
                  const barColor = s.accuracy >= 70 ? 'var(--status-answered)' : s.accuracy >= 40 ? 'var(--status-warning)' : 'var(--status-not-answered)';
                  return `
                    <tr style="border-bottom: 1px solid var(--border-light);">
                      <td style="padding: 14px 10px; font-weight: 700; color: var(--color-navy);">${subj}</td>
                      <td style="padding: 14px 10px;">${s.total}</td>
                      <td style="padding: 14px 10px; font-weight: 700; color: var(--status-answered);">${s.correct}</td>
                      <td style="padding: 14px 10px; font-weight: 700; color: var(--status-not-answered);">${s.incorrect}</td>
                      <td style="padding: 14px 10px; color: var(--color-muted);">${s.skipped}</td>
                      <td style="padding: 14px 10px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                          <span>${s.accuracy}%</span>
                        </div>
                        <div class="progress-bar-container">
                          <div class="progress-bar-fill" style="width: ${s.accuracy}%; background: ${barColor};"></div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Question-by-Question Review Section -->
        <div class="card" style="padding: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 24px;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-navy);">
              Detailed Question Review
            </h3>

            <!-- Review Filter Buttons -->
            <div class="filter-tabs" role="tablist">
              <button class="filter-tab ${state.resultFilter === 'all' ? 'active' : ''}" data-review-filter="all" role="tab">
                All (${questions.length})
              </button>
              <button class="filter-tab ${state.resultFilter === 'correct' ? 'active' : ''}" data-review-filter="correct" role="tab">
                Correct (${result.correctCount})
              </button>
              <button class="filter-tab ${state.resultFilter === 'incorrect' ? 'active' : ''}" data-review-filter="incorrect" role="tab">
                Incorrect (${result.incorrectCount})
              </button>
              <button class="filter-tab ${state.resultFilter === 'skipped' ? 'active' : ''}" data-review-filter="skipped" role="tab">
                Skipped (${result.skippedCount})
              </button>
            </div>
          </div>

          <!-- Review Questions List -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${filteredQuestions.map((q, idx) => {
              const userChoice = result.userAnswers[q.id];
              const isCorrect = userChoice === q.correctAnswer;
              const isSkipped = userChoice === undefined || userChoice === null;

              let statusBadge = '';
              if (isCorrect) {
                statusBadge = '<span class="badge" style="background:#dcfce7;color:#15803d;">✓ Correct</span>';
              } else if (isSkipped) {
                statusBadge = '<span class="badge" style="background:#f1f5f9;color:#64748b;">— Skipped</span>';
              } else {
                statusBadge = '<span class="badge" style="background:#fee2e2;color:#b91c1c;">✗ Incorrect</span>';
              }

              return `
                <div style="border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 22px; background: #fafafa;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--color-navy);">
                      Question ${q.id} (${q.subject})
                    </span>
                    ${statusBadge}
                  </div>

                  <p style="font-size: 1rem; color: var(--color-navy); margin-bottom: 16px; line-height: 1.55;">
                    ${q.question}
                  </p>

                  <!-- Options Review -->
                  <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                    ${q.options.map((opt, optIdx) => {
                      const isUserChoice = userChoice === optIdx;
                      const isKey = q.correctAnswer === optIdx;

                      let itemStyle = 'padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); background: #ffffff; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;';

                      if (isKey) {
                        itemStyle = 'padding: 10px 14px; border-radius: var(--radius-sm); border: 1.5px solid #16a34a; background: #f0fdf4; color: #166534; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;';
                      } else if (isUserChoice && !isCorrect) {
                        itemStyle = 'padding: 10px 14px; border-radius: var(--radius-sm); border: 1.5px solid #dc2626; background: #fef2f2; color: #991b1b; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;';
                      }

                      return `
                        <div style="${itemStyle}">
                          <span>${String.fromCharCode(65 + optIdx)}. ${opt}</span>
                          ${isKey ? '<span style="font-size: 0.78rem; font-weight: 700; color: #16a34a;">✓ Correct Answer</span>' : ''}
                          ${isUserChoice && !isKey ? '<span style="font-size: 0.78rem; font-weight: 700; color: #dc2626;">Your Answer</span>' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <!-- Explanatory Solution -->
                  <div style="background: var(--bg-subtle); border-left: 3.5px solid var(--color-blue); padding: 12px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.88rem;">
                    <strong style="color: var(--color-blue); display: block; margin-bottom: 4px;">Explanation:</strong>
                    <span style="color: var(--color-slate); line-height: 1.55;">${q.explanation}</span>
                  </div>
                </div>
              `;
            }).join('') || '<div style="text-align: center; color: var(--color-muted); padding: 24px;">No questions match the selected filter.</div>'}
          </div>
        </div>
      </div>
    `;
  }

  // --- 7. Test Submission & Evaluation Engine ---

  function openSubmitModal() {
    const questions = getTestQuestions(state.session.testId);
    let answered = 0;
    let marked = 0;

    questions.forEach((q, idx) => {
      const status = getQuestionStatus(q.id, idx);
      if (status === 'answered') answered++;
      if (status === 'marked') marked++;
    });

    const unanswered = questions.length - answered;

    const summaryContent = document.getElementById('modal-summary-content');
    if (summaryContent) {
      summaryContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 4px;">
          <div style="background: var(--bg-card); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); text-align: center;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-navy);">${questions.length}</div>
            <div style="font-size: 0.72rem; color: var(--color-muted); font-weight: 700;">TOTAL QUESTIONS</div>
          </div>
          <div style="background: var(--status-answered-bg); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(22,163,74,0.2); text-align: center;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-answered);">${answered}</div>
            <div style="font-size: 0.72rem; color: #166534; font-weight: 700;">ANSWERED</div>
          </div>
          <div style="background: var(--status-marked-bg); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(124,58,237,0.2); text-align: center;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-marked);">${marked}</div>
            <div style="font-size: 0.72rem; color: #581c87; font-weight: 700;">MARKED FOR REVIEW</div>
          </div>
          <div style="background: var(--status-not-answered-bg); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(220,38,38,0.2); text-align: center;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-not-answered);">${unanswered}</div>
            <div style="font-size: 0.72rem; color: #991b1b; font-weight: 700;">UNANSWERED</div>
          </div>
        </div>
      `;
    }

    if (elements.submitModal) {
      elements.submitModal.classList.add('open');
    }
  }

  function finishTest() {
    stopTimer();
    state.session.isSubmitted = true;

    const testId = state.session.testId;
    const test = TEST_SERIES_DATA.tests.find(t => t.id === testId) || TEST_SERIES_DATA.tests[0];
    const questions = getTestQuestions(testId);

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const subjectBreakdown = {};

    questions.forEach(q => {
      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { total: 0, correct: 0, incorrect: 0, skipped: 0, accuracy: 0 };
      }
      subjectBreakdown[q.subject].total++;

      const userChoice = state.session.userAnswers[q.id];
      if (userChoice === undefined || userChoice === null) {
        skippedCount++;
        subjectBreakdown[q.subject].skipped++;
      } else if (userChoice === q.correctAnswer) {
        correctCount++;
        subjectBreakdown[q.subject].correct++;
      } else {
        incorrectCount++;
        subjectBreakdown[q.subject].incorrect++;
      }
    });

    Object.keys(subjectBreakdown).forEach(subj => {
      const s = subjectBreakdown[subj];
      const attempted = s.correct + s.incorrect;
      s.accuracy = attempted > 0 ? Math.round((s.correct / attempted) * 100) : 0;
    });

    const totalAttempted = correctCount + incorrectCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const totalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * test.totalMarks) : 0;

    const resultData = {
      testId: testId,
      totalQuestions: questions.length,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      skippedCount: skippedCount,
      totalScore: totalScore,
      accuracy: accuracy,
      userAnswers: { ...state.session.userAnswers },
      subjectBreakdown: subjectBreakdown,
      submittedAt: new Date().toISOString()
    };

    saveTestResult(testId, resultData);
    clearActiveSession(testId);

    if (elements.submitModal) {
      elements.submitModal.classList.remove('open');
    }

    window.location.hash = `#result/${testId}`;
  }

  // --- 8. Event Handlers ---

  function attachDashboardEvents() {
    const tabs = elements.appContent.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        state.filterCategory = this.dataset.category;
        elements.appContent.innerHTML = renderDashboardView();
        attachDashboardEvents();
      });
    });

    const searchInput = document.getElementById('dashboard-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        state.searchQuery = e.target.value;
        elements.appContent.innerHTML = renderDashboardView();
        attachDashboardEvents();
        const updatedInput = document.getElementById('dashboard-search-input');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.setSelectionRange(state.searchQuery.length, state.searchQuery.length);
        }
      });
    }
  }

  function attachTestEvents() {
    const questions = getTestQuestions(state.session.testId);
    const qIndex = state.session.currentQuestionIndex;
    const currentQ = questions[qIndex];

    // Mobile Palette Toggle Button
    const mobilePaletteToggleBtn = document.getElementById('mobile-palette-toggle-btn');
    if (mobilePaletteToggleBtn) {
      mobilePaletteToggleBtn.addEventListener('click', () => {
        state.mobilePaletteOpen = !state.mobilePaletteOpen;
        const palettePanel = elements.appContent.querySelector('.cbt-palette-panel');
        if (palettePanel) {
          palettePanel.classList.toggle('mobile-open', state.mobilePaletteOpen);
        }
        mobilePaletteToggleBtn.querySelector('span:last-child').textContent = state.mobilePaletteOpen
          ? 'Hide Question Palette'
          : `View Question Palette (${questions.length} Questions)`;
      });
    }

    // Option selection (Click and Keyboard Enter/Space)
    const optionItems = elements.appContent.querySelectorAll('.option-item');
    optionItems.forEach(item => {
      const selectOption = () => {
        const optIndex = parseInt(item.dataset.optIndex, 10);
        state.session.userAnswers[currentQ.id] = optIndex;

        optionItems.forEach(opt => {
          opt.classList.remove('selected');
          opt.setAttribute('aria-checked', 'false');
        });
        item.classList.add('selected');
        item.setAttribute('aria-checked', 'true');

        saveActiveSession();
      };

      item.addEventListener('click', selectOption);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectOption();
        }
      });
    });

    // Clear Response
    const clearBtn = document.getElementById('btn-clear-response');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        delete state.session.userAnswers[currentQ.id];
        delete state.session.markedForReview[currentQ.id];
        saveActiveSession();

        elements.appContent.innerHTML = renderTestView(state.session.testId);
        attachTestEvents();
      });
    }

    // Mark for Review & Next
    const markReviewBtn = document.getElementById('btn-mark-review');
    if (markReviewBtn) {
      markReviewBtn.addEventListener('click', () => {
        state.session.markedForReview[currentQ.id] = true;
        saveActiveSession();

        if (qIndex < questions.length - 1) {
          state.session.currentQuestionIndex++;
        }
        elements.appContent.innerHTML = renderTestView(state.session.testId);
        attachTestEvents();
      });
    }

    // Previous Question
    const prevBtn = document.getElementById('btn-prev-question');
    if (prevBtn && qIndex > 0) {
      prevBtn.addEventListener('click', () => {
        saveActiveSession();
        state.session.currentQuestionIndex--;
        elements.appContent.innerHTML = renderTestView(state.session.testId);
        attachTestEvents();
      });
    }

    // Save & Next
    const saveNextBtn = document.getElementById('btn-save-next');
    if (saveNextBtn) {
      saveNextBtn.addEventListener('click', () => {
        delete state.session.markedForReview[currentQ.id];
        saveActiveSession();

        if (qIndex < questions.length - 1) {
          state.session.currentQuestionIndex++;
          elements.appContent.innerHTML = renderTestView(state.session.testId);
          attachTestEvents();
        } else {
          openSubmitModal();
        }
      });
    }

    // Palette Buttons
    const paletteButtons = elements.appContent.querySelectorAll('.palette-btn');
    paletteButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetIndex = parseInt(this.dataset.qIndex, 10);
        if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < questions.length) {
          saveActiveSession();
          state.session.currentQuestionIndex = targetIndex;
          elements.appContent.innerHTML = renderTestView(state.session.testId);
          attachTestEvents();
        }
      });
    });

    // Submit Buttons
    const submitBtn = document.getElementById('cbt-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', openSubmitModal);
    }
    const paletteFinishBtn = document.getElementById('palette-finish-btn');
    if (paletteFinishBtn) {
      paletteFinishBtn.addEventListener('click', openSubmitModal);
    }
  }

  function attachResultEvents(testId) {
    const retakeBtn = document.getElementById('retake-test-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        clearActiveSession(testId);
        try {
          localStorage.removeItem(STORAGE_KEYS.testResult(testId));
        } catch (e) {}

        state.session = {
          testId: testId,
          currentQuestionIndex: 0,
          userAnswers: {},
          markedForReview: {},
          visitedQuestions: {},
          timeRemainingSeconds: 180 * 60,
          timerInterval: null,
          isSubmitted: false
        };

        window.location.hash = `#test/${testId}`;
      });
    }

    const filterTabs = elements.appContent.querySelectorAll('[data-review-filter]');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        state.resultFilter = this.dataset.reviewFilter;
        elements.appContent.innerHTML = renderResultView(testId);
        attachResultEvents(testId);
      });
    });
  }

  // --- 9. Router & View Switcher ---

  function parseHash() {
    const hash = window.location.hash.slice(1) || 'landing';
    const parts = hash.split('/');
    return {
      view: parts[0] || 'landing',
      param: parts[1] || 'UT1'
    };
  }

  function handleRoute() {
    const { view, param } = parseHash();
    state.currentRoute = view;
    state.activeTestId = param;

    window.scrollTo(0, 0);

    if (state.mobileMenuOpen) {
      toggleMobileMenu(false);
    }

    if (view !== 'test') {
      stopTimer();
    }

    switch (view) {
      case 'landing':
        elements.appContent.innerHTML = renderLandingView();
        break;

      case 'dashboard':
        elements.appContent.innerHTML = renderDashboardView();
        attachDashboardEvents();
        break;

      case 'details':
        elements.appContent.innerHTML = renderDetailsView(param);
        break;

      case 'test':
        initializeOrResumeTestSession(param);
        elements.appContent.innerHTML = renderTestView(param);
        attachTestEvents();
        startTimer();
        break;

      case 'result':
        elements.appContent.innerHTML = renderResultView(param);
        attachResultEvents(param);
        break;

      default:
        elements.appContent.innerHTML = renderLandingView();
        break;
    }

    updateNavHighlight(view);
  }

  function initializeOrResumeTestSession(testId) {
    if (state.session.testId === testId && !state.session.isSubmitted && state.session.timerInterval) {
      return;
    }

    const savedSession = loadActiveSession(testId);
    if (savedSession && savedSession.testId === testId) {
      state.session = {
        testId: testId,
        currentQuestionIndex: savedSession.currentQuestionIndex || 0,
        userAnswers: savedSession.userAnswers || {},
        markedForReview: savedSession.markedForReview || {},
        visitedQuestions: savedSession.visitedQuestions || {},
        timeRemainingSeconds: typeof savedSession.timeRemainingSeconds === 'number' ? savedSession.timeRemainingSeconds : 180 * 60,
        timerInterval: null,
        isSubmitted: false
      };
      return;
    }

    state.session = {
      testId: testId,
      currentQuestionIndex: 0,
      userAnswers: {},
      markedForReview: {},
      visitedQuestions: {},
      timeRemainingSeconds: 180 * 60,
      timerInterval: null,
      isSubmitted: false
    };
  }

  function updateNavHighlight(view) {
    if (elements.navTestSeriesBtn) {
      elements.navTestSeriesBtn.classList.add('active');
    }
  }

  function toggleMobileMenu(forceState) {
    state.mobileMenuOpen = forceState !== undefined ? forceState : !state.mobileMenuOpen;
    if (elements.mobileNavDrawer) {
      elements.mobileNavDrawer.classList.toggle('open', state.mobileMenuOpen);
    }
    if (elements.mobileMenuBtn) {
      elements.mobileMenuBtn.textContent = state.mobileMenuOpen ? '✕' : '☰';
      elements.mobileMenuBtn.setAttribute('aria-expanded', String(state.mobileMenuOpen));
    }
  }

  // --- 10. Application Initialization ---
  function init() {
    if (elements.mobileMenuBtn) {
      elements.mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
    }

    if (elements.modalResumeBtn) {
      elements.modalResumeBtn.addEventListener('click', () => {
        if (elements.submitModal) {
          elements.submitModal.classList.remove('open');
        }
      });
    }

    if (elements.modalConfirmBtn) {
      elements.modalConfirmBtn.addEventListener('click', () => {
        finishTest();
      });
    }

    if (elements.submitModal) {
      elements.submitModal.addEventListener('click', (e) => {
        if (e.target === elements.submitModal) {
          elements.submitModal.classList.remove('open');
        }
      });
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
