'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Award, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/shared'
import { demoFolders } from '@/lib/demo-tools'
import { useDemoContext } from '@/lib/demo-context'
import { mockTrainingModules, trainingStats, TrainingModule, TrainingQuestion } from '@/lib/mock-data'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoTrainingPage() {
    const { businessName } = useDemoContext()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)

    const tokenParam = token ? `?token=${token}` : ''

    const currentQuestion = selectedModule?.questions[currentQuestionIndex]

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null) return // Already answered
        setSelectedAnswer(index)
        setShowExplanation(true)
        if (index === currentQuestion?.correctIndex) {
            setScore(prev => prev + 1)
        }
    }

    const handleNextQuestion = () => {
        if (selectedModule && currentQuestionIndex < selectedModule.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        } else {
            setCompleted(true)
        }
    }

    const handleStartModule = (module: TrainingModule) => {
        setSelectedModule(module)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setScore(0)
        setCompleted(false)
    }

    const handleBackToModules = () => {
        setSelectedModule(null)
        setCompleted(false)
    }

    return (
        <div className="flex h-screen font-sans text-white transition-colors duration-500">
            <Sidebar
                folders={demoFolders}
                activeFolder="demo_tools"
                brandName="SolidFrame"
                hideNav={true}
            />

            <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-[#09090b]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-6">
                        <Link href={`/client-demo${tokenParam}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="p-3 rounded-xl border bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <BookOpen size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Technician Training
                            </h2>
                            <p className="text-sm text-zinc-500">
                                AI-powered training for {businessName} team
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Demo Mode
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {!selectedModule ? (
                            // Module Selection
                            <motion.div
                                key="modules"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                        <div className="text-2xl font-bold text-white">{trainingStats.totalModules}</div>
                                        <div className="text-xs text-zinc-500">Total Modules</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="text-2xl font-bold text-emerald-400">{trainingStats.completedModules}</div>
                                        <div className="text-xs text-zinc-500">Completed</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <div className="text-2xl font-bold text-purple-400">{trainingStats.averageScore}%</div>
                                        <div className="text-xs text-zinc-500">Avg Score</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <div className="text-2xl font-bold text-amber-400">{trainingStats.certifications}</div>
                                        <div className="text-xs text-zinc-500">Certifications</div>
                                    </div>
                                </div>

                                {/* Modules Grid */}
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                                    Available Modules
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {mockTrainingModules.map((module, index) => (
                                        <motion.button
                                            key={module.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleStartModule(module)}
                                            className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all text-left group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 rounded-lg bg-purple-500/10">
                                                    <BookOpen size={20} className="text-purple-400" />
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                    <Clock size={12} />
                                                    {module.duration}
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                                {module.name}
                                            </h4>
                                            <p className="text-sm text-zinc-500 mb-4">
                                                {module.description}
                                            </p>
                                            {module.completionRate && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-500 rounded-full"
                                                            style={{ width: `${module.completionRate}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-zinc-500">{module.completionRate}%</span>
                                                </div>
                                            )}
                                            <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm font-medium">
                                                Start Module
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : completed ? (
                            // Completion Screen
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-lg mx-auto text-center py-12"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <Award size={40} className="text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Module Complete!</h3>
                                <p className="text-zinc-400 mb-6">
                                    You scored {score} out of {selectedModule.questions.length}
                                </p>
                                <div className="text-4xl font-bold text-emerald-400 mb-8">
                                    {Math.round((score / selectedModule.questions.length) * 100)}%
                                </div>
                                <button
                                    onClick={handleBackToModules}
                                    className="px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform"
                                >
                                    Back to Modules
                                </button>
                            </motion.div>
                        ) : (
                            // Quiz View
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="max-w-2xl mx-auto"
                            >
                                <button
                                    onClick={handleBackToModules}
                                    className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to modules
                                </button>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-white">{selectedModule.name}</h3>
                                        <span className="text-sm text-zinc-500">
                                            Question {currentQuestionIndex + 1} of {selectedModule.questions.length}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all"
                                            style={{ width: `${((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {currentQuestion && (
                                    <div className="p-8 rounded-xl bg-zinc-900/50 border border-white/5">
                                        <p className="text-lg text-white mb-6">{currentQuestion.question}</p>

                                        <div className="space-y-3">
                                            {currentQuestion.options.map((option, index) => {
                                                const isSelected = selectedAnswer === index
                                                const isCorrect = index === currentQuestion.correctIndex
                                                const showResult = selectedAnswer !== null

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleAnswerSelect(index)}
                                                        disabled={selectedAnswer !== null}
                                                        className={`w-full p-4 rounded-lg text-left transition-all flex items-center gap-3 ${
                                                            showResult
                                                                ? isCorrect
                                                                    ? 'bg-emerald-500/20 border-emerald-500/50'
                                                                    : isSelected
                                                                        ? 'bg-red-500/20 border-red-500/50'
                                                                        : 'bg-zinc-800/50 border-zinc-700/50'
                                                                : 'bg-zinc-800 border-zinc-700 hover:border-purple-500/50'
                                                        } border`}
                                                    >
                                                        {showResult && isCorrect && (
                                                            <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                                                        )}
                                                        {showResult && isSelected && !isCorrect && (
                                                            <XCircle size={18} className="text-red-400 flex-shrink-0" />
                                                        )}
                                                        <span className={showResult && isCorrect ? 'text-emerald-400' : 'text-white'}>
                                                            {option}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {showExplanation && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30"
                                            >
                                                <p className="text-sm text-purple-300">
                                                    <strong>Explanation:</strong> {currentQuestion.explanation}
                                                </p>
                                            </motion.div>
                                        )}

                                        {selectedAnswer !== null && (
                                            <button
                                                onClick={handleNextQuestion}
                                                className="mt-6 w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-transform"
                                            >
                                                {currentQuestionIndex < selectedModule.questions.length - 1 ? 'Next Question' : 'Finish Module'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
