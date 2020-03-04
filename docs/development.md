# Development

## Setup

### Tools

* [Git](https://git-scm.com) or [GitHub for Windows](https://windows.github.com/)
* Browsersync (optional)
* Docker and Docker Compose (optional)
* Travis Tool (optional)

### Configuring Git

If using CLI (not some GUI app):
```
git config --global core.autocrlf false
git config --global user.name <username>
git config --global user.email <email-address>
```

Alternatively, on Windows, use the GitHub for Windows app to setup everything

### (Optional) Installing Browsersync

`npm install -g browser-sync`

### (Optional) Installing and Configuring Docker

Install both Docker and Docker Compose (combined app on Windows).
On Linux, add yourself to the `docker` group and then re-log, so that you can run Docker commands as non-root.

### (Optional) Installing Travis Tool

Optional, used for encrypting Travis CI secrets and files and stuff.
```
sudo apt install ruby-dev rubygems
sudo gem install travis
```

## Running

- Option A: Open `src/index.html` directly.
- Option B: Run `manage/run.sh` which starts a dev server with hot reloading (requires Browsersync).

### Run with Docker

This way is intended just for testing Docker stuff.

* Setup: `manage/docker/setup.sh` (first time or after project change)
* Run server: `manage/docker/run.sh`

## Making Changes

* If you're committing code changes, run `manage/check.sh` first to make sure the formatting is correct and that tests still pass.
* If you're adding/changing/fixing features, add it to the changelog.
