# RULES — Support Ticket Management System

## 1. Source of Truth

- Follow `PRD.md` and the technical assessment requirements exactly.
- Build only the features required by the assessment.
- Do not invent additional business requirements.
- If a requirement is unclear, keep the implementation simple and aligned with the assessment.

## 2. Technology

- Frontend: React.js with JavaScript.
- Backend: Django + Django REST Framework.
- Database: MySQL.
- Authentication: JWT.
- API testing: Postman.
- Automated testing: PyTest.
- Version control: Git/GitHub.

Do not introduce a different framework or database unless explicitly requested.

## 3. Development Style

- Keep the code simple and beginner/fresher friendly.
- Prefer clear, readable code over complex abstractions.
- Use Django models and ORM for database operations.
- Use reusable React components where they are naturally useful.
- Avoid unnecessary packages and dependencies.
- Do not over-engineer the application.
- Do not build optional features unless explicitly requested.

## 4. Authentication & Authorization

- Never store passwords as plain text.
- Use JWT authentication.
- Protect authenticated frontend routes.
- Protect authenticated backend APIs.
- Enforce role-based authorization on the backend.
- Keep authentication and authorization separate.
- Customers can access only their permitted tickets.
- A customer must never be able to access another customer's ticket.
- Agent-only APIs must reject unauthorized roles.
- Implement logout.

## 5. API Rules

- Follow the required API endpoints in `PRD.md`.
- Use appropriate HTTP status codes.
- Validate request input.
- Return JSON responses.
- Return clear and meaningful error messages.
- Do not expose unnecessary data.
- Add an API only when it is required by the specified functionality.

## 6. Database Rules

- Use MySQL.
- Use proper primary keys and foreign-key relationships.
- Maintain the required `users`, `tickets`, and `ticket_comments` relationships.
- Use Django ORM methods for database access.
- Use appropriate indexes for frequently searched fields.
- Avoid unnecessary database complexity.
- Include schema and seed/sample data as required.

## 7. Frontend Rules

- Use React.js.
- Provide protected routes based on authentication and role.
- Include client-side form validation.
- Include loading states.
- Include error states.
- Keep the layout responsive.
- Keep customer and agent dashboards clear and simple.
- Use consistent reusable UI components.
- Do not add unnecessary screens or interactions.

## 8. Security Rules

- Use password hashing.
- Validate JWTs correctly.
- Configure CORS appropriately.
- Use environment variables for secrets and configuration.
- Never commit passwords, database credentials, JWT secrets, or API secrets.
- Include `.env.example` without real secrets.
- Use Django ORM/parameterized database access to reduce SQL injection risk.

## 9. Testing Rules

- Provide the required Postman collection.
- Cover successful and unsuccessful API scenarios listed in the PRD.
- Implement 5–10 meaningful automated unit/API tests.
- Tests must include important authentication, authorization, ticket, and error scenarios.
- Do not create meaningless tests just to increase the test count.

## 10. Git Rules

- Use Git from the beginning of development.
- Make meaningful commits for actual development steps.
- Do not use one large final commit.
- Keep secrets and environment files containing real credentials out of GitHub.

## 11. Deployment Rules

- The final application must be publicly accessible.
- Deploy the frontend.
- Deploy the backend/API where applicable.
- Use a remotely accessible MySQL database.
- Configure production environment variables securely.
- Verify the deployed application before final submission.

## 12. Scope Rules

The following are optional in the assessment and should NOT be implemented unless explicitly requested:

- Docker / Docker Compose
- TypeScript
- Pagination
- Advanced database indexing/query optimization
- File attachments
- Email notifications
- CI/CD pipeline
- Redis caching
- Cloud monitoring/logging

Do not add other unnecessary features such as chat systems, notifications, analytics dashboards beyond the required ticket statistics, payment systems, or complex admin systems.

## 13. Build Process

- Follow the phases defined in `PHASES.md`.
- Complete and verify one phase before moving to the next.
- Do not implement future-phase features prematurely.
- Keep the application runnable during development.
- Fix errors before adding unrelated functionality.

## 14. UI Rules

- Follow `COLORS.md` for the visual style.
- Keep the interface professional, clean, and simple.
- Avoid excessive animations, gradients, or decorative elements.
- Prioritize usability and clear ticket information.

## 15. Final Rule

The goal is to satisfy the technical assessment, not to build a large production platform.

When deciding between a simple solution and a complex solution that both satisfy the requirement, use the simple solution.
