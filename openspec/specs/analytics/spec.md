# analytics Specification

## Purpose
TBD - created by archiving change build-admin-portal. Update Purpose after archive.
## Requirements
### Requirement: Platform Overview Metrics
The system SHALL display key platform metrics on the analytics dashboard including total clients, MRR, monthly actions, and active tools.

#### Scenario: View overview metrics
- **WHEN** admin navigates to /admin/analytics
- **THEN** they see metric cards for Total Clients, MRR, Actions This Month, and Active Tools
- **AND** each metric shows trend indicator (up/down arrow with percentage)

### Requirement: Usage Time Series Chart
The system SHALL display a time series chart showing platform usage over time.

#### Scenario: View usage trends
- **WHEN** admin views the usage chart
- **THEN** they see lines for Calls Handled, SMS Sent, and Appointments Booked over the selected time range

#### Scenario: Toggle chart series
- **WHEN** admin clicks a legend item
- **THEN** that data series is hidden/shown on the chart

### Requirement: Per-Client Usage Breakdown
The system SHALL display a sortable table showing usage metrics per client.

#### Scenario: View client breakdown
- **WHEN** admin views the client breakdown table
- **THEN** they see columns for Client Name, Calls, SMS, Last Active, Status

#### Scenario: Sort by column
- **WHEN** admin clicks the "Calls" column header
- **THEN** the table sorts by calls (descending, then ascending on second click)

#### Scenario: Navigate to client
- **WHEN** admin clicks a client name in the breakdown
- **THEN** they navigate to that client's detail page

### Requirement: Tool Usage Chart
The system SHALL display a chart showing usage distribution across tools.

#### Scenario: View tool popularity
- **WHEN** admin views the tool usage chart
- **THEN** they see a horizontal bar chart with each tool and its usage count

### Requirement: Date Range Filtering
The system SHALL allow filtering analytics data by date range.

#### Scenario: Select date range
- **WHEN** admin selects "Last 7 days" from the date picker
- **THEN** all charts and metrics update to show only data from the last 7 days

#### Scenario: Available ranges
- **WHEN** admin opens the date range picker
- **THEN** they see options for: Last 7 days, Last 30 days, Last 90 days, Custom range

### Requirement: Alert Inbox
The system SHALL provide an inbox for viewing and managing platform alerts.

#### Scenario: View alerts
- **WHEN** admin navigates to /admin/alerts
- **THEN** they see a list of all alerts, newest first

#### Scenario: Filter alerts
- **WHEN** admin selects "Billing" type filter
- **THEN** only billing-related alerts are shown

#### Scenario: Mark as read
- **WHEN** admin clicks an unread alert
- **THEN** the alert is marked as read
- **AND** the unread badge count decrements

### Requirement: Real-time Alert Updates
The system SHALL update the alert list and badge count in real-time when new alerts arrive.

#### Scenario: New alert arrives
- **WHEN** a new alert is created in the database
- **THEN** it appears at the top of the alert list without page refresh
- **AND** the sidebar badge increments

### Requirement: Alert Creation Triggers
The system SHALL automatically create alerts for significant platform events.

#### Scenario: Client created alert
- **WHEN** a new client is created
- **THEN** an alert is created with type "client.created" and severity "info"

#### Scenario: Payment failed alert
- **WHEN** Stripe reports a failed payment
- **THEN** an alert is created with type "billing.payment_failed" and severity "error"
- **AND** the alert links to the affected client

