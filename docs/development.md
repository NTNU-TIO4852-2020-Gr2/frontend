# Development

## Setup

### Tools

* [Git](https://git-scm.com) or [GitHub for Windows](https://windows.github.com/)
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

TODO

### Run with Docker

This way is intended just for testing Docker stuff.

* Setup: `manage/docker/setup.sh` (first time or after project change)
* Run server: `manage/docker/run.sh`

## Making Changes

* If you're committing code changes, run `manage/check.sh` first to make sure the formatting is correct and that tests still pass.
* If you're adding/changing/fixing features, add it to the changelog.
