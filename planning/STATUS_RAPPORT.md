# EnvTree - Project Status Rapport

## 🎯 Project Identificatie

**Projectnaam:** EnvTree  
**Originele Concept:** ZeroVault  
**Type:** Developer-first Secret Management Tool  
**Status:** In Ontwikkeling  

---

## 🎯 Project Kernprincipes

**Simplicity + Convenience + Local**

EnvTree volgt drie fundamentele principes die elke architectuur beslissing bepalen:

### 🎯 Simplicity  
- **Zero dependencies** - Geen externe packages voor core functionaliteit
- **Minimal API** - 4 basis endpoints voor alle operaties  
- **Clean interface** - Directe VSCode integratie zonder dashboard overhead
- **One-click actions** - Add/Inject/Rotate zonder complexe wizards

### ⚡ Convenience  
- **Auto-detectie** - Project herkenning via .git root
- **Inline workflow** - Blijf in je editor, geen context switching
- **Smart suggestions** - Automatische secret detectie in code
- **Instant deploy** - CLI tool voor CI/CD integratie

### 🏠 Local-First  
- **Offline capable** - Werkt zonder internet connectie
- **No vendor lock** - Jouw data blijft op jouw machine
- **Instant setup** - Geen cloud accounts of configuratie nodig
- **Optional sync** - Cloud alleen als je het wilt

---

## 📋 Core Doelstelling

EnvTree is een simpele, krachtige vault voor environment credentials die naadloos integreert in de developer workflow:

- **🔐 Secrets veilig opslaan** (env vars, API keys, tokens)
- **📁 Per project koppelen** met automatische detectie  
- **⚡ 1-click injectie** in .env bestanden
- **🔄 Rotatie + audit logs** voor compliance
- **💻 VSCode integratie** als primary interface

---

## 🧩 Functionaliteiten Matrix

### ✅ MVP Core Features
| Feature | Status | Priority | Implementatie |
|---------|--------|----------|---------------|
| Project registratie (.git detectie) | 🔄 Planning | High | Daemon + Extension |
| Secret toevoegen (encryptie) | 🔄 Planning | High | Crypto + Storage |
| Injectie (.env generatie) | 🔄 Planning | High | Extension UI |
| Rotatie (auto-generatie) | 🔄 Planning | Medium | Core Service |
| Audit logging | 🔄 Planning | Medium | Storage Layer |

### 🚀 VSCode Extension Features  
| Feature | Status | Priority | Component |
|---------|--------|----------|-----------|
| Sidebar TreeView | 🔄 Planning | High | extension/provider.ts |
| Command Palette integratie | 🔄 Planning | High | extension/commands.ts |
| Right-click context menu | 🔄 Planning | Medium | extension/context.ts |
| Inline UI (hover reveal) | 🔄 Planning | Medium | extension/ui.ts |
| Status bar indicator | 🔄 Planning | Low | extension/status.ts |

### 🔥 Advanced Features (Elite Dev Tool)
| Feature | Status | Priority | Fase |
|---------|--------|----------|------|
| Smart Secret Detection (AST) | 📋 Concept | High | Fase 2 |
| Auto Mapping (suggesties) | 📋 Concept | Medium | Fase 2 |
| Inline Injection (hover) | 📋 Concept | High | Fase 2 |
| Smart Profiles (branch-based) | 📋 Concept | Medium | Fase 2 |
| Git Hooks (leak protection) | 📋 Concept | High | Fase 2 |

---

## 🔐 Beveiligingsarchitectuur

### Encryption Model
- **🔑 Algoritme:** AES-256-GCM (authenticated encryption)
- **🔧 Key Derivation:** PBKDF2/scrypt voor master key
- **💾 Storage:** SQLite met encrypted fields  
- **🔐 Authentication:** Local passphrase + OS keychain

### Security Layers
```
User Password → PBKDF2 + Salt → Derived Key → Encrypt/Decrypt Secrets
```

### Storage Schema
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, 
  path TEXT NOT NULL
);

CREATE TABLE secrets (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  key TEXT,
  encrypted_value TEXT,
  iv TEXT,
  auth_tag TEXT, 
  created_at TEXT,
  rotated_at TEXT
);
```

### OS Keychain Integration
- **🍎 macOS:** Keychain via `security` command
- **🐧 Linux:** libsecret of ~/.vault_key fallback
- **🪟 Windows:** Credential Vault

---

## 🔗 API & Configuratie

### Daemon API Endpoints
```
GET  /secrets?project={name}    - Lijst van project secrets
POST /secret                    - Voeg secret toe  
PUT  /secret/{id}/rotate        - Roteer secret
GET  /health                    - Status check
```

### Cloud Sync (Supabase)
```javascript
// Zero-knowledge sync architectuur
local encrypt → push encrypted blob → store remote → pull → decrypt local
```

### Project Structuur
```
EnvTree/
├── apps/
│   ├── extension/        # VSCode extension
│   ├── daemon/           # Local vault server  
│   └── cli/              # Terminal tool
├── packages/
│   ├── crypto/           # Encryption logic
│   ├── storage/          # SQLite layer
│   └── core/             # Business logic
├── infra/
│   └── supabase/         # Cloud sync
└── scripts/
```

---

## 📊 Visuele Pijplijn

### System Architectuur
```
[ VSCode Extension ] ←→ [ CLI Tool ]
        ↓                    ↓
[ Local Vault Daemon (HTTP API) ]
        ↓  
[ Core Engine (Crypto + Logic) ]
        ↓
[ Storage Layer (Local SQLite) ]
        ↓
[ Sync Layer (Supabase - Optional) ]
```

### User Workflow
```
Developer schrijft code
        ↓
Extension detecteert missing secret (realtime)
        ↓  
Click "Add to EnvTree" → Encrypt → Store
        ↓
Inject naar .env (1-click)
        ↓
Git Hook checkt op leaks  
        ↓
Team sync (zero-knowledge)
        ↓
Deploy via CLI
```

### Product Evolutie
```
Fase 1: MVP (1-2 dagen)
├── Basic crypto + storage
├── VSCode sidebar
├── Inject/rotate features
└── Local-only

Fase 2: Elite Dev Tool (1 week)
├── Smart detection
├── Inline UI  
├── Git protection
└── CLI tooling

Fase 3: Team Product (2-3 weken)
├── Shared vaults
├── RBAC
├── Audit logs
└── Cloud sync
```

---

## 🚀 Productie Roadmap

### Iteratie 1: MVP Foundation (Day 1-2)
**Doel:** Werkend lokaal systeem
- [ ] Crypto engine (AES-256-GCM)
- [ ] SQLite storage layer
- [ ] HTTP daemon (port 4848)
- [ ] Basis VSCode extension
- [ ] Add/Inject/Rotate commands

### Iteratie 2: Developer Experience (Day 3-5)  
**Doel:** Verslavende UX
- [ ] OS keychain integratie
- [ ] Git hooks (leak protection)
- [ ] CLI tool (`envtree inject`)
- [ ] Smart profiles (.env.dev/.prod)
- [ ] Inline UI improvements

### Iteratie 3: Team Features (Week 2-3)
**Doel:** Multi-user veiligheid  
- [ ] Supabase backend setup
- [ ] Zero-knowledge sync
- [ ] Shared vaults
- [ ] User authentication
- [ ] Basic RBAC

### Iteratie 4: Platform (Week 4+)
**Doel:** SaaS ready
- [ ] Advanced RBAC
- [ ] Audit logging
- [ ] API marketplace
- [ ] Billing integration
- [ ] Enterprise features

---

## 📈 KPI's & Success Metrics

### Technical Metrics
- **⚡ Performance:** <100ms secret injectie
- **🔐 Security:** Zero plaintext exposure
- **🔄 Reliability:** 99.9% uptime daemon
- **💾 Storage:** <10MB local footprint

### User Metrics  
- **🎯 Adoption:** Daily active users
- **⏱️ Engagement:** Secrets per project
- **🔄 Retention:** 7-day retention rate
- **👥 Team Usage:** Shared vault adoption

---

## 🛠️ Tech Stack

| Component | Technologie | Versie | Status |
|-----------|-------------|--------|---------|
| Frontend | VSCode Extension API | Latest | 🔄 Planning |
| Backend | Node.js | 18+ | 🔄 Planning |
| Storage | SQLite | 3.x | 🔄 Planning |
| Crypto | Native Node Crypto | - | 🔄 Planning |
| Sync | Supabase | Latest | 📋 Concept |
| CLI | Node.js Executable | - | 📋 Concept |

---

## 🎯 Volgende Stappen

### Immediate (Vandaag)
1. **Setup project structuur** volgens bovenstaande layout
2. **Implementeer crypto engine** met AES-256-GCM
3. **Bouw daemon HTTP server** met basis endpoints
4. **Maak VSCode extension** met sidebar TreeView

### This Week
1. **OS keychain integratie** voor secure master key storage
2. **Git hooks implementatie** voor leak protection  
3. **CLI tool bouwen** voor power users
4. **Smart profiles** voor environment switching

### This Month
1. **Supabase backend** voor team sync
2. **Zero-knowledge architectuur** implementeren
3. **Shared vaults** met RBAC
4. **Audit logging** voor compliance

---

## 📝 Notities & Beslissingen

### Architectural Decisions
- ✅ **Zero dependencies** - Geen external packages voor crypto
- ✅ **Local-first** - Werkt zonder internet connectie  
- ✅ **Zero-knowledge** - Server ziet nooit plaintext secrets
- ✅ **Developer experience** - VSCode als primary interface
- ✅ **Simplicity over features** - MVP focus, geen overengineering
- ✅ **Convenience over complexity** - One-click actions
- ✅ **Local over cloud** - Offline first, optional sync

### Trade-offs
- **Simplicity vs Features** - MVP focus, geen overengineering
- **Security vs Convenience** - OS keychain voor balans
- **Local vs Cloud** - Local-first met optionele sync

---

*Laatste update: 22 Maart 2026*  
*Status: Ready for Development*
