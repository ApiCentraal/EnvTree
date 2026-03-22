# EnvTree Changelog

## [1.0.0] - 2026-03-22

### ✅ MVP Foundation (Iteratie 1)

#### 🌳 Core Architectuur
- **Monorepo structuur** met packages en apps
- **Zero dependencies** - alleen native Node.js crypto
- **TypeScript** - Volledig getype codebase

#### 🔐 Security Layer
- **AES-256-GCM** authenticated encryption
- **PBKDF2** key derivation (100,000 iterations)
- **Master key** storage in `~/.envtree/master.key`
- **Zero-knowledge** architectuur - server ziet nooit plaintext

#### 📦 Packages
- **@envtree/crypto** - Encryptie utilities met AES-256-GCM
- **@envtree/storage** - JSON-based storage layer
- **@envtree/core** - Business logic en vault service

#### 🚀 Apps
- **envtree-daemon** - HTTP API server (poort 4848)
- **envtree-extension** - VSCode extensie met UI

#### 📡 API Endpoints
```
GET  /health                    - Health check
GET  /projects                   - Lijst van projecten
POST /projects                   - Nieuw project aanmaken
GET  /secrets?projectPath=<path> - Secrets ophalen
POST /secrets                   - Secret toevoegen
PUT  /secrets/<key>             - Secret roteren
DELETE /secrets/<key>           - Secret verwijderen
POST /inject                      - .env bestand genereren
```

#### 💻 VSCode Integration
- **Sidebar TreeView** - Project en secrets overzicht
- **Command Palette** - Init/Add/Inject/Rotate commands
- **Context Menu** - Right-click actions
- **Real-time Updates** - Auto-refresh bij changes

#### 🛠️ Development Setup
- **npm workspaces** - Monorepo management
- **TypeScript configuratie** - Strict mode met types
- **Build scripts** - Automatische compilatie
- **Development guide** - Complete setup instructies

#### 🎯 Productie Features
- **Local-first** - Werkt zonder internet connectie
- **Project detectie** - Automatische .git herkenning
- **Secret masking** - Waarden worden verborgen in UI
- **Inject functionaliteit** - 1-klik .env generatie

#### 📋 Test Resultaten
- ✅ Health check werkend
- ✅ Project aanmaken werkend  
- ✅ Secret toevoegen werkend
- ✅ Encryptie/decryptie werkend
- ✅ .env injectie werkend
- ✅ API endpoints volledig functioneel

---

## Volgende Iteraties

### [1.1.0] - Elite Dev Tool (Gepland)
- OS Keychain integration
- Git hooks voor leak protection
- Smart secret detectie in code
- CLI tool voor terminal usage

### [1.2.0] - Team Features (Gepland)
- Supabase sync met zero-knowledge
- Shared vaults voor teams
- RBAC (Role-Based Access Control)
- Audit logging voor compliance

### [2.0.0] - Platform (Gepland)
- API marketplace
- Secrets-as-a-Service
- Billing integration
- Enterprise features

---

*Gebouwd met ❤️ door ApiCentraal HQ*
