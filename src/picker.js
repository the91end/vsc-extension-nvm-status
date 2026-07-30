const vscode = require('vscode');
const path = require('path');
const {
  getInstalledNodeVersions,
  getCurrentVersion,
  getExpectedVersion,
  getNodeBinPath,
  versionSatisfies,
  resolveInstalledVersion,
  setActiveVersion,
} = require('./version-detector');

let extensionContext;

function setPickerContext(context) {
  extensionContext = context;
}

// Shared routine that activates a Node version: updates the PATH for future
// terminals, runs `nvm use` in existing ones, records the active version and
// refreshes the UI. Returns false when there is no extension context.
function activateVersion(version, { notify = true, message } = {}) {
  if (!extensionContext) {
    return false;
  }

  const nvmBinPath = getNodeBinPath(version);
  if (nvmBinPath) {
    // Clear first so repeated switches don't stack multiple nvm bin
    // directories onto PATH.
    extensionContext.environmentVariableCollection.clear();
    extensionContext.environmentVariableCollection.prepend(
      'PATH',
      `${nvmBinPath}${path.delimiter}`,
    );
  }

  // Update live terminals
  vscode.window.terminals.forEach((terminal) => {
    terminal.sendText(`nvm use ${version}`);
  });

  setActiveVersion(version);
  vscode.commands.executeCommand('nvm-status-switch.refreshUI');

  if (notify) {
    vscode.window.showInformationMessage(
      message || `Node v${version} activated.`,
    );
  }

  return true;
}

// Automatically switches to the project's expected Node version when it is
// installed and not already active. Silently does nothing when auto-switch is
// disabled, no version is expected, the current version already satisfies it,
// or the expected version is not installed (the status bar surfaces that case).
function autoSwitchToExpected() {
  const config = vscode.workspace.getConfiguration('nvmStatusSwitch');
  if (!config.get('autoSwitch', true)) {
    return;
  }

  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    return;
  }

  const expected = getExpectedVersion(folders[0].uri.fsPath);
  if (!expected) {
    return;
  }

  const current = getCurrentVersion();
  if (versionSatisfies(current, expected)) {
    return;
  }

  const target = resolveInstalledVersion(expected, getInstalledNodeVersions());
  if (!target || target === current) {
    return;
  }

  activateVersion(target, {
    message: `Auto-switched to Node v${target} (project expects v${expected}).`,
  });
}

async function showVersionPicker() {
  const installedVersions = getInstalledNodeVersions();
  const currentVersion = getCurrentVersion();

  // Get the version requested by the current project
  let projectVersion = null;
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    projectVersion = getExpectedVersion(folders[0].uri.fsPath);
  }

  if (installedVersions.length === 0) {
    vscode.window.showErrorMessage(
      'No Node versions were found. Make sure you have nvm installed.',
    );
    return;
  }

  // Build options with labels
  const options = installedVersions.map((v) => {
    const isCurrent = v === currentVersion;
    const isProject = v === projectVersion;
    const isMatch = isCurrent && isProject;


    // List of tags for the description
    let tags = [];
    if (isMatch) {
      tags.push('$(pass-filled) Expected & Current');
    } else if (isCurrent) {
      tags.push('$(tag) Current');
    } else if (isProject) {
      tags.push('$(pass) Expected');
    }

    return {
      label: `v${v}`,
      description: tags.join('  '),
      versionNumber: v,
      alwaysShow: isProject,
    };
  });

  // Sort so that the project appears at the top if it exists.
  // options.sort((a, b) => {
  //   if (a.description.includes('Expected')) return -1;
  //   if (b.description.includes('Expected')) return 1;
  //   return 0;
  // });

  const selection = await vscode.window.showQuickPick(options, {
    placeHolder: projectVersion
      ? `Project requires v${projectVersion}. Select a version:`
      : 'Select a Node.js version:',
  });

  if (selection) {
    activateVersion(selection.versionNumber);
  }
}

function applyVersionDirectly(versionNumber) {
  activateVersion(versionNumber, {
    message: `Node v${versionNumber} activated from Sidebar.`,
  });
}

module.exports = {
  showVersionPicker,
  setPickerContext,
  applyVersionDirectly,
  autoSwitchToExpected,
};
