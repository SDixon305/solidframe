## ADDED Requirements

### Requirement: Magic Link Authentication
The system SHALL authenticate users via email magic links using Supabase Auth, eliminating the need for passwords.

#### Scenario: Request magic link
- **WHEN** a user enters their email on the login page
- **THEN** the system sends a magic link to that email
- **AND** displays "Check your email for a login link"

#### Scenario: Magic link login
- **WHEN** a user clicks a valid magic link
- **THEN** the system creates a session
- **AND** redirects to their appropriate dashboard (admin or tenant)

#### Scenario: Expired magic link
- **WHEN** a user clicks an expired magic link (>1 hour old)
- **THEN** the system displays "This link has expired"
- **AND** offers to send a new link

### Requirement: Role-Based Access Control
The system SHALL enforce role-based access with three roles: super_admin (platform staff), admin (future: tenant admins), and client_user (regular tenant users).

#### Scenario: Super admin access
- **WHEN** a super_admin navigates to /admin
- **THEN** they can view and manage all tenants

#### Scenario: Client user restricted
- **WHEN** a client_user attempts to access /admin
- **THEN** they receive a 403 Forbidden response
- **AND** are redirected to their tenant dashboard

### Requirement: Session Management
The system SHALL maintain authenticated sessions with automatic refresh and secure logout.

#### Scenario: Session persistence
- **WHEN** an authenticated user closes and reopens their browser
- **THEN** they remain logged in if the session hasn't expired

#### Scenario: Logout
- **WHEN** a user clicks logout
- **THEN** the system invalidates their session
- **AND** redirects to the login page
- **AND** clears all auth cookies

### Requirement: First Login User Creation
The system SHALL create a user record in the users table on first successful authentication, linking to the Supabase auth.users record.

#### Scenario: New user first login
- **WHEN** a user authenticates for the first time
- **THEN** the system creates a user record with their email
- **AND** links it to their auth.users.id via auth_id column

#### Scenario: Existing user login
- **WHEN** a user with an existing record authenticates
- **THEN** the system loads their existing user record
- **AND** does not create a duplicate

### Requirement: Route Protection Middleware
The system SHALL protect routes via middleware that verifies authentication and authorization before allowing access.

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user accesses a protected route
- **THEN** they are redirected to /login
- **AND** the original URL is preserved for post-login redirect

#### Scenario: Tenant route mismatch
- **WHEN** a user with tenant "acme" tries to access /other-tenant/dashboard
- **THEN** they receive a 403 Forbidden response
