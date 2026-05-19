# Banking Application — Project Notes for Claude

## Stack
- **Runtime**: Node.js, TypeScript (ESM — `"type": "module"` in package.json), Express 5
- **DB**: MySQL via Knex (migrations in `src/database/migrations/`)
- **Auth**: `jsonwebtoken` (HS256 by default), `bcrypt` for password + OTP hashing
- **Validation**: Joi (schemas use `{ body, params, query }` envelope — see `src/middlewares/validator.ts`)
- **Docs**: Swagger via per-module `*.openapi.ts` aggregated in `src/config/swagger.ts`
- **Misc**: RabbitMQ (`amqplib`), Mailjet/Nodemailer for OTP emails

## Layout
- `src/components/<module>/` — `router.ts`, `controller.ts`, `service.ts`, `repository.ts`, `interfaces.ts`, `validations.ts`, `openapi.ts`. Treat each module as self-contained.
- `src/middlewares/` — cross-cutting: `error-handler.ts`, `validator.ts`.
- `src/utils/` — `errors.ts` (typed `ApiError` hierarchy used by `error-handler`), `logger.ts`, `mailing.ts`, `message-broker.ts`.
- `src/types/common.ts` — shared cross-module types (HttpStatus, pagination, timestamps).
- `src/router.ts` mounts `/users`, `/auth`, `/accounts`.

## Conventions
- **Errors**: throw `BadRequestError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`, etc. from `src/utils/errors.ts`. The global `errorHandler` formats them. Don't `res.status(...).json(...)` for errors inside services — throw and let the handler do it.
- **Async controllers**: every controller is `async (req, res, next)` and wraps the body in `try { ... } catch (error) { next(error); }`. Keep that shape.
- **Repository layer** owns all Knex calls. Services never touch knex directly.
- **Identifiers**: external IDs are UUID `key` columns (not auto-increment `id`). Always expose `key` to clients.
- **Soft delete**: users use `deleted_at` + `is_active`. The `activeUsers()` helper in `user.repository.ts` filters both.
- **JWT**: two secrets — `JWT_SECRET` (access, 15m) and `JWT_REFRESH_SECRET` (refresh, 7d). Payloads use `sub`, `type` (`TokenType` enum), and module-specific fields. See `src/components/auth/auth.interfaces.ts`.
- **No `any`** unless unavoidable; the repo is strict-mode TS. If you see `any`, prefer fixing it (e.g. `getUserForLogin` currently returns `any` — should be `IUser | undefined`).

## Schema gotchas (read before touching auth)
- `users` table: `key, email, username, password, is_active, deleted_at, created_at, updated_at`. **No `name` column. No `role` column.** Anything that needs them requires a migration first.
- OTPs live in `otp_codes`, keyed by `user_key`.

## Running
- `npm run dev` — tsx watch on `src/app.ts`
- `npm run db:migrate` — apply latest migrations
- `npm run lint` / `npm run format`

## Things to avoid
- Don't introduce new util folders or "service abstractions" for one-off needs — extend the existing module structure.
- Don't bypass the validator middleware for new endpoints that take input.
- Don't add `console.log` for new code; the `logger` util exists for a reason.
- Don't read `process.env` outside of config/service top-level — load secrets once and pass them.
