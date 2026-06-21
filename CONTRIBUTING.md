# Contributing to CarbonCoach AI

Thank you for your interest in contributing to CarbonCoach AI! This document outlines guidelines and procedures for developers joining the project.

---

## 1. Setup Instructions

To get started with local development:

```bash
# 1. Clone the repository
git clone https://github.com/harsh-04-git/CarbonCoach-AI.git
cd CarbonCoach-AI

# 2. Install dependencies
npm install

# 3. Add environmental credentials
cp .env.example .env
# Edit .env to add your GEMINI_API_KEY
```

---

## 2. Running the Application

* **Development mode (client + backend proxy)**:
  ```bash
  npm run dev
  ```
* **Production Build**:
  ```bash
  npm run build
  ```

---

## 3. Testing Requirements

All business logic must be fully tested before changes are merged.
```bash
# Run unit & integration tests
npm run test
```

---

## 4. Quality Rules (ESLint & Prettier)

We enforce strict linting to maintain code quality:
```bash
# Run ESLint validation
npm run lint:eslint

# Format files using Prettier
npx prettier --write .
```
Ensure that no variables of type `any` are added and that all unused variables are removed before submitting code.
