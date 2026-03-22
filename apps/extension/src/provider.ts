import * as vscode from "vscode";
import { EnvTreeClient, Secret, Project } from "./client";

/**
 * Tree item types voor de EnvTree explorer
 */
export class EnvTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public itemData?: Secret | Project,
    public readonly itemType?: "project" | "secret"
  ) {
    super(label, collapsibleState);
    
    if (itemType === "project") {
      this.contextValue = "project";
      this.iconPath = new vscode.ThemeIcon("folder");
    } else if (itemType === "secret") {
      this.contextValue = "secret";
      this.iconPath = new vscode.ThemeIcon("key");
      this.description = this.maskSecret((itemData as Secret).value);
    }
  }

  /**
   * Mask secret waarde voor display
   */
  private maskSecret(value: string): string {
    if (!value) return "";
    return "●".repeat(Math.min(value.length, 8));
  }
}

/**
 * Tree data provider voor EnvTree sidebar
 */
export class EnvTreeProvider implements vscode.TreeDataProvider<EnvTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<EnvTreeItem | undefined | null | void> = new vscode.EventEmitter<EnvTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<EnvTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private projects: Project[] = [];
  private secrets: Secret[] = [];

  constructor(private client: EnvTreeClient) {}

  /**
   * Refresh de tree data
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Haal tree item op voor element
   */
  getTreeItem(element: EnvTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Haal children op voor element
   */
  async getChildren(element?: EnvTreeItem): Promise<EnvTreeItem[]> {
    try {
      // Als geen element, toon projecten
      if (!element) {
        await this.loadProjects();
        return this.projects.map(project => 
          new EnvTreeItem(
            project.name,
            vscode.TreeItemCollapsibleState.Expanded,
            project,
            "project"
          )
        );
      }

      // Als project element, toon secrets
      if (element.itemType === "project") {
        const project = element.itemData as Project;
        await this.loadSecrets(project.path);
        
        return this.secrets.map(secret =>
          new EnvTreeItem(
            secret.key,
            vscode.TreeItemCollapsibleState.None,
            secret,
            "secret"
          )
        );
      }
    } catch (error) {
      console.error("Fout bij laden tree data:", error);
      vscode.window.showErrorMessage(`❌ EnvTree fout: ${error}`);
    }

    return [];
  }

  /**
   * Laad projecten van de daemon
   */
  private async loadProjects(): Promise<void> {
    try {
      this.projects = await this.client.getProjects();
    } catch (error) {
      // Als daemon niet beschikbaar, probeer huidige project te initialiseren
      console.warn("Kan projecten niet laden, daemon niet beschikbaar");
      this.projects = [];
    }
  }

  /**
   * Laad secrets voor specifiek project
   */
  private async loadSecrets(projectPath: string): Promise<void> {
    try {
      this.secrets = await this.client.getSecrets();
    } catch (error) {
      console.warn(`Kan secrets niet laden voor project ${projectPath}:`, error);
      this.secrets = [];
    }
  }

  /**
   * Haal huidige project pad op
   */
  private getCurrentProjectPath(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return undefined;
    }
    return workspaceFolders[0].uri.fsPath;
  }
}
