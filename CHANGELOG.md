# Change Log

All notable changes to the "nvm-status-switch" extension will be documented in this file.

## [Unreleased]
### Added
- **Windows support:** Detects Node versions installed via `nvm-windows` by reading the `NVM_HOME` environment variable (falling back to `NVM_DIR`), instead of assuming the Unix `~/.nvm/versions/node` layout. `PATH` updates now use the correct per-platform version directory (no `bin` subfolder on Windows).

## [1.1.0] - 2026-04-07
### Added
- **NodeVersions Sidebar:** A dedicated activity bar view to see active, expected, and installed Node versions.
- **Dynamic Version Picker:** Click the status bar to open a Quick Pick menu with all local Node versions.
- **Real-Time Terminal Sync:** Switching versions now instantly updates the `PATH` for new and existing VS Code integrated terminals.
- **Project Awareness:** Automatically detects `.nvmrc` and `package.json` constraints to warn about version mismatches.