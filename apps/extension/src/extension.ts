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
  client.healthCheck().then(isHealthy => {
    if (isHealthy) {
      console.log("✅ EnvTree daemon verbinding succesvol");
      vscode.window.showInformationMessage("🌳 EnvTree: Daemon verbinding actief");
    } else {
      console.log("❌ EnvTree daemon niet bereikbaar");
      vscode.window.showWarningMessage("⚠️ EnvTree: Daemon niet gevonden. Start de daemon met 'npm run start' in de daemon folder");
    }
  }).catch(error => {
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
    vscode.commands.registerCommand("envtree.init", () => {
      vscode.window.showInformationMessage("🚀 EnvTree project initialiseren...");
    }),

    vscode.commands.registerCommand("envtree.addSecret", async () => {
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

      try {
        await client.addSecret(key, value);
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
        
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("❌ Geen workspace gevonden");
          return;
        }

        const envPath = vscode.Uri.joinPath(workspaceFolders[0].uri, ".env");
        
        // Schrijf .env bestand
        await vscode.workspace.fs.writeFile(
          envPath, 
          Buffer.from(content, "utf8")
        );

        vscode.window.showInformationMessage("✅ Secrets geïnjecteerd in .env");
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij injecteren: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.rotate", async () => {
      const key = await vscode.window.showInputBox({
        prompt: "Welke secret wil je roteren?",
        placeHolder: "API_KEY"
      });
      
      if (!key) return;

      try {
        await client.rotateSecret(key);
        vscode.window.showInformationMessage(`🔄 Secret '${key}' geroteerd`);
        provider.refresh();
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Fout bij roteren: ${error}`);
      }
    }),

    vscode.commands.registerCommand("envtree.refresh", () => {
      provider.refresh();
    })
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
