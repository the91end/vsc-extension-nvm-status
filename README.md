# NVM Status Switch 🚀

A powerful Visual Studio Code extension to switch and install Node.js from the status bar and sidebar using `nvm` (Node Version Manager). It detects your project's requirements, warns you of mismatches, and syncs your integrated terminals.

## Features

### 🟢 Status Bar & Version Picker
* **Real-time UI**: Shows the currently active Node version.
* **Quick Pick**: Click the Status Bar item to open a version picker showing installed versions.
* **Project Mismatch Warning**: If your active Node version doesn't match the project's `.nvmrc` or `package.json`, the status bar changes color to warn you.

### 🔄 Automatic Version Switching
When you open a project, the extension automatically switches to its expected Node version (from `.nvmrc` or `package.json`) if that version is installed and not already active. If the expected version isn't installed, it falls back to the mismatch warning so you can install or pick another. Disable this with the `nvmStatusSwitch.autoSwitch` setting.

### 📁 Project Declaration Scan
NodeSwitcher determines a "project" Node expectation by consulting sources in order:
1. `.nvmrc`
2. `package.json` (`engines.node`)

### 💻 Terminal Environment Sync
When you switch versions, the extension updates VS Code's environment API (`PATH`). Newly opened terminals will automatically use the selected Node version.

## Requirements

* **macOS / Linux**: `nvm` must be installed and available in your environment (`~/.zshrc` or `~/.bashrc`). Versions are read from `~/.nvm/versions/node`.
* **Windows**: [`nvm-windows`](https://github.com/coreybutler/nvm-windows) must be installed. Its installer sets the `NVM_HOME` environment variable, which the extension uses to locate installed versions.
* **VS Code**: ^1.110.0 or newer. A folder opened as a workspace is recommended.

## Quick Start
1. Install `nvm` (Unix) or `nvm-windows` (Windows).
2. Install this extension.
3. Click the **Node** entry in the status bar to choose a version.
4. In integrated terminals, run `node -v` to confirm the switch.

---
**Developed by Owen Lobato** | Built for developers who switch contexts between projects seamlessly.
