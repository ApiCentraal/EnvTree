import * as vscode from "vscode";
import { EnvTreeProvider } from "./provider";
import { EnvTreeClient } from "./client";

/**
 * Extension activation functie
 * Wordt aangeroepen wanneer de extensie wordt geactiveerd
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("🌳 EnvTree extensie is geactiveerd");

  // Maak EnvTree client voor API communicatie
  const client = new EnvTreeClient("http://localhost:4848");

  // Test daemon connection
  client.healthCheck().then((isHealthy: boolean) => {
    if (isHealthy) {
      console.log("✅ EnvTree daemon verbinding succesvol");
      vscode.window.showInformationMessage("🌳 EnvTree: Daemon verbinding actief");
    } else {
      console.log("❌ EnvTree daemon niet bereikbaar");
      vscode.window.showWarningMessage("⚠️ EnvTree: Daemon niet gevonden. Start de daemon met 'npm run start' in de daemon folder");
    }
  }).catch((error: any) => {
    console.log("❌ EnvTree daemon connectie fout:", error);
    vscode.window.showErrorMessage(`❌ EnvTree: Connectie fout - ${error.message}`);
  });

  // Maak tree provider voor sidebar
  const provider = new EnvTreeProvider(client);
  
  // Registreer tree view
  const treeView = vscode.window.createTreeView("envtreeExplorer", {
    treeDataProvider: provider,
    showCollapseAll: true
  });

  // Registreer commands
  const commands = [
    vscode.commands.registerCommand("envtree.init", async () => {
      try {
        // Haal workspace pad op
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
          vscode.window.showErrorMessage("❌ Geen workspace folder gevonden");
          return;
        }

        const projectPath = workspaceFolders[0].uri.fsPath;
        const projectName = await vscode.window.showInputBox({
          prompt: "Voer project naam in",
          placeHolder: "Mijn Project"
        });

        if (!projectName) return;

        // Initialiseer project
        const project = await client.initProject(projectName);
        vscode.window.showInformationMessage(`✅ Project "${projectName}" succesvol geïnitialiseerd`);
        provider.refresh();
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij initialiseren project: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.addSecret", async () => {
      try {
        const key = await vscode.window.showInputBox({
          prompt: "Voer secret key naam in",
          placeHolder: "DATABASE_URL"
        });
        
        if (!key) return;

        const value = await vscode.window.showInputBox({
          prompt: "Voer secret waarde in",
          password: true,
          placeHolder: "postgresql://..."
        });
        
        if (!value) return;

        const secret = await client.addSecret(key, value);
        vscode.window.showInformationMessage(`✅ Secret '${key}' toegevoegd`);
        provider.refresh();
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij toevoegen secret: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.inject", async () => {
      try {
        const content = await client.injectSecrets();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        
        if (!workspaceFolders || workspaceFolders.length === 0) {
          vscode.window.showErrorMessage("❌ Geen workspace folder gevonden");
          return;
        }

        const envPath = vscode.Uri.joinPath(workspaceFolders[0].uri, ".env");
        
        // Schrijf .env bestand
        await vscode.workspace.fs.writeFile(
          envPath, 
          Buffer.from(content, "utf8")
        );

        vscode.window.showInformationMessage("✅ Secrets geïnjecteerd in .env");
        
        // Vraag om .env bestand te openen
        const openAction = "Open .env";
        vscode.window.showInformationMessage("📄 .env bestand aangemaakt", openAction)
          .then(action => {
            if (action === openAction) {
              vscode.commands.executeCommand('vscode.open', envPath);
            }
          });
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij injecteren: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.rotate", async () => {
      try {
        const key = await vscode.window.showInputBox({
          prompt: "Welke secret wil je roteren?",
          placeHolder: "API_KEY"
        });
        
        if (!key) return;

        const newValue = await vscode.window.showInputBox({
          prompt: "Voer nieuwe waarde in",
          password: true,
          placeHolder: "nieuwe_secret_waarde"
        });
        
        if (!newValue) return;

        const rotated = await client.rotateSecret(key, newValue);
        vscode.window.showInformationMessage(`🔄 Secret '${key}' geroteerd`);
        provider.refresh();
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij roteren: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.deleteSecret", async () => {
      try {
        const key = await vscode.window.showInputBox({
          prompt: "Welke secret wil je verwijderen?",
          placeHolder: "API_KEY"
        });
        
        if (!key) return;

        const confirm = await vscode.window.showWarningMessage(
          `Weet je zeker dat je '${key}' wilt verwijderen?`,
          { modal: true },
          "Verwijderen",
          "Annuleren"
        );
        
        if (confirm !== "Verwijderen") return;

        const deleted = await client.deleteSecret(key);
        if (deleted) {
          vscode.window.showInformationMessage(`🗑️ Secret '${key}' verwijderd`);
          provider.refresh();
        } else {
          vscode.window.showErrorMessage(`❌ Secret '${key}' niet gevonden`);
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij verwijderen: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.settings", async () => {
      const config = vscode.workspace.getConfiguration('envtree');
      
      const action = await vscode.window.showQuickPick([
        { label: "⚙️ Daemon Instellingen", description: "Poort en host configuratie" },
        { label: "🔄 Tree Instellingen", description: "Auto-refresh en display opties" },
        { label: "🔐 Security Instellingen", description: "Secret display en timeouts" },
        { label: "📊 Status Info", description: "Daemon verbinding en project info" }
      ], {
        placeHolder: "Kies een instelling"
      });

      if (!action) return;

      switch (action.label) {
        case "⚙️ Daemon Instellingen":
          const port = await vscode.window.showInputBox({
            prompt: "Daemon poort",
            value: config.get('daemonPort', 4848).toString(),
            validateInput: (value) => {
              const num = parseInt(value);
              return isNaN(num) || num < 1024 || num > 65535 
                ? "Ongeldige poort (1024-65535)" 
                : null;
            }
          });
          
          if (port !== undefined) {
            config.update('daemonPort', parseInt(port));
            vscode.window.showInformationMessage(`✅ Daemon poort ingesteld op ${port}`);
          }
          break;

        case "🔄 Tree Instellingen":
          const autoRefresh = await vscode.window.showQuickPick([
            { label: "Auto-refresh: Aan", value: true },
            { label: "Auto-refresh: Uit", value: false }
          ], {
            placeHolder: `Auto-refresh: ${config.get('autoRefresh', true) ? 'Aan' : 'Uit'}`
          });

          if (autoRefresh) {
            config.update('autoRefresh', autoRefresh.value);
            vscode.window.showInformationMessage(`✅ Auto-refresh ${autoRefresh.value ? 'aangezet' : 'uitgezet'}`);
          }
          break;

        case "🔐 Security Instellingen":
          const showSecrets = await vscode.window.showQuickPick([
            { label: "Toon secret waarden: Aan", value: true },
            { label: "Toon secret waarden: Uit", value: false }
          ], {
            placeHolder: `Toon secret waarden: ${config.get('showSecretValues', false) ? 'Aan' : 'Uit'}`
          });

          if (showSecrets) {
            config.update('showSecretValues', showSecrets.value);
            vscode.window.showInformationMessage(`⚠️ Secret waarden display ${showSecrets.value ? 'aangezet' : 'uitgezet'} (niet aanbevolen)`);
            provider.refresh();
          }
          break;

        case "📊 Status Info":
          const isHealthy = await client.healthCheck();
          const workspaceFolders = vscode.workspace.workspaceFolders;
          const workspaceCount = workspaceFolders?.length || 0;
          
          const info = [
            `🌳 EnvTree Status`,
            ``,
            `Daemon Status: ${isHealthy ? '✅ Verbonden' : '❌ Niet verbonden'}`,
            `Workspace: ${workspaceCount} map(en) gevonden`,
            `Poort: ${config.get('daemonPort', 4848)}`,
            `Host: ${config.get('daemonHost', 'localhost')}`,
            ``,
            `Configuratie: VSCode Settings > EnvTree`
          ];

          vscode.window.showInformationMessage(info.join('\n'), { modal: true });
          break;
      }
    }),
  ];

  // Voeg alles toe aan context subscriptions
  context.subscriptions.push(
    treeView,
    ...commands
  );

  // Refresh tree bij workspace changes
  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    provider.refresh();
  });
}

/**
 * Extension deactivation functie
 */
export function deactivate() {
  console.log("🌳 EnvTree extensie is gedeactiveerd");
}
