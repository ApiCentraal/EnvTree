# EnvTree VSCode Extension

🌳 **Developer-first secret management voor je VSCode workspace**

## 🚀 Installatie

### Vereisten
- VSCode 1.85+
- Node.js 18+
- EnvTree daemon (zie [daemon setup](../README.md))

### Installatie in Development Mode
1. Clone de repository
2. Open `apps/extension` in VSCode
3. Druk **F5** om Extension Development Host te starten
4. Installeer dependencies: `npm install`

## 🎯 Features

### 🔐 Secret Management
- **Add Secrets** - Voeg nieuwe secrets toe met encryptie
- **Rotate Secrets** - Veilige secret rotatie
- **Delete Secrets** - Verwijder oude secrets
- **List Secrets** - Overzicht van alle project secrets

### 📁 .env Injectie
- **1-click Inject** - Genereer .env bestand automatisch
- **Auto-open** - Open .env direct in VSCode
- **Format** - Correcte KEY=value formatting

### 🔧 Configuratie
- **Daemon Settings** - Configureer host en poort
- **Display Options** - Secret masking en tree refresh
- **Security Settings** - Timeout en display opties
- **Status Info** - Daemon verbinding en workspace status

## 🎮 Gebruik

### Command Palette (Ctrl+Shift+P)
- `EnvTree: Initialize Project` - Nieuw project aanmaken
- `EnvTree: Add Secret` - Secret toevoegen
- `EnvTree: Inject to .env` - .env genereren
- `EnvTree: Rotate Secret` - Secret roteren
- `EnvTree: Delete Secret` - Secret verwijderen
- `EnvTree: Settings` - Instellingen openen

### Sidebar Integration
- **Explorer Tab** - EnvTree tree view in sidebar
- **Project Hiërarchie** - Projecten met secrets
- **Context Menu** - Right-click actions
- **Real-time Updates** - Automatische refresh

### Keyboard Shortcuts
- `Ctrl+Shift+A` - Secret toevoegen
- `Ctrl+Shift+I` - .env injecteren
- `Ctrl+Shift+R` - Tree verversen

## ⚙️ Instellingen

Open VSCode Settings en zoek naar "EnvTree":

### Daemon Configuratie
- **envtree.daemonPort** - Poort voor daemon (default: 4848)
- **envtree.daemonHost** - Host voor daemon (default: localhost)

### Tree Display
- **envtree.autoRefresh** - Automatisch verversen (default: true)
- **envtree.showSecretValues** - Toon secret waarden (default: false)

### Security
- **envtree.notificationTimeout** - API timeout in ms (default: 5000)

## 🔄 Workflow

### 1. Project Initialisatie
1. Open een Git repository in VSCode
2. `EnvTree: Initialize Project` uitvoeren
3. Project naam invoeren
4. Project wordt geregistreerd bij daemon

### 2. Secret Management
1. Selecteer project in EnvTree sidebar
2. `EnvTree: Add Secret` gebruiken
3. Key en waarde invoeren
4. Secret wordt encrypted opgeslagen

### 3. .env Generatie
1. `EnvTree: Inject to .env` uitvoeren
2. .env bestand wordt automatisch aangemaakt
3. Open .env in VSCode om te verifiëren

## 🔍 Troubleshooting

### Daemon Verbinding
- **Error**: "Daemon niet gevonden"
- **Oplossing**: Start daemon met `npm run start` in daemon folder
- **Check**: `curl http://localhost:4848/health`

### Workspace Issues
- **Error**: "Geen workspace folder gevonden"
- **Oplossing**: Open een Git repository in VSCode
- **Check**: File > Open Folder

### Secret Display
- **Issue**: Secrets worden gemaskeerd (●●●●●)
- **Oplossing**: Settings > EnvTree > "Toon secret waarden" inschakelen

## 📚 Documentatie

- [Hoofd README](../../README.md) - Project overzicht
- [Daemon Setup](../daemon/README.md) - Daemon installatie
- [API Documentatie](../docs/API.md) - Complete API reference

## 🐛 Feedback

Problemen of suggesties? Open een issue op:
- GitHub: [EnvTree Issues](https://github.com/apicentraal/envtree/issues)
- Email: help@apicentraal.nl

---

**Versie**: 1.0.1  
**Last updated**: 22 Maart 2026
