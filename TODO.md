# EnvTree TODO - Openstaande Punten

## 🎯 Huidige Status
- ✅ MVP Foundation compleet
- ✅ Daemon API werkend
- ✅ VSCode extensie basis geïmplementeerd
- 🔄 Versie 1.0.1 development release

## 🚀 Directe Openstaande Punten

### 1. VSCode Extensie Testing (High Priority)
- [ ] **Extension Development Host testen**
  - Open `apps/extension` in VSCode
  - Druk F5 om Extension Development Host te starten
  - Test alle commands via Command Palette
  - Verifieer sidebar TreeView functionaliteit

- [ ] **Real-world workflow testen**
  - Project initialiseren in echte workspace
  - Secrets toevoegen en injecteren
  - .env bestand generatie verifiëren
  - Secret rotatie testen

### 2. Client Integration Issues (Medium Priority)
- [ ] **VSCode API integratie verbeteren**
  - `getCurrentProjectPath()` implementatie met echte VSCode API
  - Workspace folders detectie verbeteren
  - Error handling voor daemon connection

- [ ] **User Experience verbeteringen**
  - Loading states in sidebar
  - Progress indicators voor lange operaties
  - Better error messages met actionable steps

### 3. Production Readiness (Medium Priority)
- [ ] **Extension packaging testen**
  - `vsce package` command uitvoeren
  - .vsix bestand valideren
  - Installation in clean VSCode omgeving testen

- [ ] **Security audit**
  - Master key permissions controleren (600)
  - Database file permissions verifiëren
  - Input validatie in alle API endpoints

## 🔧 Technische Schuld

### Bekende Issues
- **fetch API niet beschikbaar in VSCode extensie context**
  - Oplossing: Node.js fetch polyfill of axios gebruiken
  - Impact: API calls werken niet in VSCode omgeving

- **TypeScript strict mode errors**
  - Oplossing: Proper type definities voor alle responses
  - Status: Grotendeels opgelost, resterende issues documenteren

## 📋 Volgende Iteratie Planning

### Iteratie 1.1: Extension Polish (1-2 dagen)
- [ ] VSCode API integratie compleet maken
- [ ] User interface verbeteringen
- [ ] Error handling en user feedback
- [ ] Production packaging en distributie

### Iteratie 1.2: CLI Tool (2-3 dagen)
- [ ] `envtree` command line tool
- [ ] Terminal integration voor power users
- [ ] Scripting support voor CI/CD
- [ ] Auto-completie voor commands

### Iteratie 2.0: Elite Dev Features (1 week)
- [ ] OS Keychain integration
- [ ] Git hooks voor leak prevention
- [ ] Smart secret detectie in code
- [ ] Inline suggesties in editor

## 🚨 Risico's en Mitigaties

### Risico: Extension niet laadt in productie
- **Mitigatie**: Grondige testing in development mode
- **Mitigatie**: Extension manifest validatie
- **Mitigatie**: User feedback verzamelen

### Risico: Daemon connection issues
- **Mitigatie**: Robuste error handling
- **Mitigatie**: Clear instructies voor gebruikers
- **Mitigatie**: Health check functionaliteit

### Risico: Security vulnerabilities
- **Mitigatie**: Code review voor alle changes
- **Mitigatie**: Security audit voor encryptie
- **Mitigatie**: Input sanitization in API

## 📊 Success Metrics

### KPI's voor Versie 1.0.1
- **Extension load success rate**: >95%
- **API response time**: <200ms
- **User error rate**: <5%
- **Setup completion time**: <2 minuten

### Acceptance Criteria
- ✅ Gebruiker kan extensie installeren en starten
- ✅ Alle commands werken via Command Palette
- ✅ Secrets kunnen worden toegevoegd en beheerd
- ✅ .env injectie werkt correct
- ⏳ Real-world workflow getest door gebruiker

---

*Laatst bijgewerkt: 22 Maart 2026*
*Prioriteit: Extension testing en polish*
