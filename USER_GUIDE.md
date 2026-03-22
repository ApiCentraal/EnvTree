# EnvTree Gebruikersgids

🌳 **Je complete gids voor secret management in VSCode**

## 🚀 Snelle Start

### 1. Installatie
```bash
# 1. Clone repository
git clone https://github.com/apicentraal/envtree.git

# 2. Open in VSCode
code envtree/apps/extension

# 3. Installeer dependencies
npm install

# 4. Start daemon
cd envtree/apps/daemon
npm run start
```

### 2. Extension Development
```bash
# In VSCode: Druk F5
# Of: Run > Start Debugging
```

## 📋 Eerste Gebruik

### Stap 1: Project Initialiseren
1. Open een **Git repository** in VSCode
2. Open **Command Palette** (Ctrl+Shift+P)
3. Typ: `EnvTree: Initialize Project`
4. Voer project naam in (bv: "Mijn Web App")
5. ✅ Project wordt aangemaakt

### Stap 2: Secret Toevoegen
1. In **EnvTree sidebar** klik op project
2. Klik op **+** (Add Secret) of gebruik `Ctrl+Shift+A`
3. Voer secret key in (bv: `DATABASE_URL`)
4. Voer waarde in (bv: `postgresql://localhost:5432/myapp`)
5. ✅ Secret wordt encrypted opgeslagen

### Stap 3: .env Genereren
1. Gebruik `Ctrl+Shift+I` of Command Palette
2. Kies: `EnvTree: Inject to .env`
3. ✅ `.env` bestand wordt aangemaakt in workspace

## 🎯 Dagelijkse Workflow

### Ontwikkeling
```bash
# 1. Start daemon
cd apps/daemon && npm run start

# 2. Open workspace in VSCode
code /pad/naar/project

# 3. Secrets beheren via VSCode interface
# Gebruik Command Palette of sidebar
```

### Productie
```bash
# 1. Inject secrets in .env
Ctrl+Shift+I

# 2. Start applicatie
npm start
```

## ⚙️ Instellingen

### Daemon Configuratie
Open **VSCode Settings** > zoek naar "EnvTree":

| Instelling | Default | Beschrijving |
|-----------|---------|-------------|
| Daemon Poort | 4848 | Poort voor EnvTree daemon |
| Daemon Host | localhost | Host adres voor daemon |
| Auto-refresh | Aan | Automatisch tree verversen |
| Secret Waarden Tonen | Uit | Secret masking in sidebar |
| API Timeout | 5000ms | Timeout voor API calls |

### Aanbevelingen
- **Poort**: Gebruik 4848 voor eerste gebruik
- **Security**: Houd secret masking ingeschakeld
- **Performance**: Auto-refresh aan voor betere UX

## 🔧 Geavanceerde Features

### 1. Bulk Secret Management
```bash
# Meerdere secrets toevoegen
# Gebruik Add Secret command voor elke secret
# Of exporteer vanuit bestaande .env bestand
```

### 2. Secret Rotatie
```bash
# Periodieke secret rotatie
1. EnvTree: Rotate Secret
2. Kies secret om te roteren
3. Voer nieuwe waarde in
4. ✅ Oude waarde wordt gearchiveerd
```

### 3. Team Workflow
```bash
# Voor team omgevingen
1. Iedereen installeert eigen daemon
2. Gedeelde master key via secure kanaal
3. Secrets worden lokaal encrypted
4. Sync via optionele cloud service
```

## 🔍 Troubleshooting

### Probleem: Daemon niet gevonden
**Symptoom**: "⚠️ EnvTree: Daemon niet gevonden"

**Oplossingen**:
```bash
# 1. Controleer of daemon draait
curl http://localhost:4848/health

# 2. Start daemon
cd apps/daemon
npm run start

# 3. Controleer poort instelling
# VSCode Settings > EnvTree > Daemon Poort
```

### Probleem: Geen workspace gevonden
**Symptoom**: "❌ Geen workspace folder gevonden"

**Oplossingen**:
```bash
# 1. Open Git repository
code /pad/naar/git/repo

# 2. Controleer .git aanwezigheid
ls -la .git

# 3. Herstart VSCode
```

### Probleem: Secrets niet zichtbaar
**Symptoom**: Lege EnvTree sidebar

**Oplossingen**:
```bash
# 1. Refresh tree
Ctrl+Shift+R

# 2. Controleer project initialisatie
EnvTree: Initialize Project

# 3. Check daemon verbinding
EnvTree: Settings > Status Info
```

## 🚨 Beveiliging

### Best Practices
- ✅ **Gebruik sterke passwords** - Minimaal 16 karakters
- ✅ **Regelmatige rotatie** - Vervang secrets periodiek
- ✅ **Local storage** - Secrets worden lokaal encrypted
- ✅ **Git ignore** - `.env` in `.gitignore`
- ✅ **Access control** - Beperk toegang tot master key

### Security Features
- 🔐 **AES-256-GCM encryptie** - Militaire grade encryptie
- 🔑 **PBKDF2 key derivation** - 100,000 iteraties
- 🛡️ **Zero-knowledge** - Server ziet nooit plaintext
- 🔒 **Master key bescherming** - 600 file permissions

## 📊 Performance Tips

### Optimisatie
- **Auto-refresh uitschakelen** voor grote projecten
- **API timeout verhogen** bij trage verbindingen
- **Local daemon** voor betere performance
- **Cache gebruiken** voor frequente operaties

### Monitoring
```bash
# Daemon performance
curl http://localhost:4848/health

# Extension logging
# Help > Toggle Developer Tools
# Console tab voor EnvTree logs
```

## 🔗 Nuttige Links

### Documentatie
- [Hoofddocumentatie](../../README.md)
- [API Referentie](../docs/API.md)
- [Security Guide](../docs/SECURITY.md)

### Community
- [GitHub Issues](https://github.com/apicentraal/envtree/issues)
- [Discord Community](https://discord.gg/envtree)
- [Updates](https://github.com/apicentraal/envtree/releases)

### Support
- 📧 **Email**: help@apicentraal.nl
- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions

---

**Versie**: 1.0.1  
**Laatst bijgewerkt**: 22 Maart 2026  
**Geschreven door**: ApiCentraal HQ
