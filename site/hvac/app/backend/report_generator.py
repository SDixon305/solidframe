"""
Daily report generation for call summaries
"""
from datetime import datetime, date, timedelta
from typing import Dict, Any, List
from database import db, DailyReport


class ReportGenerator:
    """Generates daily reports for HVAC businesses"""
    
    @staticmethod
    def generate_daily_report(business_id: str, report_date: date = None) -> Dict[str, Any]:
        """
        Generate comprehensive daily report for a business
        
        Args:
            business_id: Business UUID
            report_date: Date to generate report for (defaults to today)
        
        Returns:
            Report data dictionary
        """
        if report_date is None:
            report_date = date.today()
        
        # Get all calls for the date
        calls = db.get_calls_by_business(business_id, limit=1000)
        
        # Filter calls for the specific date
        date_str = report_date.isoformat()
        daily_calls = [
            call for call in calls
            if call.get('created_at', '').startswith(date_str)
        ]
        
        # Calculate statistics
        total_calls = len(daily_calls)
        emergency_calls = len([c for c in daily_calls if c.get('priority_level') == 'emergency'])
        standard_calls = len([c for c in daily_calls if c.get('priority_level') == 'standard'])
        missed_calls = len([c for c in daily_calls if c.get('status') == 'missed'])
        
        # Calculate average response time
        response_times = []
        for call in daily_calls:
            if call.get('dispatched_at') and call.get('accepted_at'):
                dispatched = datetime.fromisoformat(call['dispatched_at'].replace('Z', '+00:00'))
                accepted = datetime.fromisoformat(call['accepted_at'].replace('Z', '+00:00'))
                response_time = (accepted - dispatched).total_seconds()
                response_times.append(response_time)
        
        avg_response_time = int(sum(response_times) / len(response_times)) if response_times else None
        
        # Organize calls by category
        report_data = {
            "date": date_str,
            "summary": {
                "total_calls": total_calls,
                "emergency_calls": emergency_calls,
                "standard_calls": standard_calls,
                "missed_calls": missed_calls,
                "avg_response_time_seconds": avg_response_time
            },
            "emergency_details": [
                {
                    "time": call.get('created_at'),
                    "customer_name": call.get('customer_name'),
                    "customer_phone": call.get('customer_phone'),
                    "issue": call.get('issue_description'),
                    "status": call.get('status'),
                    "assigned_tech": call.get('assigned_tech_id')
                }
                for call in daily_calls if call.get('priority_level') == 'emergency'
            ],
            "standard_details": [
                {
                    "time": call.get('created_at'),
                    "customer_name": call.get('customer_name'),
                    "customer_phone": call.get('customer_phone'),
                    "issue": call.get('issue_description'),
                    "status": call.get('status')
                }
                for call in daily_calls if call.get('priority_level') == 'standard'
            ],
            "missed_details": [
                {
                    "time": call.get('created_at'),
                    "customer_phone": call.get('customer_phone'),
                    "reason": "No answer or system error"
                }
                for call in daily_calls if call.get('status') == 'missed'
            ]
        }
        
        # Save report to database
        report = DailyReport(
            business_id=business_id,
            report_date=date_str,
            total_calls=total_calls,
            emergency_calls=emergency_calls,
            standard_calls=standard_calls,
            missed_calls=missed_calls,
            avg_response_time_seconds=avg_response_time,
            report_data=report_data
        )
        
        db.create_daily_report(report)
        
        return report_data
    
    @staticmethod
    def format_report_for_email(report_data: Dict[str, Any], business_name: str) -> str:
        """Format report data as email-friendly text"""
        summary = report_data['summary']
        
        email_body = f"""
Daily Report for {business_name}
Date: {report_data['date']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Calls: {summary['total_calls']}
Emergency Calls: {summary['emergency_calls']}
Standard Service Requests: {summary['standard_calls']}
Missed Calls: {summary['missed_calls']}
Average Response Time: {ReportGenerator._format_time(summary.get('avg_response_time_seconds'))}

"""
        
        # Emergency calls section
        if report_data['emergency_details']:
            email_body += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMERGENCY CALLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""
            for i, call in enumerate(report_data['emergency_details'], 1):
                email_body += f"""
{i}. {call['customer_name']} - {call['customer_phone']}
   Time: {ReportGenerator._format_datetime(call['time'])}
   Issue: {call['issue']}
   Status: {call['status'].upper()}
"""
        
        # Standard calls section
        if report_data['standard_details']:
            email_body += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STANDARD SERVICE REQUESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""
            for i, call in enumerate(report_data['standard_details'], 1):
                email_body += f"""
{i}. {call['customer_name']} - {call['customer_phone']}
   Time: {ReportGenerator._format_datetime(call['time'])}
   Issue: {call['issue']}
   Status: {call['status'].upper()}
"""
        
        # Missed calls section
        if report_data['missed_details']:
            email_body += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSED CALLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""
            for i, call in enumerate(report_data['missed_details'], 1):
                email_body += f"""
{i}. {call['customer_phone']}
   Time: {ReportGenerator._format_datetime(call['time'])}
   Reason: {call['reason']}
"""
        
        email_body += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an automated report generated by your HVAC call triage system.
"""
        
        return email_body
    
    @staticmethod
    def _format_time(seconds: int) -> str:
        """Format seconds into readable time"""
        if seconds is None:
            return "N/A"
        
        minutes = seconds // 60
        secs = seconds % 60
        
        if minutes > 0:
            return f"{minutes}m {secs}s"
        return f"{secs}s"
    
    @staticmethod
    def _format_datetime(iso_string: str) -> str:
        """Format ISO datetime string"""
        if not iso_string:
            return "N/A"
        
        try:
            dt = datetime.fromisoformat(iso_string.replace('Z', '+00:00'))
            return dt.strftime("%I:%M %p")
        except:
            return iso_string


# Export report generator
report_gen = ReportGenerator()
