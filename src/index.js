const vscode = require('vscode');
const { initStatusBar, updateStatusBar } = require('./status-bar');
const {
  showVersionPicker,
  setPickerContext,
  applyVersionDirectly,
  autoSwitchToExpected,
} = require('./picker');
const { NodeVersionsProvider } = require('./sidebar');

let nodeVersionsProvider;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('🚀 NVM Status Switch: Starting activation...');

  try {
    initStatusBar(context);
    setPickerContext(context);

    // Initialize the Sidebar
    const rootPath =
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;

    nodeVersionsProvider = new NodeVersionsProvider(rootPath);

    // Register nvm.versionsView provider
    vscode.window.registerTreeDataProvider(
      'nvm.versionsView',
      nodeVersionsProvider,
    );

    // Register showPicker Command
    const pickerCommand = vscode.commands.registerCommand(
      'nvm-status-switch.showPicker',
      async () => {
        await showVersionPicker();
      },
    );

    // Register refreshUI Command
    const refreshCommand = vscode.commands.registerCommand(
      'nvm-status-switch.refreshUI',
      () => {
        updateStatusBar();
        // Refresh the sidebar
        if (nodeVersionsProvider) {
          nodeVersionsProvider.refresh();
        }
      },
    );

    // Register applyVersion Command
    const applyCommand = vscode.commands.registerCommand(
      'nvm-status-switch.applyVersion',
      (version) => {
        applyVersionDirectly(version);
      },
    );

    // Commands subscriptions
    context.subscriptions.push(pickerCommand);
    context.subscriptions.push(refreshCommand);
    context.subscriptions.push(applyCommand);

    // Register listeners (Change tab & Open folders)
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(() => {
        updateStatusBar();
        if (nodeVersionsProvider) nodeVersionsProvider.refresh();
      }),
    );

    context.subscriptions.push(
      vscode.workspace.onDidChangeWorkspaceFolders(() => {
        autoSwitchToExpected();
        updateStatusBar();
        if (nodeVersionsProvider) nodeVersionsProvider.refresh();
      }),
    );

    // Initial activation
    autoSwitchToExpected();
    updateStatusBar();

    console.log('✅ NVM Status Switch: Activation completed successfully.');
  } catch (error) {
    console.error('❌ NVM Status Switch: Error during activation:', error);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
