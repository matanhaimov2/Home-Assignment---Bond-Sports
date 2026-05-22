# Bond Sports - Account Management System

A robust and secure backend service for managing user accounts and financial transactions, built with NestJS, Prisma, and PostgreSQL.

## 🚀 Overview
This project provides a reliable REST API for financial account management. It features transactional integrity for deposits and withdrawals, business logic enforcement (e.g., daily withdrawal limits), and a clean, scalable architecture.

## 🛠 Tech Stack
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: class-validator & class-transformer
- **Testing**: Jest

## ⚙️ Key Business Logic
- **Transactional Integrity**: Uses Prisma's $transaction to ensure balance updates and ledger entries occur atomically.
- **Resilience**: Custom Exception Filters for standardized error handling (404, 400, 409).
- **Security**: Strict validation of account status and withdrawal constraints.

## 🚦 Getting Started
1. Prerequisites
- Docker & Docker Compose installed.

2. Setup & Run
```bash
git clone https://github.com/matanhaimov2/Home-Assignment---Bond-Sports.git
cd Home-Assignment---Bond-Sports
docker-compose up --build
```
**Note**: Ensure that ports 3000 (for the app) and 5432 (for Postgres) are available on your machine

3. Access
- **API**: http://localhost:3000
- **Swagger API Documentation**: http://localhost:3000/api

## 🧪 Running Tests
To execute the unit tests (no DB connection required):
```bash
npm run test
```

**Testing Approach**:

- **Unit Testing**: Used to isolate and verify business rules (balance checks, daily limits, account status).

- **Mocks**: Utilized Jest mocks for PrismaService to ensure fast and isolated test execution.

📊 **Test Coverage**:
To generate and view the full code coverage report:
```bash
npm run test:cov
```

This command creates a coverage/ directory with an HTML report, allowing you to visualize exactly which lines of business logic are covered by our tests.

## 📖 API Documentation
Once the server is running, navigate to /api in your browser. The documentation provides a live, interactive interface to test the following endpoints:

- **POST** `/accounts` - Create a new account.
- **GET** `/accounts/{id}/balance` - Retrieve the current real-time balance of a specific account
- **POST** `/transactions/deposit` - Securely add funds.
- **POST** `/transactions/withdraw` - Withdraw funds with daily limit enforcement.
- **GET** `/transactions/:accountId/statement` - Retrieve history with date-range filtering.