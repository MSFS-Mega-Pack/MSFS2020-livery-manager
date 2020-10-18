# Liveries Mega Pack Manager

A simple to use livery manager for Flight Simulator 2020.

[Join the Official Liveries Mega Pack Discord server](https://discord.gg/megapack)

[![DeepScan grade](https://deepscan.io/api/teams/10690/projects/13519/branches/230735/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10690&pid=13519&bid=230735) [![](https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/workflows/Smoketest/badge.svg)](https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/actions/)

## Usage

1. Join the Official Liveries Mega Pack Discord server: https://discord.gg/megapack
2. Download the latest manager release: https://liveriesmegapack.com/manager
3. Follow the instructions to complete the setup.

### Installing liveries

1. Head to "Available Liveries".
2. Select all liveries you want to install.
3. Click the orange Install Liveries button.
4. Wait for the liveries to install - the first download often takes the longest (up to a minute on some connections).

## Support

**Please do not submit support queries on GitHub.**

If you open an issue with a support query about using the manager, it will be closed. Please submit these support requests via the [Liveries Mega Pack Discord server](https://discord.gg/megapack).

We do allow support queries about contributing to the manager on GitHub, as well as bug reports and feature requests.

## FAQs

### "I want to report a problem with a livery!"

Please report any issues regarding liveries to the Mega Pack Discord. The liveries are not produced by us, so we cannot fix any issues with them.

### "A livery is failing to install in the manager!"

If a livery fails to install, it's likely the ZIP is corrupted on our server, or while being downloaded. We get an automated alert when a livery fails to install, so you don't need to contact us about this. It should be fixed with 24 hours.

If the livery still fails to install after 24 hours have passed, please [create an issue](https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/issues/new?assignees=&labels=bug%2C+triage+needed&template=bug-report.md&title=%5BBUG%5D+Broken+livery:+%3Clivery+name%3E) in this repository.

### "The app is stuck on installing livery 1 of X"

The first livery can take a while to start downloading (up to 1 minute). This is because your PC needs to connect to the API, then to our global CDN, initiate a secured connection, fetch the file, then start serving it to you. Even after this, the speeds are often slow to begin with.

If the manager has been stuck on the first livery for over 5 mins, please restart it and try again.

## License and copyright

We offer **no license** for this repository. For more info, please see [the LICENSE file](LICENSE.md)

## Development

Run `yarn start` to run the Electron app.

## Add your livery to the manager

Submit your livery to the Mega Pack via the Discord server: https://discord.gg/megapack
