# PHASES — Support Ticket Management System

## Phase 1 — Project Setup, Database & Authentication

### Goal
Create the basic full-stack application and make authentication work correctly.

### Tasks

#### Project Setup
- Create the React frontend.
- Create the Django backend.
- Configure Django REST Framework.
- Configure MySQL.
- Configure environment variables.
- Set up Git.

#### Database
Create the required models/tables:

- users
- tickets
- ticket_comments

Set up:
- Primary keys
- Foreign-key relationships
- Required fields
- Basic indexes where appropriate
- Database schema
- Seed/sample data

#### Authentication
Implement:

- Customer registration
- Customer login
- Agent login
- Password hashing
- JWT authentication
- Logout
- Protected frontend routes
- Protected backend APIs
- Role-based authorization

### Phase 1 Completion Check

Before moving forward, verify:

- Customer can register and log in.
- Agent can log in.
- JWT authentication works.
- Protected routes work.
- Customer and agent permissions are separated.
- MySQL connection works.
- Required database relationships work.

---

## Phase 2 — Ticket Management & React UI

### Goal
Implement the complete required ticket-management functionality.

### Customer Features

Build:

- Customer dashboard
- Customer ticket list
- Create ticket
- Ticket details
- View comments/responses
- Add comments
- Search tickets
- Filter tickets

Ticket creation must support:

- Subject
- Description
- Priority

Customers must only access their own permitted tickets.

### Agent Features

Build:

- Agent dashboard
- Ticket statistics
- View all tickets
- Search tickets
- Filter tickets
- Sort tickets
- Ticket details
- Update ticket status
- Update ticket priority
- Assign ticket to an agent
- Add responses/comments

### REST APIs

Implement and connect the required APIs from `PRD.md`:

- Register
- Login
- Get tickets
- Create ticket
- Get ticket by ID
- Update ticket
- Delete ticket
- Get comments
- Add comment
- Get users/agents where appropriate

APIs must include:

- Input validation
- Appropriate HTTP status codes
- JSON responses
- Meaningful error responses
- Correct authorization

### Frontend

Complete:

- React routing
- Protected routes
- Role-based access
- Reusable components
- Forms
- Client-side validation
- API integration
- Loading states
- Error states
- Responsive layout
- Customer dashboard
- Agent dashboard
- Ticket detail views

### Phase 2 Completion Check

Before moving forward, verify:

- Customer can create and view tickets.
- Customer can add comments.
- Customer cannot access another customer's ticket.
- Agent can view all tickets.
- Agent can update status and priority.
- Agent can assign tickets.
- Agent can respond to tickets.
- Search/filter/sort functionality works.
- Required APIs work from the frontend.
- Loading and error states work.

---

## Phase 3 — Testing, GitHub, Deployment & Final Submission

### Goal
Verify the application, test the required scenarios, deploy it, and prepare the final submission.

### API Testing

Create the required Postman collection covering:

- Successful registration
- Successful login
- Invalid login
- Create ticket
- Get tickets
- Get ticket by ID
- Update ticket
- Unauthorized API request
- Forbidden request for incorrect role
- Invalid input
- Not-found ticket

### Automated Testing

Implement 5–10 meaningful unit/API tests covering important scenarios such as:

- Valid login succeeds
- Invalid password is rejected
- Ticket creation succeeds
- Unauthorized user cannot access protected data
- Customer cannot access another customer's ticket
- Agent can update ticket status
- Invalid ticket ID returns the appropriate error

### Security Verification

Check:

- Passwords are hashed.
- JWT validation works.
- Authentication and authorization are separate.
- Customer ticket access is restricted.
- Agent-only APIs are protected.
- CORS is configured.
- Secrets use environment variables.
- Real credentials are not committed to GitHub.

### Git & GitHub

- Make meaningful commits.
- Push the complete project to GitHub.
- Ensure secrets are excluded.
- Include `.env.example`.

### README

Include:

- Project overview
- Technology stack
- Setup instructions
- Environment variable instructions
- How to run frontend
- How to run backend
- Database setup
- Test instructions
- Deployment information

### Deployment

Deploy:

- React frontend
- Django backend/API
- MySQL database

Verify that the deployed application can be accessed publicly.

### Final Submission

Prepare:

- Live application URL
- GitHub repository URL
- Postman collection
- README
- Database schema
- Database seed/sample data

### Phase 3 Completion Check

The project is complete only after:

- Required features work.
- Required APIs work.
- Required tests pass.
- Postman collection is complete.
- GitHub repository is ready.
- README is complete.
- Application is publicly deployed.
- Final URLs and required files are ready for submission.

---

## Development Rule

Do not move to the next phase until the current phase's completion checks are working.

Do not add optional enhancements or unnecessary features during these phases.
