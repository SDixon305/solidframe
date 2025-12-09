'use client'

import React from 'react'
import { Sun, Thermometer, Leaf, Snowflake, Check, ArrowRight, Clock, Users } from 'lucide-react'

export interface CampaignTemplate {
    id: string
    name: string
    description: string
    season: 'spring' | 'summer' | 'fall' | 'winter'
    subject: string
    message: string
    suggestedAudience: string
    estimatedReach: number
    bestSendTime: string
}

interface CampaignTemplatesProps {
    templates: CampaignTemplate[]
    selectedTemplate: CampaignTemplate | null
    onSelectTemplate: (template: CampaignTemplate) => void
    compact?: boolean
}

const SEASON_CONFIG = {
    spring: {
        icon: Leaf,
        gradient: 'from-green-400 to-emerald-500',
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
    },
    summer: {
        icon: Sun,
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
    },
    fall: {
        icon: Thermometer,
        gradient: 'from-orange-400 to-red-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
    },
    winter: {
        icon: Snowflake,
        gradient: 'from-blue-400 to-cyan-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
    },
}

export default function CampaignTemplates({
    templates,
    selectedTemplate,
    onSelectTemplate,
    compact = false,
}: CampaignTemplatesProps) {
    if (compact) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-2">
                {templates.map((template) => {
                    const config = SEASON_CONFIG[template.season]
                    const Icon = config.icon
                    const isSelected = selectedTemplate?.id === template.id

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border whitespace-nowrap transition-all ${
                                isSelected
                                    ? 'bg-[#5f3bff]/10 border-[#5f3bff] text-[#5f3bff]'
                                    : `${config.bg} ${config.border} ${config.text}`
                            }`}
                        >
                            <Icon size={14} />
                            <span className="text-sm font-medium">{template.name}</span>
                            {isSelected && <Check size={14} />}
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => {
                const config = SEASON_CONFIG[template.season]
                const Icon = config.icon
                const isSelected = selectedTemplate?.id === template.id

                return (
                    <button
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className={`relative text-left p-5 rounded-xl border-2 transition-all ${
                            isSelected
                                ? 'border-[#5f3bff] bg-[#5f3bff]/5 ring-2 ring-[#5f3bff]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                    >
                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#5f3bff] rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                            </div>
                        )}

                        {/* Icon */}
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${config.gradient} mb-4`}>
                            <Icon size={24} className="text-white" />
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{template.description}</p>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Users size={12} />
                                <span>{template.estimatedReach.toLocaleString()} customers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{template.bestSendTime}</span>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

// Selected template preview
interface TemplatePreviewProps {
    template: CampaignTemplate
    onEdit?: () => void
}

export function TemplatePreview({ template, onEdit }: TemplatePreviewProps) {
    const config = SEASON_CONFIG[template.season]
    const Icon = config.icon

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r ${config.gradient}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-white">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-white/80">{template.suggestedAudience}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">Subject Line</div>
                    <div className="font-medium text-gray-900">{template.subject}</div>
                </div>

                <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">Message</div>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                        {template.message}
                    </div>
                </div>

                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#5f3bff] hover:text-[#4f2fe0]"
                    >
                        Customize Message
                        <ArrowRight size={14} />
                    </button>
                )}
            </div>
        </div>
    )
}

// Default campaign templates
export const DEFAULT_CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
    {
        id: 'spring-ac',
        name: 'Spring AC Tune-Up',
        description: 'Get AC systems ready before the summer heat',
        season: 'spring',
        subject: '🌸 Spring AC Tune-Up Special - $89',
        message: `Hi {customer_name},

Spring is here! Is your AC ready for the summer heat?

Book your Spring AC Tune-Up now and get:
✓ Complete system inspection
✓ Filter replacement
✓ Refrigerant check
✓ Coil cleaning

Special Price: $89 (reg. $129)

Schedule online or call us at {company_phone}

Stay cool this summer!
{company_name}`,
        suggestedAudience: 'All customers',
        estimatedReach: 1247,
        bestSendTime: 'March - April',
    },
    {
        id: 'summer-ac',
        name: 'Summer AC Check',
        description: 'Mid-summer checkup to prevent breakdowns',
        season: 'summer',
        subject: '☀️ Beat the Heat - AC Check Special',
        message: `Hi {customer_name},

Summer is in full swing! Don't let AC problems leave you sweating.

Our Summer AC Check includes:
✓ Performance evaluation
✓ Thermostat calibration
✓ Ductwork inspection
✓ Energy efficiency tips

Book now before the heat wave hits!

Call {company_phone} or reply to schedule.

{company_name}`,
        suggestedAudience: 'Customers without maintenance plan',
        estimatedReach: 892,
        bestSendTime: 'June - July',
    },
    {
        id: 'fall-heating',
        name: 'Fall Heating Prep',
        description: 'Prepare heating systems for winter',
        season: 'fall',
        subject: '🍂 Fall Heating System Check - Get Ready for Winter',
        message: `Hi {customer_name},

Fall is here - time to prepare your heating system!

Our Fall Heating Check includes:
✓ Furnace inspection
✓ Safety testing
✓ Filter replacement
✓ Thermostat check

Special Fall Price: $79

Don't wait until it's freezing! Schedule now.

{company_phone}
{company_name}`,
        suggestedAudience: 'All customers',
        estimatedReach: 1247,
        bestSendTime: 'September - October',
    },
    {
        id: 'winter-special',
        name: 'Winter Heating Special',
        description: 'Emergency heating service promotion',
        season: 'winter',
        subject: '❄️ Winter Emergency? We\'re Here 24/7',
        message: `Hi {customer_name},

Brrr! It's cold out there!

If your heating system needs help, we're here for you:
✓ 24/7 Emergency service
✓ Same-day appointments
✓ No overtime charges for members

Existing customers get priority scheduling!

Call anytime: {company_phone}

Stay warm,
{company_name}`,
        suggestedAudience: 'Past service customers',
        estimatedReach: 634,
        bestSendTime: 'December - February',
    },
]
