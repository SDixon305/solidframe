'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, BookOpen, Award, Users, ArrowLeft, Play } from 'lucide-react'
import { useTenantContext } from '@/lib/tenant-context'
import { generateActivityLog } from '@/lib/fake-data'
import ToolLayout from '@/components/tools/ToolLayout'
import ToolHeader from '@/components/tools/ToolHeader'
import ToolTabs, { Tab } from '@/components/tools/ToolTabs'
import { CompactActivityLog } from '@/components/tools/ActivityLog'
import ModuleList, { generateTrainingModules, TrainingModuleData } from '@/components/tools/training/ModuleList'
import ProgressTracker, { generateTrainingProgress } from '@/components/tools/training/ProgressTracker'
import QuizInterface, { generateModuleQuiz } from '@/components/tools/training/QuizInterface'
import CertificationBadges, { generateCertifications } from '@/components/tools/training/CertificationBadges'

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'team', label: 'Team', icon: Users },
]

// Fake team member data
interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    modulesCompleted: number
    totalModules: number
    certifications: number
    lastActive: string
}

function generateTeamMembers(tenantId: string): TeamMember[] {
    const seed = tenantId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    const names = [
        { name: 'Mike Thompson', role: 'Lead Technician' },
        { name: 'Sarah Chen', role: 'Service Technician' },
        { name: 'David Martinez', role: 'Service Technician' },
        { name: 'Emily Johnson', role: 'Apprentice' },
        { name: 'Chris Wilson', role: 'Apprentice' },
    ]

    return names.map((person, index) => ({
        id: `team-${index + 1}`,
        name: person.name,
        role: person.role,
        avatar: person.name.split(' ').map(n => n[0]).join(''),
        modulesCompleted: Math.floor(seededRandom(index * 10) * 5) + 1,
        totalModules: 5,
        certifications: Math.floor(seededRandom(index * 10 + 1) * 4),
        lastActive: ['Today', 'Yesterday', '2 days ago', '1 week ago', '2 weeks ago'][Math.floor(seededRandom(index * 10 + 2) * 5)],
    }))
}

export default function TechTrainingPage() {
    const { tenant, getTool } = useTenantContext()
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedModule, setSelectedModule] = useState<TrainingModuleData | null>(null)
    const [showQuiz, setShowQuiz] = useState(false)

    const tool = getTool('tech-training')
    const tenantCreatedAt = new Date(tenant.created_at)

    // Generate fake data
    const modules = useMemo(() => generateTrainingModules(tenant.id), [tenant.id])
    const progress = useMemo(() => generateTrainingProgress(modules, tenant.id), [modules, tenant.id])
    const certifications = useMemo(
        () => generateCertifications(modules.map(m => ({ id: m.id, name: m.name, status: m.status, hasCertification: m.hasCertification })), tenant.id),
        [modules, tenant.id]
    )
    const teamMembers = useMemo(() => generateTeamMembers(tenant.id), [tenant.id])
    const activity = useMemo(
        () => generateActivityLog(tenantCreatedAt, 'tech-training', tenant.id, 15),
        [tenant.id]
    )

    if (!tool) return null

    // Module detail view
    if (selectedModule && !showQuiz) {
        const quizQuestions = generateModuleQuiz(selectedModule.id)

        return (
            <ToolLayout>
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={() => setSelectedModule(null)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Modules
                    </button>

                    {/* Module header */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${
                                    selectedModule.status === 'completed'
                                        ? 'bg-emerald-100'
                                        : selectedModule.status === 'in_progress'
                                            ? 'bg-blue-100'
                                            : 'bg-gray-100'
                                }`}>
                                    <BookOpen size={28} className={
                                        selectedModule.status === 'completed'
                                            ? 'text-emerald-600'
                                            : selectedModule.status === 'in_progress'
                                                ? 'text-blue-600'
                                                : 'text-gray-500'
                                    } />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                                        {selectedModule.name}
                                    </h1>
                                    <p className="text-sm text-gray-500">{selectedModule.description}</p>
                                </div>
                            </div>

                            {selectedModule.status === 'completed' && selectedModule.hasCertification && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                                    <Award size={14} />
                                    Certified
                                </div>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-500">
                                    {selectedModule.completedLessons} of {selectedModule.lessonsCount} lessons completed
                                </span>
                                <span className="font-medium text-gray-700">
                                    {Math.round((selectedModule.completedLessons / selectedModule.lessonsCount) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${
                                        selectedModule.status === 'completed' ? 'bg-emerald-500' : 'bg-[#5f3bff]'
                                    }`}
                                    style={{ width: `${(selectedModule.completedLessons / selectedModule.lessonsCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lessons list */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Lessons</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {selectedModule.lessons.map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className={`flex items-center gap-4 p-4 ${
                                        lesson.completed ? 'bg-gray-50' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        lesson.completed
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {lesson.completed ? '✓' : index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-medium ${lesson.completed ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="text-xs text-gray-400">{lesson.duration}</div>
                                    </div>
                                    {!lesson.completed && (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#5f3bff] hover:bg-[#5f3bff]/10 rounded-lg transition-colors">
                                            <Play size={14} />
                                            Start
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quiz section */}
                    {quizQuestions.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Module Quiz</h3>
                                    <p className="text-sm text-gray-500">
                                        {quizQuestions.length} questions · 70% to pass
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowQuiz(true)}
                                    className="px-5 py-2.5 bg-[#5f3bff] text-white font-medium rounded-lg hover:bg-[#4f2fe0] transition-colors"
                                >
                                    Take Quiz
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </ToolLayout>
        )
    }

    // Quiz view
    if (selectedModule && showQuiz) {
        const quizQuestions = generateModuleQuiz(selectedModule.id)

        return (
            <ToolLayout>
                <div className="max-w-2xl mx-auto py-8">
                    <QuizInterface
                        moduleId={selectedModule.id}
                        moduleName={selectedModule.name}
                        questions={quizQuestions}
                        onComplete={(score, total) => {
                            console.log(`Quiz complete: ${score}/${total}`)
                        }}
                        onClose={() => {
                            setShowQuiz(false)
                            setSelectedModule(null)
                        }}
                    />
                </div>
            </ToolLayout>
        )
    }

    // Main view
    return (
        <ToolLayout>
            <ToolHeader
                slug="tech-training"
                name={tool.name}
                description={tool.description}
                metrics={tool.metrics}
                isReal={tool.isReal}
            />

            <ToolTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <>
                        {/* Progress */}
                        <ProgressTracker progress={progress} />

                        {/* Two column layout */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* In-progress modules */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700">Continue Learning</h3>
                                    <button
                                        onClick={() => setActiveTab('modules')}
                                        className="text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                                    >
                                        View All →
                                    </button>
                                </div>
                                <ModuleList
                                    modules={modules.filter(m => m.status === 'in_progress').slice(0, 3)}
                                    onModuleClick={setSelectedModule}
                                    compact
                                />
                                {modules.filter(m => m.status === 'in_progress').length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-4">
                                        No modules in progress
                                    </p>
                                )}
                            </div>

                            {/* Certifications */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700">Certifications</h3>
                                    <button
                                        onClick={() => setActiveTab('certifications')}
                                        className="text-sm text-[#5f3bff] hover:text-[#4f2fe0] font-medium"
                                    >
                                        View All →
                                    </button>
                                </div>
                                <CertificationBadges certifications={certifications} variant="compact" />
                            </div>
                        </div>

                        {/* Recent activity */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
                            <CompactActivityLog entries={activity} maxEntries={5} />
                        </div>
                    </>
                )}

                {activeTab === 'modules' && (
                    <>
                        <ProgressTracker progress={progress} variant="compact" />
                        <ModuleList modules={modules} onModuleClick={setSelectedModule} />
                    </>
                )}

                {activeTab === 'certifications' && (
                    <CertificationBadges certifications={certifications} />
                )}

                {activeTab === 'team' && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Team Progress</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Track your team's training completion and certifications
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {teamMembers.map((member) => {
                                const progressPct = Math.round((member.modulesCompleted / member.totalModules) * 100)

                                return (
                                    <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-[#5f3bff] flex items-center justify-center text-white font-medium text-sm">
                                            {member.avatar}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">{member.name}</div>
                                            <div className="text-sm text-gray-500">{member.role}</div>
                                        </div>

                                        {/* Progress */}
                                        <div className="w-32">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-500">Progress</span>
                                                <span className="font-medium text-gray-700">{progressPct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#5f3bff] rounded-full"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Certifications */}
                                        <div className="text-center w-20">
                                            <div className="flex items-center justify-center gap-1 text-amber-600">
                                                <Award size={14} />
                                                <span className="font-medium">{member.certifications}</span>
                                            </div>
                                            <div className="text-xs text-gray-400">certs</div>
                                        </div>

                                        {/* Last active */}
                                        <div className="text-right w-24">
                                            <div className="text-sm text-gray-500">{member.lastActive}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Demo notice */}
                        <div className="p-4 bg-amber-50 border-t border-amber-100">
                            <p className="text-sm text-amber-700 text-center">
                                <strong>Demo Mode:</strong> Team member data is simulated
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    )
}
