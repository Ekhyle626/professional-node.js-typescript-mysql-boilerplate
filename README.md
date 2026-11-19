1. Most challenging part & how I overcame it:
Aligning TypeScript, TypeORM, DTO validation, UUIDs, and route conventions cleanly across layers. I overcame it by following the layered structure (routes -> middleware -> controllers -> services -> entities) and testing endpoints step by step.

2. Differences & improvements over Midterm:
This boilerplate uses a cleaner TypeScript layered architecture, Joi/DTO validation, centralized error handling, and TypeORM instead of ad-hoc endpoints and repetitive logic.

3. Why centralized error handling > try-catch in every controller:
It avoids duplicate try-catch blocks in controllers and ensures every error returns a consistent response format.

4. How Joi request validation improves security & code quality:
It blocks invalid or malformed inputs early before they reach services or the database, keeping validation rules clean and reusable in DTOs.

5. synchronize: true vs. migrations (and why migrations are essential in production):
synchronize: true auto-updates tables on startup, which can cause accidental schema/data loss; migrations are versioned, controllable changes safe for production.

6. Structured logging (Winston) vs. console.log:
Winston adds timestamps, log levels, and context, and writes to log files for easier production debugging instead of plain unformatted console output.

7. Adding a new feature (e.g., Product CRUD):
Follow the User pattern and add a Product entity, DTO/Joi schemas, service, controller, routes (mounted in routes/index.ts), and migration.

8. Additional features for production readiness:
Add authentication/authorization, rate limiting, CORS config, request tracking, and automated tests.
