import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ROIInputs, ROIResults, AI_BOOKING_RATES } from '@/lib/hooks/use-roi-calculator';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    coverPage: {
        flexDirection: 'column',
        backgroundColor: '#000',
        padding: 0,
        fontFamily: 'Helvetica',
        height: '100%'
    },
    coverContent: {
        padding: 60,
        flex: 1,
        justifyContent: 'center'
    },
    coverTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        marginBottom: 20
    },
    coverSubtitle: {
        fontSize: 18,
        color: '#fbbf24',
        letterSpacing: 2,
        marginBottom: 60
    },
    coverFooter: {
        position: 'absolute',
        bottom: 40,
        left: 60,
        right: 60,
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#f43f5e',
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        textTransform: 'uppercase'
    },
    subtitle: {
        fontSize: 12,
        color: '#71717a',
        marginTop: 4
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 25,
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    grid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 20
    },
    card: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    cardTitle: {
        fontSize: 9,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 6,
        letterSpacing: 1
    },
    cardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    cardSubtext: {
        fontSize: 8,
        color: '#94a3b8',
        marginTop: 4
    },
    highlightCard: {
        padding: 20,
        backgroundColor: '#ecfdf5',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#10b981',
        marginBottom: 20
    },
    highlightTitle: {
        fontSize: 12,
        color: '#059669',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    highlightValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#059669'
    },
    highlightSubtext: {
        fontSize: 10,
        color: '#047857',
        marginTop: 8
    },
    comparisonRow: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10
    },
    comparisonCard: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        borderWidth: 1
    },
    lostCard: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca'
    },
    recoveredCard: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0'
    },
    comparisonLabel: {
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4
    },
    comparisonValue: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 8,
        alignItems: 'center'
    },
    label: {
        width: '60%',
        fontSize: 11,
        color: '#334155'
    },
    value: {
        width: '40%',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0f172a',
        textAlign: 'right'
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 10,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10
    },
    summaryBox: {
        backgroundColor: '#f0fdf4',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#10b981'
    },
    summaryText: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#334155'
    },
    assumptionsBox: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    assumptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    assumptionLabel: {
        fontSize: 9,
        color: '#64748b'
    },
    assumptionValue: {
        fontSize: 9,
        color: '#334155',
        fontWeight: 'bold'
    }
});

const SOLUTION_LABELS: Record<string, string> = {
    voicemail: 'Voicemail',
    answering_service: 'Answering Service',
    in_house_staff: 'In-house Staff'
};

interface ROIReportProps {
    inputs: ROIInputs;
    results: ROIResults;
}

const ROIReport = ({ inputs, results }: ROIReportProps) => {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
    }

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Document>
            {/* Cover Page */}
            <Page size="A4" style={styles.coverPage}>
                <View style={styles.coverContent}>
                    <Text style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 10, letterSpacing: 2 }}>CONFIDENTIAL ANALYSIS</Text>
                    <Text style={styles.coverTitle}>Growth & Efficiency Blueprint</Text>
                    <Text style={styles.coverSubtitle}>PREPARED FOR: VALUED CLIENT</Text>
                </View>
                <View style={styles.coverFooter}>
                    <Text style={{ color: '#71717a', fontSize: 10 }}>SolidFrame Intelligence</Text>
                    <Text style={{ color: '#71717a', fontSize: 10 }}>{currentDate}</Text>
                </View>
            </Page>

            {/* Main Analysis Page */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Executive Summary</Text>
                        <Text style={styles.subtitle}>Operational Efficiency Audit</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 10, color: '#94a3b8' }}>{currentDate}</Text>
                    </View>
                </View>

                {/* Dynamic Summary */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>
                        Based on current operational data, your business misses approximately {inputs.missedCallsPerWeek} calls per week.
                        {'\n\n'}
                        Using your current {SOLUTION_LABELS[inputs.solutionType].toLowerCase()} setup, you are losing an estimated {formatCurrency(results.totalCurrentLoss)} annually.
                        Implementing SolidFrame&apos;s AI Triage system is projected to recover {formatCurrency(results.totalRecovered)} of this lost value,
                        resulting in a net annual gain of {formatCurrency(results.netAnnualGain)}.
                    </Text>
                </View>

                {/* Net Gain Highlight */}
                <View style={styles.highlightCard}>
                    <Text style={styles.highlightTitle}>Net Annual Gain</Text>
                    <Text style={styles.highlightValue}>+ {formatCurrency(results.netAnnualGain)}</Text>
                    <Text style={styles.highlightSubtext}>Monthly equivalent: {formatCurrency(results.netMonthlyGain)}/mo</Text>
                </View>

                {/* Emergency Calls Comparison */}
                <Text style={styles.sectionTitle}>Emergency Calls</Text>
                <View style={styles.comparisonRow}>
                    <View style={[styles.comparisonCard, styles.lostCard]}>
                        <Text style={[styles.comparisonLabel, { color: '#dc2626' }]}>Lost to Competitor</Text>
                        <Text style={[styles.comparisonValue, { color: '#dc2626' }]}>{formatCurrency(results.emergencyLostToCompetitor)}</Text>
                        <Text style={[styles.cardSubtext, { color: '#b91c1c' }]}>per year at {inputs.currentEmergencyBookingRate}% booking</Text>
                    </View>
                    <View style={[styles.comparisonCard, styles.recoveredCard]}>
                        <Text style={[styles.comparisonLabel, { color: '#16a34a' }]}>Recovered with AI</Text>
                        <Text style={[styles.comparisonValue, { color: '#16a34a' }]}>+{formatCurrency(results.emergencyRecovered)}</Text>
                        <Text style={[styles.cardSubtext, { color: '#15803d' }]}>per year at {AI_BOOKING_RATES.emergency}% booking</Text>
                    </View>
                </View>

                {/* Service Calls Comparison */}
                <Text style={styles.sectionTitle}>Service Calls</Text>
                <View style={styles.comparisonRow}>
                    <View style={[styles.comparisonCard, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                        <Text style={[styles.comparisonLabel, { color: '#ea580c' }]}>Slipping Away</Text>
                        <Text style={[styles.comparisonValue, { color: '#ea580c' }]}>{formatCurrency(results.serviceLostSlippingAway)}</Text>
                        <Text style={[styles.cardSubtext, { color: '#c2410c' }]}>per year at {inputs.currentServiceBookingRate}% booking</Text>
                    </View>
                    <View style={[styles.comparisonCard, styles.recoveredCard]}>
                        <Text style={[styles.comparisonLabel, { color: '#16a34a' }]}>Recovered with AI</Text>
                        <Text style={[styles.comparisonValue, { color: '#16a34a' }]}>+{formatCurrency(results.serviceRecovered)}</Text>
                        <Text style={[styles.cardSubtext, { color: '#15803d' }]}>per year at {AI_BOOKING_RATES.service}% booking</Text>
                    </View>
                </View>

                {/* Cost Comparison */}
                <Text style={styles.sectionTitle}>Cost Comparison</Text>
                <View style={styles.grid}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Current Annual Cost</Text>
                        <Text style={styles.cardValue}>{formatCurrency(results.currentAnnualCost)}</Text>
                        <Text style={styles.cardSubtext}>{SOLUTION_LABELS[inputs.solutionType]}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>SolidFrame Annual Cost</Text>
                        <Text style={[styles.cardValue, { color: '#f59e0b' }]}>{formatCurrency(results.solidFrameAnnualCost)}</Text>
                        <Text style={styles.cardSubtext}>Based on call volume</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated by SolidFrame Toolbox - solidframe.ai</Text>
                </View>
            </Page>

            {/* Assumptions Page */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Assumptions & Inputs</Text>
                        <Text style={styles.subtitle}>Data used in this analysis</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Call Volume</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Missed Calls Per Week</Text>
                    <Text style={styles.value}>{inputs.missedCallsPerWeek}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Emergency Call Percentage</Text>
                    <Text style={styles.value}>{inputs.emergencyPercent}%</Text>
                </View>

                <Text style={styles.sectionTitle}>Current Solution</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Solution Type</Text>
                    <Text style={styles.value}>{SOLUTION_LABELS[inputs.solutionType]}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Current Emergency Booking Rate</Text>
                    <Text style={styles.value}>{inputs.currentEmergencyBookingRate}%</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Current Service Booking Rate</Text>
                    <Text style={styles.value}>{inputs.currentServiceBookingRate}%</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Monthly Cost</Text>
                    <Text style={styles.value}>{formatCurrency(inputs.currentMonthlyCost)}</Text>
                </View>

                <Text style={styles.sectionTitle}>Ticket Values</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Average Emergency Ticket</Text>
                    <Text style={styles.value}>{formatCurrency(inputs.emergencyTicketValue)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Average Service Ticket</Text>
                    <Text style={styles.value}>{formatCurrency(inputs.serviceTicketValue)}</Text>
                </View>

                <Text style={styles.sectionTitle}>AI Performance Claims</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>AI Emergency Booking Rate</Text>
                    <Text style={styles.value}>{AI_BOOKING_RATES.emergency}%</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>AI Service Booking Rate</Text>
                    <Text style={styles.value}>{AI_BOOKING_RATES.service}%</Text>
                </View>

                <View style={styles.footer}>
                    <Text>Generated by SolidFrame Toolbox - solidframe.ai</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ROIReport;
