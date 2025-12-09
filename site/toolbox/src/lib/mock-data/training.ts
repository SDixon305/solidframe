// Mock training data for demo mode

export interface TrainingQuestion {
    id: string
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}

export interface TrainingModule {
    id: string
    name: string
    description: string
    icon: string
    duration: string
    questions: TrainingQuestion[]
    completionRate?: number
}

export const mockTrainingModules: TrainingModule[] = [
    {
        id: 'emergency-protocols',
        name: 'Emergency Call Protocols',
        description: 'Learn how to handle emergency situations and prioritize customer safety',
        icon: 'alert',
        duration: '15 min',
        completionRate: 85,
        questions: [
            {
                id: 'q1',
                question: 'A customer calls reporting a gas smell near their furnace. What is your FIRST action?',
                options: [
                    'Ask them to check the pilot light',
                    'Advise them to leave immediately and call 911',
                    'Schedule a same-day appointment',
                    'Ask if they have a carbon monoxide detector'
                ],
                correctIndex: 1,
                explanation: 'Safety first! Gas leaks are extremely dangerous. Always advise immediate evacuation and emergency services before anything else.'
            },
            {
                id: 'q2',
                question: 'What constitutes an "emergency" call that requires immediate dispatch?',
                options: [
                    'Any call about a broken AC in summer',
                    'No heat with elderly or infants present',
                    'A customer who sounds upset',
                    'Any call received after 5 PM'
                ],
                correctIndex: 1,
                explanation: 'Emergencies involve safety risks to vulnerable individuals (elderly, infants, medical conditions) or dangerous situations (gas leaks, electrical issues).'
            },
            {
                id: 'q3',
                question: 'How quickly should emergency calls be dispatched?',
                options: [
                    'Within 24 hours',
                    'Within 4 hours',
                    'Within 1 hour',
                    'Within 2-3 business days'
                ],
                correctIndex: 2,
                explanation: 'Emergency calls should be dispatched within 1 hour maximum to ensure customer safety and satisfaction.'
            },
        ],
    },
    {
        id: 'customer-service',
        name: 'Customer Service Excellence',
        description: 'Best practices for professional and empathetic customer interactions',
        icon: 'heart',
        duration: '20 min',
        completionRate: 72,
        questions: [
            {
                id: 'q1',
                question: 'A frustrated customer is complaining about a technician who was late. How should you respond?',
                options: [
                    'Explain that traffic is unpredictable',
                    'Apologize sincerely and offer a discount on their next service',
                    'Tell them to call the technician directly',
                    'Say "That\'s not my department"'
                ],
                correctIndex: 1,
                explanation: 'Acknowledge the inconvenience, apologize sincerely, and offer a concrete solution to rebuild trust.'
            },
            {
                id: 'q2',
                question: 'What information should you ALWAYS confirm at the end of a service call?',
                options: [
                    'The customer\'s favorite sports team',
                    'Address, phone number, and appointment time',
                    'Their social security number',
                    'How they heard about us'
                ],
                correctIndex: 1,
                explanation: 'Always confirm critical booking details to prevent no-shows and ensure the technician arrives at the right place.'
            },
        ],
    },
    {
        id: 'hvac-basics',
        name: 'HVAC Fundamentals',
        description: 'Basic technical knowledge every team member should know',
        icon: 'thermometer',
        duration: '25 min',
        completionRate: 45,
        questions: [
            {
                id: 'q1',
                question: 'How often should residential AC filters typically be replaced?',
                options: [
                    'Once a year',
                    'Every 1-3 months',
                    'Only when the AC breaks',
                    'Every 5 years'
                ],
                correctIndex: 1,
                explanation: 'Filters should be replaced every 1-3 months depending on usage and filter type. This is a common upsell opportunity for maintenance plans.'
            },
            {
                id: 'q2',
                question: 'What does SEER stand for?',
                options: [
                    'Standard Energy Efficiency Rating',
                    'Seasonal Energy Efficiency Ratio',
                    'System Electronic Error Report',
                    'Service Equipment Evaluation Review'
                ],
                correctIndex: 1,
                explanation: 'SEER (Seasonal Energy Efficiency Ratio) measures AC efficiency. Higher SEER = more efficient = lower energy bills. Great selling point!'
            },
        ],
    },
]

export const trainingStats = {
    totalModules: 12,
    completedModules: 8,
    averageScore: 87,
    certifications: 3,
}
