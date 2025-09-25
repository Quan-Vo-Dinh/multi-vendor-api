# Development Setup Guide

Hướng dẫn cấu hình development environment cho Node.js project với code quality tools.

## Tổng quan

Dự án sử dụng các công cụ sau để đảm bảo code quality:

- **ESLint**: Phân tích lỗi code, import ordering, unused variables
- **Prettier**: Format code tự động
- **Husky**: Git hooks tự động
- **Lint-staged**: Chạy linting trên staged files
- **CommitLint**: Kiểm tra format commit messages

## 1. Database Setup với Prisma

### Cài đặt và cấu hình:

```bash
# Khởi tạo Prisma
npx prisma init

# Cài package bổ sung cho JSON types
npm install --save-dev prisma-json-types-generator
```

### File `.env`:

```env
DATABASE_URL="postgresql://vodinhquan:password@localhost:5432/ecom_dev?schema=public"
```

### Cấu hình PostgreSQL user:

```bash
# Cấp quyền login cho user
sudo -u postgres psql -c "ALTER ROLE vodinhquan WITH LOGIN PASSWORD 'your_password';"

# Cấp toàn quyền database
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ecom_dev TO vodinhquan;"
```

### Migration:

```bash
npx prisma db push
npx prisma generate
```

## 2. ESLint Configuration

### Cài đặt packages:

```bash
npm install --save-dev @typescript-eslint/eslint-plugin eslint-plugin-import eslint-plugin-unused-imports eslint-import-resolver-typescript @commitlint/cli @commitlint/config-conventional lint-staged
```

### File `eslint.config.mjs`:

```javascript
// @ts-check
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: ['eslint.config.mjs', 'commitlint.config.js', 'dist/**', 'node_modules/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parser: tseslint.parser,
      parserOptions: { project: './tsconfig.json' },
    },
    settings: {
      'import/resolver': { typescript: true, node: true },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',

      // Import ordering
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Unused imports/variables
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },
]
```

### Import Order Rules:

Imports được sắp xếp theo thứ tự:

1. **builtin**: Node.js modules (`fs`, `path`)
2. **external**: npm packages (`@nestjs/common`, `prisma`)
3. **internal**: project modules
4. **parent/sibling**: relative imports (`../user`, `./dto`)

**Ví dụ đúng:**

```typescript
import { readFile } from 'fs'

import { Injectable } from '@nestjs/common'

import { AppService } from './app.service'
```

### Unused Variables Rules:

- **Unused imports**: Tự động xóa (error)
- **Unused variables**: Warning, trừ variables bắt đầu với `_`

**Ví dụ:**

```typescript
// ❌ Warning - unused variable
const unusedVar = 'test'

// ✅ OK - intentionally unused (bắt đầu với _)
const _unusedVar = 'test'
```

## 3. Prettier Configuration

### File `.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "printWidth": 120,
  "endOfLine": "lf",
  "bracketSpacing": true,
  "arrowParens": "always",
  "useTabs": false
}
```

### Format Rules:

- **No semicolons** (`semi: false`)
- **Single quotes**
- **Trailing commas**
- **120 characters** line width
- **2 spaces** indentation

## 4. VS Code Integration

### File `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Tính năng:

- **Format on save**: Tự động format khi Ctrl+S
- **Auto-fix ESLint**: Tự động sửa lỗi ESLint
- **Organize imports**: Tự động sắp xếp imports

## 5. Husky & Git Hooks

### Setup:

```bash
# Khởi tạo Husky
npx husky init

# Tạo pre-commit hook
echo "npx lint-staged" > .husky/pre-commit

# Tạo commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg

# Cấp quyền thực thi
chmod +x .husky/pre-commit .husky/commit-msg
```

### Lint-staged trong `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## 6. CommitLint Configuration

### File `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
  },
}
```

### Commit Message Format:

```
<type>[optional scope]: <description>
```

**Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**

```bash
# ✅ Valid
git commit -m "feat: add user authentication"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs: update API documentation"

# ❌ Invalid
git commit -m "update code"
git commit -m "Fix bug"
```

## 7. NPM Scripts

### Updated `package.json` scripts:

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "lint:check": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "prepare": "husky"
  }
}
```

## 8. Development Workflow

### Day-to-day workflow:

1. **Code**: ESLint highlights errors in real-time
2. **Save**: Ctrl+S auto-formats and organizes imports
3. **Commit**: Pre-commit hook runs lint-staged automatically
4. **Message**: CommitLint validates commit message format

### Useful commands:

```bash
# Check lint issues
npm run lint:check

# Auto-fix lint issues
npm run lint

# Format code
npm run format

# Test commit message
echo "feat: add user auth" | npx commitlint
```

## 9. Code Examples

### Import Organization:

```typescript
// ✅ Correct order
import { readFile } from 'fs'

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/client'

import { UserService } from '../user/user.service'

import { AuthDto } from './dto/auth.dto'

// ❌ Wrong order - will be auto-fixed
import { AuthDto } from './dto/auth.dto'
import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
```

### Unused Variables:

```typescript
// ❌ Warning - unused variable
const unusedVariable = 'test'

// ✅ OK - intentionally unused (starts with _)
const _intentionallyUnused = 'this is fine'

// ✅ Used variable
const usedVariable = 'test'
console.log(usedVariable)
```

## 10. Troubleshooting

### Common issues:

**ESLint not working:**

- Check `tsconfig.json` path
- Ensure `eslint-import-resolver-typescript` installed

**Format conflicts:**

- ESLint and Prettier configs must match
- Use `.prettierrc` as single source of truth

**Husky hooks not running:**

- Run `chmod +x .husky/*`
- Check hooks exist in `.husky/` directory

**CommitLint failing:**

- Check `commitlint.config.js` syntax
- Ensure file not ignored by ESLint

## 11. Summary

This setup provides:

- ✅ **Code quality**: ESLint catches errors and enforces best practices
- ✅ **Consistent formatting**: Prettier ensures uniform code style
- ✅ **Import organization**: Auto-sorts imports by type
- ✅ **Unused code detection**: Warns about unused variables/imports
- ✅ **Git workflow**: Pre-commit hooks prevent bad code
- ✅ **Commit standards**: Enforces conventional commit format
- ✅ **VS Code integration**: Format and fix on save

All tools work together seamlessly without interrupting development flow.
