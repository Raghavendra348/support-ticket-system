# PRD — Support Ticket Management System

## 1. Project Overview

Build a simple web-based Support Ticket Management System for a company.

Customers can register, log in, create support tickets, view their own tickets, and add comments. Support agents can log in, view and manage support tickets, update ticket status and priority, assign tickets, and respond to customers.

The application must be a working full-stack application with a React frontend, Django REST backend, MySQL database, JWT authentication, testing, Git/GitHub, and public deployment.

## 2. Objective

The project should demonstrate practical junior full-stack development skills:

- Frontend development with React
- Backend REST APIs with Django
- MySQL database design and CRUD operations
- JWT authentication and role-based authorization
- API integration
- Unit/API testing
- Git/GitHub usage
- Debugging and validation
- Cloud deployment

Keep the implementation simple, clear, and easy for a junior/fresher developer to understand and explain.

## 3. Technology Stack

### Frontend
- React.js
- JavaScript
- React Router for frontend routing where required
- Fetch, Axios, or equivalent for API integration

### Backend
- Python
- Django
- Django REST Framework for REST APIs

### Database
- MySQL

### Authentication
- JWT-based authentication

### API Testing
- Postman

### Automated Testing
- PyTest

### Version Control
- Git
- GitHub

### Deployment
- Any suitable cloud platform that provides a publicly accessible application
- Remotely accessible MySQL database

## 4. User Roles

### Customer

Customers can:

- Register
- Log in
- View their dashboard
- Create support tickets
- View their own tickets
- View ticket details
- View ticket comments/responses
- Add comments to their existing tickets
- Search and filter their tickets

Customers must not be able to view or modify another customer's tickets.

### Support Agent

Support agents can:

- Log in
- View the agent dashboard
- View ticket statistics
- View all support tickets
- Search tickets
- Filter tickets
- Sort tickets
- View ticket details
- Update ticket status
- Update ticket priority
- Assign a ticket to an agent
- Add responses/comments

Agents must not perform unauthorized administrative actions.

## 5. Authentication & Authorization

Implement:

- Customer registration
- Customer login
- Agent login
- Password hashing
- JWT-based authentication
- Logout functionality
- Protected frontend routes
- Protected backend APIs
- Role-based authorization

Passwords must never be stored as plain text.

Authentication and authorization must be handled separately.

Customer and agent permissions must be enforced on the backend, not only in the frontend.

## 6. Customer Features

### Customer Dashboard

Show the customer's support tickets.

### Create Ticket

A customer can create a ticket with:

- Subject
- Description
- Priority

### Ticket Details

A customer can:

- View ticket details
- View comments/responses
- Add comments

### Search and Filter

Customers must be able to search and filter their tickets.

## 7. Support Agent Features

### Agent Dashboard

Show ticket statistics.

### Ticket Management

Agents can:

- View all support tickets
- Search tickets
- Filter tickets
- Sort tickets
- View ticket details
- Update status
- Update priority
- Assign a ticket to an agent
- Add responses/comments

## 8. Required REST APIs

Implement these required API endpoints:

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | /api/auth/register | Register customer | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/tickets | Get tickets | Authenticated |
| POST | /api/tickets | Create ticket | Customer |
| GET | /api/tickets/:id | Get ticket details | Authorized user |
| PUT | /api/tickets/:id | Update ticket | Agent/authorized user |
| DELETE | /api/tickets/:id | Delete ticket | As defined by candidate |
| GET | /api/tickets/:id/comments | Get comments | Authorized user |
| POST | /api/tickets/:id/comments | Add comment | Authenticated |
| GET | /api/users | Get users/agents where appropriate | Agent |

Additional APIs may be created only when they are required to support the specified functionality.

All APIs should:

- Use appropriate HTTP status codes
- Validate input
- Return JSON responses
- Return meaningful error responses
- Enforce authentication and authorization where required

## 9. MySQL Database

At minimum, create these related tables/models.

### users

Required fields:

- id
- name
- email
- password_hash
- role
- created_at

### tickets

Required fields:

- id
- user_id
- subject
- description
- priority
- status
- assigned_to
- created_at
- updated_at

### ticket_comments

Required fields:

- id
- ticket_id
- user_id
- comment
- created_at

The database must demonstrate:

- Primary keys
- Foreign keys/relationships
- One-to-many relationships
- CRUD operations
- JOIN-equivalent relational queries
- Basic indexes for frequently searched fields
- Basic awareness of query performance
- Database schema
- Seed/sample data

Use Django models and ORM methods for database access.

## 10. Required Database Query

Provide a query that returns all open tickets together with:

- Customer name
- Customer email

The query must demonstrate:

- Joining the ticket/customer data
- Filtering for open tickets

The implementation may use the appropriate Django ORM query while also documenting the equivalent SQL where needed.

## 11. Frontend Requirements

The React application must include:

- Reusable components
- Forms with client-side validation
- API integration
- Loading states
- Error states
- Responsive layout
- Protected routes based on authentication
- Customer dashboard
- Agent dashboard
- Ticket detail views
- Clear navigation appropriate to the user's role

The UI should remain simple and professional. Do not add unnecessary screens or features outside the assessment.

## 12. Security Requirements

Implement the following:

- Password hashing
- JWT validation
- Separate authentication and authorization
- Customers cannot access another customer's tickets
- Agent-only APIs are protected
- Use Django ORM/parameterized database access to reduce SQL injection risk
- Configure CORS appropriately
- Do not commit passwords, database credentials, or API secrets to GitHub
- Use environment variables for secrets and configuration

## 13. API Testing

Provide a Postman collection covering at least:

- Successful registration
- Successful login
- Invalid login
- Create ticket
- Get tickets
- Get ticket by ID
- Update ticket
- Unauthorized API request
- Forbidden request for an incorrect role
- Invalid input
- Not-found ticket

## 14. Automated Testing

Implement a minimum of 5–10 meaningful unit/API tests.

Tests should cover scenarios such as:

- Valid login succeeds
- Invalid password is rejected
- Ticket creation succeeds
- Unauthorized user cannot access protected data
- Customer cannot access another customer's ticket
- Agent can update ticket status
- Invalid ticket ID returns the appropriate error

Use PyTest with the Django application.

## 15. Git & GitHub

The project must be maintained using Git.

Use meaningful commits rather than one final upload.

The repository should contain a practical structure similar to:

    support-ticket-system/
    ├── frontend/
    ├── backend/
    ├── database/
    │   ├── schema.sql
    │   └── seed.sql
    ├── tests/
    ├── README.md
    └── .env.example

A docker-compose.yml is optional and is not required.

## 16. Deployment

Deployment is mandatory.

The evaluator must be able to access the application without running it locally.

Provide:

- Public frontend URL
- Deployed backend/API URL where applicable
- Cloud-hosted or remotely accessible MySQL database
- Secure environment variable configuration
- README with setup and deployment instructions

## 17. Final Submission

The final submission must include:

- Live application URL
- GitHub repository URL
- Postman collection
- README
- Database schema script
- Database seed/sample data script

## 18. Scope Control

Implement the required assessment features only.

Do not add optional enhancements unless specifically requested later.

The following are explicitly optional and should not be included in the initial implementation:

- Docker / Docker Compose
- TypeScript
- Pagination
- Advanced database indexing/query optimization
- File attachments
- Email notifications
- CI/CD pipeline
- Redis caching
- Cloud monitoring/logging

Do not introduce additional business features, complex architecture, or unnecessary libraries.

## 19. Success Criteria

The project is complete when:

1. Customers can register and log in.
2. Agents can log in.
3. JWT authentication works.
4. Role-based authorization works.
5. Customers can create and manage/view their permitted tickets.
6. Customers cannot access another customer's tickets.
7. Agents can view and manage support tickets according to their permissions.
8. Comments/responses work.
9. Required REST APIs work with validation and meaningful errors.
10. MySQL stores the required relational data.
11. Required Postman tests are provided.
12. At least 5–10 meaningful automated tests pass.
13. The project is committed to GitHub with meaningful commits.
14. The application is publicly deployed.
15. README, schema/seed scripts, and Postman collection are included.

## 20. Development Principle

Build the application incrementally and keep every implementation understandable for a junior/fresher developer.

Follow the assessment requirements as the source of truth. Do not over-engineer the project or implement features that are not required.
