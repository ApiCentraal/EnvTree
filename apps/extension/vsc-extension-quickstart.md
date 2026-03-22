# EnvTree Extension Quick Start

## 🚀 Installatie in Development Mode

### Vereisten
- VSCode 1.85+
- Node.js 18+
- EnvTree daemon draaiend op poort 4848

### Stappen

1. **Open VSCode**
   ```bash
   code apps/extension
   ```

2. **Installeer Dependencies**
   ```bash
   cd apps/extension
   npm install
   ```

3. **Compile de Extensie**
   ```bash
   npm run compile
   ```

4. **Start Extension Development Host**
   - Druk op **F5** in VSCode
   - Of: `Run > Start Debugging`

5. **Test de Functionaliteiten**
   - Open **Command Palette** (Ctrl+Shift+P)
   - Zoek naar "EnvTree" commands
   - Check de **Explorer** sidebar voor EnvTree

## 🧪 Test Scenario

### 1. Start de Daemon
```bash
cd apps/daemon
npm run start
```

### 2. Test Commands in VSCode
- **EnvTree: Initialize Project** - Maak nieuw project aan
- **EnvTree: Add Secret** - Voeg secret toe
- **EnvTree: Inject to .env** - Genereer .env bestand
- **EnvTree: Rotate Secret** - Roteer secret waarde

### 3. Verifieer Resultaten
- Check sidebar voor project/secrets lijst
- Open .env bestand om injectie te verifiëren
- Test API endpoints met curl

## 🔧 Development Features

### Sidebar Integration
- Projecten worden automatisch gedetecteerd
- Secrets worden gemaskeerd (●●●●●●●●)
- Right-click context menu beschikbaar
- Real-time refresh bij changes

### Command Palette
Alle EnvTree commands beschikbaar via:
- **Windows/Linux**: `Ctrl+Shift+P`
- **macOS**: `Cmd+Shift+P`

### Debug Tips
- **Console Logs**: `Help > Toggle Developer Tools`
- **Extension Host**: Nieuw VSCode venster opent met extensie
- **Reload**: `Ctrl+R` of `Cmd+R` in Extension Development Host

## 🐛 Bekende Issues

### Daemon Connection
Als extensie geen verbinding kan maken:
1. Controleer of daemon draait: `curl http://localhost:4848/health`
2. Start daemon: `cd apps/daemon && npm run start`
3. Controleer firewall instellingen

### Extension Loading
Als extensie niet laadt:
1. Controleer `package.json` syntax
2. Compile extensie: `npm run compile`
3. Herstart VSCode

## 📦 Packaging voor Productie

```bash
# Installeer vsce tool
npm install -g vsce

# Package extensie
vsce package

# Result: envtree-extension-1.0.1.vsix
```

## 🚀 Publicatie naar Marketplace

1. **Login bij Visual Studio Marketplace**
2. **Upload .vsix bestand**
3. **Vul metadata in**
   - Beschrijving
   - Categorieën
   - Tags

---

*Versie 1.0.1 - Development Release*
