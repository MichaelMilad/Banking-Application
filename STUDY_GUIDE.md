# 📖 Study Guide & Learning Path

## Project Overview

You've built a **production-ready banking application** that demonstrates essential backend concepts. This guide will help you understand what you've accomplished and what to study next.

---

## ✅ What You've Learned So Far

### 1. **Backend Fundamentals**

- ✅ RESTful API design with Express.js
- ✅ TypeScript for type safety
- ✅ Environment variables for configuration
- ✅ Middleware pattern in Express

### 2. **Database Management**

- ✅ MySQL relational database
- ✅ Knex.js query builder
- ✅ Database migrations (version control for schema)
- ✅ Seeding data
- ✅ Foreign key relationships

### 3. **Authentication & Security**

- ✅ Password hashing with bcrypt
- ✅ JWT (JSON Web Tokens)
- ✅ Access & Refresh token pattern
- ✅ OTP (One-Time Password) verification
- ✅ Email verification flow

### 4. **Software Architecture**

- ✅ Layered architecture (Router → Controller → Service → Repository)
- ✅ Separation of concerns
- ✅ Custom error handling
- ✅ Input validation with Joi

### 5. **API Design**

- ✅ Request/response structure
- ✅ HTTP status codes (200, 400, 401, 404, etc.)
- ✅ Error messages
- ✅ API documentation with Swagger

---

## 🎯 Key Concepts Demonstrated

### Repository Pattern

**What**: Abstracts database queries into reusable functions  
**Why**: Changes to database don't affect business logic  
**Example**: `getUserById()` hides the Knex query implementation

### Service Layer

**What**: Contains business logic separate from HTTP handling  
**Why**: Can reuse logic in different contexts (REST, GraphQL, CLI)  
**Example**: `createUserService()` handles user creation, OTP generation, and rollback

### Middleware Pattern

**What**: Functions that execute before route handlers  
**Why**: Reusable logic for validation, auth, logging  
**Example**: `validator(schema)` checks requests before controllers

### Transaction Management

**What**: Group of database operations that succeed or fail together  
**Why**: Maintains data consistency  
**Example**: User creation + OTP creation (if OTP fails, rollback user)

### Soft Delete Pattern

**What**: Mark records as deleted instead of removing them  
**Why**: Data recovery, audit trails, compliance  
**Example**: `deleted_at` timestamp instead of DELETE query

---

## 🚀 Next Learning Steps

### Phase 1: Strengthen Fundamentals ⭐

**Priority: HIGH**

1. **Add Unit Tests**

   ```bash
   npm install jest ts-jest @types/jest --save-dev
   ```

   - Test services independently
   - Mock repositories
   - Learn TDD (Test-Driven Development)

2. **Add Authentication Middleware**

   ```typescript
   // Protect routes that need authentication
   router.get('/profile', authMiddleware, userController.getProfile);
   ```

3. **Implement Refresh Token**
   - Add refresh token endpoint
   - Store refresh tokens in database
   - Rotate tokens on use

### Phase 2: Banking Features 🏦

**Priority: HIGH** (Your main learning goal!)

1. **Create Accounts Table**

   ```typescript
   // Migration: create_accounts_table
   table.uuid('id').primary();
   table.uuid('user_key').references('key').inTable('users');
   table.decimal('balance', 15, 2).defaultTo(0);
   table.string('account_type'); // 'checking', 'savings'
   table.string('account_number').unique();
   ```

2. **Implement Concurrency Control** ⚠️ **Critical for Banking**
   - Database locks (`forUpdate()`)
   - Transactions for transfers
   - Test with concurrent requests
   - See `CONCURRENCY.md` for details

3. **Add Transaction History**

   ```typescript
   // Track all money movements
   table.uuid('id').primary();
   table.uuid('account_id');
   table.enum('type', ['credit', 'debit']);
   table.decimal('amount', 15, 2);
   table.decimal('balance_after', 15, 2);
   table.timestamp('created_at');
   ```

4. **Implement Transfer Endpoint**
   ```typescript
   POST /accounts/transfer
   {
     "fromAccountId": "uuid",
     "toAccountId": "uuid",
     "amount": 100.00,
     "description": "Payment for services"
   }
   ```

### Phase 3: Advanced Features 🔥

**Priority: MEDIUM**

1. **Add Message Queue**

   ```bash
   npm install bull redis
   ```

   - Async transaction processing
   - Retry failed operations
   - Handle high load
   - See `CONCURRENCY.md` → Queues section

2. **Implement Rate Limiting**

   ```bash
   npm install express-rate-limit
   ```

   - Prevent brute force attacks
   - Limit login attempts
   - API throttling

3. **Add Request Logging**

   ```bash
   npm install morgan winston
   ```

   - Log all requests
   - Track performance
   - Debug issues

4. **Implement CORS Properly**
   ```typescript
   app.use(
     cors({
       origin: process.env.FRONTEND_URL,
       credentials: true,
     }),
   );
   ```

### Phase 4: Production Ready 🚢

**Priority: LOW** (After features work)

1. **Add Monitoring**
   - Health checks
   - Performance metrics
   - Error tracking (Sentry)

2. **Add Docker**

   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   CMD ["npm", "start"]
   ```

3. **CI/CD Pipeline**
   - GitHub Actions
   - Automated tests
   - Deployment automation

4. **API Versioning**
   ```typescript
   router.use('/v1/users', usersRouterV1);
   router.use('/v2/users', usersRouterV2);
   ```

---

## 📚 Study Resources by Topic

### Concurrency Control (Your Priority!)

- **Book**: "Database Internals" by Alex Petrov (Chapter on Transactions)
- **Article**: [MySQL Locking Reads](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)
- **Video**: [How Database Transactions Work](https://www.youtube.com/watch?v=6Q0b7c6XNXg)
- **Practice**: Implement the examples in `CONCURRENCY.md`

### Testing

- **Documentation**: [Jest Getting Started](https://jestjs.io/docs/getting-started)
- **Article**: [Testing Node.js with Jest](https://www.testim.io/blog/node-js-unit-testing-get-started-quickly-with-examples/)
- **Practice**: Write tests for `auth.service.ts`

### Architecture Patterns

- **Book**: "Clean Architecture" by Robert C. Martin
- **Article**: [Repository Pattern Explained](https://deviq.com/design-patterns/repository-pattern)
- **Reference**: Your `ARCHITECTURE.md` file

### Security

- **Guide**: [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- **Article**: [JWT Best Practices](https://curity.io/resources/learn/jwt-best-practices/)
- **Tool**: [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

## 🧪 Practice Exercises

### Exercise 1: Add Deposit Endpoint

```typescript
POST /accounts/:accountId/deposit
{
  "amount": 100.00,
  "description": "Salary"
}
```

**What to learn:**

- Input validation (amount must be positive)
- Transaction safety
- Update balance atomically
- Record transaction history

### Exercise 2: Add Withdrawal with Limits

```typescript
POST /accounts/:accountId/withdraw
{
  "amount": 50.00
}
```

**What to learn:**

- Check sufficient balance
- Apply daily withdrawal limits
- Handle overdraft scenarios
- Test edge cases (negative amounts, zero, etc.)

### Exercise 3: Test Concurrent Transfers

**Setup:**

1. Create account with $100 balance
2. Send 10 concurrent transfer requests of $20 each
3. Check final balance (should reject some transfers)

**What to learn:**

- Race conditions
- Database locks
- Transaction isolation
- Error handling

### Exercise 4: Add Account Statements

```typescript
GET /accounts/:accountId/statement?startDate=2025-01-01&endDate=2025-01-31
```

**What to learn:**

- Date range queries
- Pagination
- Filtering
- Response formatting

---

## 🐛 Common Mistakes & How to Fix

### Mistake 1: Not Using Transactions

```typescript
// ❌ BAD
await knex('accounts').decrement('balance', 100);
// If crash happens here, money vanishes!
await knex('accounts').increment('balance', 100);

// ✅ GOOD
await knex.transaction(async (trx) => {
  await trx('accounts').decrement('balance', 100);
  await trx('accounts').increment('balance', 100);
});
```

### Mistake 2: Not Validating Amounts

```typescript
// ❌ BAD
const amount = req.body.amount; // Could be negative!

// ✅ GOOD
const amount = parseFloat(req.body.amount);
if (amount <= 0) {
  throw new BadRequestError('Amount must be positive');
}
```

### Mistake 3: Not Checking Balance

```typescript
// ❌ BAD
await knex('accounts').decrement('balance', amount); // Can go negative!

// ✅ GOOD
const account = await knex('accounts').where({ id }).forUpdate().first();
if (account.balance < amount) {
  throw new BadRequestError('Insufficient funds');
}
await knex('accounts').where({ id }).decrement('balance', amount);
```

### Mistake 4: Floating Point Errors

```typescript
// ❌ BAD: JavaScript numbers
const total = 0.1 + 0.2; // = 0.30000000000000004

// ✅ GOOD: Store cents as integers
const cents = Math.round(amount * 100); // $1.50 = 150 cents
// Or use decimal column type in database
table.decimal('balance', 15, 2);
```

---

## 🎓 Quiz: Test Your Understanding

### Question 1: Layers

**Where should password hashing happen?**

- A) Controller
- B) Service ✅
- C) Repository
- D) Middleware

**Why?** Business logic belongs in services.

### Question 2: Transactions

**When transferring money between accounts, what happens if the second update fails?**

- A) First account debited, second unchanged ❌
- B) Both updates rolled back ✅
- C) Second account credited only
- D) Error is ignored

**Why?** Transactions ensure all-or-nothing execution.

### Question 3: Security

**Where is JWT validated?**

- A) Client-side
- B) Controller
- C) Middleware ✅
- D) Service

**Why?** Authentication checks happen before controllers run.

### Question 4: Concurrency

**What does `forUpdate()` do?**

- A) Updates the row immediately
- B) Locks the row for other transactions ✅
- C) Deletes the row
- D) Creates a backup

**Why?** Prevents other transactions from reading/writing the same row.

---

## 📝 Project Checklist

### Current Status

- ✅ User registration with OTP
- ✅ Email verification
- ✅ Login with JWT
- ✅ User management (list, delete)
- ✅ Error handling
- ✅ Input validation
- ✅ API documentation
- ✅ Database migrations

### Next Priorities

- ⬜ Create accounts table
- ⬜ Implement deposit/withdrawal
- ⬜ Implement transfers with locks
- ⬜ Add transaction history
- ⬜ Test concurrent transactions
- ⬜ Add unit tests
- ⬜ Add authentication middleware
- ⬜ Implement message queue

### Nice to Have

- ⬜ Add logging with Winston
- ⬜ Add rate limiting
- ⬜ Add monitoring/metrics
- ⬜ Docker setup
- ⬜ CI/CD pipeline
- ⬜ Load testing
- ⬜ API versioning

---

## 💡 Tips for Effective Learning

1. **Code First, Optimize Later**
   - Get it working
   - Then make it better
   - Don't over-engineer early

2. **Test Your Assumptions**
   - Write tests
   - Try edge cases
   - Break things intentionally

3. **Read Error Messages Carefully**
   - They tell you exactly what's wrong
   - Google the error
   - Check Stack Overflow

4. **Use Console/Logger**

   ```typescript
   logger.debug('Account before:', account);
   // ... operation ...
   logger.debug('Account after:', updatedAccount);
   ```

5. **Document as You Go**
   - Comment complex logic
   - Update README
   - Write inline docs

6. **Learn from Production Code**
   - Read open source projects
   - Study popular libraries
   - See how pros do it

---

## 🎯 Your Next Session Goals

1. **Immediate** (This week):
   - Create `accounts` table migration
   - Implement deposit endpoint
   - Add authentication middleware

2. **Short-term** (This month):
   - Implement transfer with database locks
   - Add transaction history
   - Test concurrent operations
   - Write first unit tests

3. **Long-term** (Next 3 months):
   - Add message queue
   - Implement all banking operations
   - Add comprehensive tests
   - Deploy to production

---

**Remember**: You're learning by building real-world features. Each concept you implement will help you in professional development. Focus on concurrency control - it's rare to find in tutorials but critical for production systems!

Good luck! 🚀
