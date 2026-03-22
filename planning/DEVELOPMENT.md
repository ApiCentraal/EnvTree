# EnvTree Development Guide

## 🚀 Quick Start

### Vereisten
- Node.js 18+
- TypeScript 5+
- VSCode voor extensie ontwikkeling

### Installatie
```bash
# Installeer dependencies
npm install

# Bouw packages
npm run build

# Start daemon in development
npm run dev:daemon
```

## 📁 Project Structuur

```
EnvTree/
├── packages/           # Gedeelde libraries
│   ├── crypto/        # Encryptie functionaliteit
│   ├── storage/       # Database laag
│   └── core/          # Business logic
├── apps/              # Applicaties
│   ├── daemon/        # HTTP server
│   ├── extension/     # VSCode extensie
│   └── cli/          # Command line tool
└── infra/             # Infrastructuur
```

## 🔧 Development Workflow

### 1. Start Daemon
```bash
# In apps/daemon directory
npm run start:dev
```
De daemon start op `http://localhost:4848`

### 2. Test API
```bash
# Health check
curl http://localhost:4848/health

# Voeg secret toe
curl -X POST http://localhost:4848/secrets \
  -H "Content-Type: application/json" \
  -d '{"projectPath":"/pad/naar/project","key":"TEST_KEY","value":"test_value"}'
```

### 3. Ontwikkel Extensie
```bash
# In apps/extension directory
npm run watch
```

Open VSCode met de extensie:
1. Open de `apps/extension` folder in VSCode
2. Press F5 om een nieuwe Extension Development Host te starten

## 🧪 Testing

### Unit Tests
```bash
# Test packages
npm test --workspace=@envtree/crypto
npm test --workspace=@envtree/storage
npm test --workspace=@envtree/core
```

### Integration Tests
```bash
# Test daemon
npm test --workspace=envtree-daemon

# Test extensie
npm test --workspace=envtree-extension
```

## 🔐 Security Notes

### Master Key Management
- Master key wordt opgeslagen in `~/.envtree/master.key`
- File permissions: `600` (alleen leesbaar voor eigenaar)
- Key wordt automatisch gegenereerd bij eerste run

### Encryption
- AES-256-GCM authenticated encryption
- PBKDF2 key derivation (100,000 iterations)
- Random IV per encryptie operatie

## 📝 API Documentatie

### Daemon Endpoints

#### Health Check
```
GET /health
Response: { status: "ok", version: "1.0.0" }
```

#### Project Management
```
GET /projects
Response: Project[]

POST /projects
Body: { name: string, projectPath: string }
Response: Project
```

#### Secret Management
```
GET /secrets?projectPath=<path>
Response: Secret[]

POST /secrets
Body: { projectPath: string, key: string, value: string }
Response: Secret

PUT /secrets/<key>
Body: { projectPath: string, newValue?: string }
Response: Secret

DELETE /secrets/<key>
Body: { projectPath: string }
Response: { deleted: boolean }
```

#### Inject Functionality
```
POST /inject
Body: { projectPath: string }
Response: { content: string }  # .env formaat
```

## 🚨 Bekende Issues

### TypeScript Errors
De meeste TypeScript errors zijn gerelateerd aan ontbrekende type definitions:
- Installeer dependencies: `npm install`
- Build packages: `npm run build:packages`

### Daemon Connection
Als de extensie geen verbinding kan maken met de daemon:
1. Controleer of de daemon draait op poort 4848
2. Controleer firewall instellingen
3. Test met `curl http://localhost:4848/health`

## 🔄 Build Process

### Packages Build
```bash
# Bouw alle packages
npm run build:packages

# Of individueel
npm run build --workspace=@envtree/crypto
npm run build --workspace=@envtree/storage
npm run build --workspace=@envtree/core
```

### Apps Build
```bash
# Bouw alle apps
npm run build:apps

# Of individueel
npm run build --workspace=envtree-daemon
npm run build --workspace=envtree-extension
```

## 📦 Packaging

### VSCode Extension
```bash
# In apps/extension directory
npm run vsce package
```

### Daemon Distribution
```bash
# In apps/daemon directory
npm run build
npm run package  # Creëert distributie package
```

## 🎯 Volgende Features

1. **OS Keychain Integration** - Veilige master key storage
2. **Git Hooks** - Automatische secret leak detectie
3. **CLI Tool** - Terminal interface voor power users
4. **Team Sync** - Multi-user secret sharing
5. **Audit Logs** - Compliance en security logging
