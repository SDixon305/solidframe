'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Award, HelpCircle } from 'lucide-react'

export interface QuizQuestion {
    id: string
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}

interface QuizInterfaceProps {
    moduleId: string
    moduleName: string
    questions: QuizQuestion[]
    onComplete: (score: number, total: number) => void
    onClose: () => void
}

export default function QuizInterface({
    moduleId,
    moduleName,
    questions,
    onComplete,
    onClose,
}: QuizInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null) return // Already answered

        setSelectedAnswer(index)
        setShowExplanation(true)

        const newAnswers = [...answers]
        newAnswers[currentIndex] = index
        setAnswers(newAnswers)

        if (index === currentQuestion.correctIndex) {
            setScore(score + 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        } else {
            setIsComplete(true)
            onComplete(score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0), questions.length)
        }
    }

    const handleRetry = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setScore(0)
        setIsComplete(false)
        setAnswers(new Array(questions.length).fill(null))
    }

    const finalScore = score + (selectedAnswer === currentQuestion?.correctIndex ? 1 : 0)
    const percentage = Math.round((finalScore / questions.length) * 100)
    const passed = percentage >= 70

    if (isComplete) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-lg mx-auto">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    passed ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                    {passed ? (
                        <Award size={40} className="text-emerald-600" />
                    ) : (
                        <RotateCcw size={40} className="text-amber-600" />
                    )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <p className="text-gray-500 mb-6">
                    {passed
                        ? `You passed the ${moduleName} quiz!`
                        : `You need 70% to pass. Let's try again!`
                    }
                </p>

                <div className="text-5xl font-bold mb-2" style={{ color: passed ? '#10b981' : '#f59e0b' }}>
                    {percentage}%
                </div>
                <p className="text-gray-500 mb-8">
                    {finalScore} of {questions.length} correct
                </p>

                <div className="flex justify-center gap-3">
                    {!passed && (
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#5f3bff] text-white rounded-lg font-medium hover:bg-[#4f2fe0] transition-colors"
                        >
                            <RotateCcw size={18} />
                            Try Again
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                            passed
                                ? 'bg-[#5f3bff] text-white hover:bg-[#4f2fe0]'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {passed ? 'Continue' : 'Back to Module'}
                    </button>
                </div>

                {/* Demo notice */}
                <p className="text-xs text-gray-400 mt-6">
                    Demo Mode - Quiz results are not saved
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-2xl mx-auto">
            {/* Progress header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{moduleName}</span>
                    <span className="text-sm text-gray-500">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#5f3bff] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                    <div className="p-2 bg-[#5f3bff]/10 rounded-lg shrink-0">
                        <HelpCircle size={20} className="text-[#5f3bff]" />
                    </div>
                    <p className="text-lg text-gray-900 font-medium">{currentQuestion.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index
                        const isCorrect = index === currentQuestion.correctIndex
                        const showResult = selectedAnswer !== null

                        let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 '

                        if (showResult) {
                            if (isCorrect) {
                                buttonClass += 'border-emerald-500 bg-emerald-50'
                            } else if (isSelected) {
                                buttonClass += 'border-red-500 bg-red-50'
                            } else {
                                buttonClass += 'border-gray-200 bg-gray-50 opacity-50'
                            }
                        } else {
                            buttonClass += 'border-gray-200 hover:border-[#5f3bff] hover:bg-[#5f3bff]/5 cursor-pointer'
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={selectedAnswer !== null}
                                className={buttonClass}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                                    showResult && isCorrect
                                        ? 'bg-emerald-500 text-white'
                                        : showResult && isSelected
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {showResult && isCorrect ? (
                                        <CheckCircle size={16} />
                                    ) : showResult && isSelected ? (
                                        <XCircle size={16} />
                                    ) : (
                                        String.fromCharCode(65 + index)
                                    )}
                                </div>
                                <span className={showResult && isCorrect ? 'text-emerald-700 font-medium' : 'text-gray-700'}>
                                    {option}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <div className="flex items-start gap-2">
                            <CheckCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 mb-1">Explanation</p>
                                <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next button */}
                {selectedAnswer !== null && (
                    <button
                        onClick={handleNext}
                        className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-[#5f3bff] text-white font-medium rounded-xl hover:bg-[#4f2fe0] transition-colors"
                    >
                        {currentIndex < questions.length - 1 ? (
                            <>
                                Next Question
                                <ChevronRight size={18} />
                            </>
                        ) : (
                            'Finish Quiz'
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

// Generate quiz questions for a module
export function generateModuleQuiz(moduleId: string): QuizQuestion[] {
    const quizzes: Record<string, QuizQuestion[]> = {
        safety: [
            {
                id: 'safety-1',
                question: 'What is the FIRST action when you smell gas near HVAC equipment?',
                options: [
                    'Check the pilot light',
                    'Evacuate and call emergency services',
                    'Turn off the thermostat',
                    'Open windows for ventilation'
                ],
                correctIndex: 1,
                explanation: 'Gas leaks are extremely dangerous. Always prioritize evacuation and calling 911 before any other action.'
            },
            {
                id: 'safety-2',
                question: 'When should you wear safety glasses during HVAC work?',
                options: [
                    'Only when working with refrigerants',
                    'Only during electrical work',
                    'Whenever there is potential for eye hazards',
                    'Only when the customer requests it'
                ],
                correctIndex: 2,
                explanation: 'Safety glasses should be worn whenever there is any potential for eye hazards, including dust, debris, chemicals, or sparks.'
            },
            {
                id: 'safety-3',
                question: 'What is the correct procedure before working on electrical components?',
                options: [
                    'Just be careful and work quickly',
                    'Use insulated tools only',
                    'Lockout/tagout and verify zero energy',
                    'Wear rubber gloves'
                ],
                correctIndex: 2,
                explanation: 'Lockout/tagout procedures and verification of zero energy are essential before any electrical work to prevent accidental energization.'
            },
        ],
        'customer-service': [
            {
                id: 'cs-1',
                question: 'A customer is upset about a delayed appointment. What is the best response?',
                options: [
                    'Explain that delays happen and they should be patient',
                    'Apologize sincerely and offer a solution or compensation',
                    'Blame traffic or previous jobs',
                    'Tell them to call the office'
                ],
                correctIndex: 1,
                explanation: 'Acknowledging the inconvenience, apologizing sincerely, and offering a concrete solution helps rebuild trust with upset customers.'
            },
            {
                id: 'cs-2',
                question: 'What information should you ALWAYS confirm at the end of a service call?',
                options: [
                    'The customer\'s favorite sports team',
                    'Their social security number',
                    'Address, phone number, and next appointment time',
                    'How they heard about the company'
                ],
                correctIndex: 2,
                explanation: 'Confirming contact details and appointment information prevents no-shows and ensures proper follow-up.'
            },
        ],
        'hvac-basics': [
            {
                id: 'hvac-1',
                question: 'How often should residential AC filters typically be replaced?',
                options: [
                    'Once a year',
                    'Every 1-3 months',
                    'Only when the AC breaks',
                    'Every 5 years'
                ],
                correctIndex: 1,
                explanation: 'Filters should be replaced every 1-3 months depending on usage, filter type, and air quality. This is also a great maintenance plan upsell opportunity.'
            },
            {
                id: 'hvac-2',
                question: 'What does SEER stand for?',
                options: [
                    'Standard Energy Efficiency Rating',
                    'Seasonal Energy Efficiency Ratio',
                    'System Electronic Error Report',
                    'Service Equipment Evaluation Review'
                ],
                correctIndex: 1,
                explanation: 'SEER (Seasonal Energy Efficiency Ratio) measures AC cooling efficiency. Higher SEER = more efficient = lower energy bills for customers.'
            },
        ],
        electrical: [
            {
                id: 'elec-1',
                question: 'What should you do BEFORE testing any electrical circuit?',
                options: [
                    'Put on rubber gloves',
                    'Verify your meter is working on a known live source',
                    'Touch the wires quickly to feel for voltage',
                    'Ask the homeowner to turn off the breaker'
                ],
                correctIndex: 1,
                explanation: 'Always verify your testing equipment is working properly on a known live source before trusting it to confirm a circuit is de-energized.'
            },
        ],
        'first-call': [
            {
                id: 'fcr-1',
                question: 'What is the most important factor in achieving First Call Resolution?',
                options: [
                    'Working as fast as possible',
                    'Having the cheapest parts available',
                    'Proper diagnosis and having common parts on hand',
                    'Scheduling the next appointment'
                ],
                correctIndex: 2,
                explanation: 'First Call Resolution depends on accurate diagnosis (so you fix the right problem) and having common replacement parts available (so you can complete the repair).'
            },
        ],
    }

    return quizzes[moduleId] || []
}
