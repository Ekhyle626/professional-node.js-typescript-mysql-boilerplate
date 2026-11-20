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



Activity 9
Authentication checks who you are, while authorization checks what you are allowed to do. Scanning a badge at the door is authentication, and only letting managers open the safe is authorization.

A JWT is stateless because the server does not store session data or check a session table on each request since the token holds the verified user info itself. This helps scalability because any server instance can verify the token independently without shared session storage.

A JWT has three parts: the header shows the token type and signing algorithm, the payload holds the user data and token metadata like expiration, and the signature proves the token was not altered and came from your server.

You should never put sensitive data like passwords in a JWT payload because payloads are only encoded rather than encrypted, meaning anyone can decode and read them.

Bcrypt protects passwords by hashing them slowly so brute-force guessing takes too long. A salt is random data added per user so identical passwords have different hashes and rainbow tables fail, while rounds set how many times hashing runs to increase resistance as hardware gets faster.

If someone steals a JWT, they can impersonate that user until the token expires. You can mitigate this by using short token expiration times, enforcing HTTPS, storing tokens safely such as in HttpOnly cookies, and rotating or revoking tokens when needed.

HTTPS is important when transmitting JWTs because it encrypts network traffic so attackers cannot intercept the token in transit and replay it.

A short-lived access token is sent with regular API requests to access protected data for a brief window, while a long-lived refresh token is used at a refresh endpoint to get a new access token without logging in again.

The auth middleware extracts the token from the Authorization header, verifies its signature and expiration, reads the user info from the payload, and attaches it to the request object before passing control to the route.

To add role-based authorization in your setup, add a role field to the user and JWT payload, create a middleware that checks the user's role and returns a 403 error if unauthorized, and attach that middleware to admin-only routes.