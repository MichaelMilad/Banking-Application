# 🏦 Banking Application - Learning Project

A production-ready Node.js banking application built with Express, TypeScript, and MySQL to learn backend development concepts including authentication, database management, and concurrency control.

## 📚 Learning Objectives

This project demonstrates:

- **RESTful API Design** with Express
- **Clean Architecture** (Repository → Service → Controller pattern)
- **Type Safety** with TypeScript
- **Database Management** with Knex.js migrations
- **Authentication & Authorization** (JWT + OTP)
- **Input Validation** with Joi
- **Error Handling** patterns
- **Concurrency Control** (upcoming: locks & queues)
- **Soft Delete** pattern for data retention

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL with Knex.js ORM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Email**: Nodemailer (OTP delivery)
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
src/
├── app.ts                    # Application entry point
├── router.ts                 # Main route aggregator
├── components/               # Feature modules
│   ├── auth/                 # Authentication (signup, login, OTP)
│   ├── user/                 # User management
│   └── account/              # Banking accounts (upcoming)
├── config/                   # Configuration files
│   ├── knex.ts              # Database connection
│   └── swagger.ts           # API documentation
├── database/
│   ├── migrations/          # Database schema versions
│   └── seeds/               # Sample data
├── middlewares/             # Express middlewares
│   ├── error-handler.ts    # Global error handling
│   └── validator.ts        # Request validation
├── types/                   # TypeScript interfaces
└── utils/                   # Helper functions
```

## 🔑 Key Concepts Implemented

### 1. **Clean Architecture Pattern**

Each feature follows the layered architecture:

- **Repository**: Database queries (data access layer)
- **Service**: Business logic
- **Controller**: HTTP request handling
- **Router**: Route definitions
- **Validation**: Input validation schemas

**Benefits**:

- Easy to test each layer independently
- Changes in one layer don't affect others
- Clear separation of concerns

### 2. **Custom Error Handling**

```typescript
// Custom error classes with HTTP status codes
throw new BadRequestError('Invalid credentials');
throw new NotFoundError('User not found');
throw new ConflictError('Email already exists');
```

All errors are caught by the global error handler middleware.

### 3. **Soft Delete Pattern**

```typescript
// Soft delete: Mark as deleted (keeps data)
deleted_at: timestamp

// Hard delete: Permanently remove from DB
DELETE FROM users WHERE key = ?
```

**Why?** Audit trails, data recovery, compliance requirements.

### 4. **JWT Authentication Flow**

1. User signs up → Receive OTP via email
2. Verify OTP → Account activated
3. Login → Receive access token (15min) + refresh token (7d)
4. Use access token for protected routes
5. Refresh when access token expires

### 5. **Database Migrations**

```bash
npm run db:migrate    # Apply migrations
npm run db:down       # Rollback last migration
npm run db:seed       # Insert seed data
```

**Why?** Version control for database schema, team collaboration.

### 6. **Input Validation with Joi**

```typescript
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});
```

Validates requests before they reach controllers.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL (v8+)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd Banking_Application
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**
   Create a `.env` file:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bank_app
DB_PORT=3306

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

4. **Run database migrations**

```bash
npm run db:migrate
```

5. **Seed database (optional)**

```bash
npm run db:seed
```

6. **Start development server**

```bash
npm run dev
```

Server runs at `http://localhost:3000`

## 📖 API Endpoints

### Authentication

```
POST /auth/signup       # Create new user
POST /auth/verify       # Verify OTP
POST /auth/login        # Login user
```

### Users

```
GET  /users             # Get all active users
DELETE /users/:userKey  # Soft delete user
```

### Health Check

```
GET /api/health         # Server & database status
```

### Documentation

```
GET /api-docs           # Swagger UI
```

## 🧪 Testing Endpoints

### 1. Sign Up

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### 2. Verify OTP

```bash
curl -X POST http://localhost:3000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "userKey": "<user-key-from-signup>",
    "otp": "123456"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🎯 Upcoming Features

### Concurrency Control

- **Database Locks**: Prevent race conditions in transfers
- **Queues**: Handle high-volume transactions
- **Transactions**: ACID compliance for money transfers

Example scenario:

```typescript
// Without locks: Race condition possible
// User A transfers $100
// User B transfers $100
// Both read balance: $200
// Both write balance: $100 (should be $0!)

// With locks: Safe
await knex.transaction(async (trx) => {
  const account = await trx('accounts')
    .where({ id: accountId })
    .forUpdate() // 🔒 Lock row
    .first();

  // Safe to update
});
```

## 📝 Code Quality

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format code with Prettier
npm run build         # Compile TypeScript
npm test              # Run tests (when added)
```

## 🐛 Common Issues & Solutions

### Issue: Database connection failed

**Solution**: Check MySQL is running and credentials in `.env` are correct

### Issue: OTP email not sending

**Solution**:

- For Gmail: Enable "App Passwords" in account settings
- Check SMTP settings in `.env`

### Issue: JWT token expired

**Solution**: Use refresh token to get new access token (implement refresh endpoint)

## 🔐 Security Best Practices

✅ **Implemented**:

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Input validation on all endpoints
- SQL injection prevention (Knex parameterized queries)
- Soft delete for data retention

🚧 **TODO**:

- Rate limiting (prevent brute force)
- CORS configuration
- Helmet.js for security headers
- Request logging
- Environment variable validation

## 📚 Learning Resources

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Knex.js Documentation](http://knexjs.org/)
- [JWT Introduction](https://jwt.io/introduction)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Database Transactions](https://en.wikipedia.org/wiki/Database_transaction)

## 🤝 Contributing

This is a learning project! Feel free to:

- Add features
- Improve code quality
- Fix bugs
- Add tests
- Improve documentation

## 📄 License

ISC

---

**Built for learning backend development concepts** 🚀
