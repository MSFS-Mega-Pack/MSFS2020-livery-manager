# Changelog

All notable changed to the livery manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changed marked with `[DEV]` are invisible to users, and purely for the benefit of developers.

## [0.4.6] - 2021-03-07

### Added

- Add Turkish language (#302)
- Add Polish language ([@IncredibleQuark](https://github.com/IncredibleQuark))

### Changed

_None_

### Removed

_None_

### Meta

_None_

## [0.4.5] - 2021-02-13

### Added

- Add error page which shows if an unrecoverable error occurs

### Changed

- Fix bug where the manager wouldn't auto-create your community in the correct location
- Fix bug where update/remove all buttons would show under Installed Liveries even if an invalid community folder was provided

### Removed

_None_

### Meta

_None_

## [0.4.4] - 2021-02-13

### Added

- **Actually** add Spanish language (oops!) ([@jalbertseg](https://github.com/jalbertseg)) (#275)
- Add Portuguese language ([@zephirus](https://github.com/zephirus)) (#285)
- Add Traditional Chinese language ([@JeremyGolf70](https://github.com/JeremyGolf70)) (#228)

### Changed

- Improve French translation ([@Dites33](https://github.com/Dites33)) (#299)
- Update project dependencies
- Fix rare blank manager bug where community folder is removed after being set
- Fix incorrect Italian language display name

### Removed

_None_

### Meta

_None_

## [0.4.1] - 2021-01-14

### Added

- Add Spanish language ([@jalbertseg](https://github.com/jalbertseg)) (#262)
- Add Thai language ([@SquisheeFreshy](https://github.com/SquisheeFreshy)) (#260)
- Add Brazilian Portuguese language ([@LucasmullerC](https://github.com/LucasmullerC)) (#241)

### Changed

- [DEV] Enable Dev Tools in production

### Removed

_None_

### Meta

_None_

## [0.4.0] - 2020-12-25

### Added

- Add Swedish language ([@brezedc](https://github.com/brezedc)) (#180)
- Add Dutch language ([@JSSRDRG](https://github.com/JSSRDRG)) (#188)
- Add German language ([@dominique-mueller](https://github.com/dominique-mueller)) (#198)
- Add Italian language ([@allemattio](https://github.com/allemattio)) (#215)
- Add Simplified Chinese language ([@JeremyGolf70](https://github.com/JeremyGolf70)) (#220)

### Changed

- Increase amount of liveries that are shown at once
- Change how dates display to use localised values from dayjs
- Fix missing spacing for buttons on Installed Liveries tab
- [DEV] Fixed issue with custom languages that didn't affect anyone in 0.3.1, but would have from this update (@davwheat and [@dominique-mueller](https://github.com/dominique-mueller)) (#182 and #198)
- [DEV] Fix incorrect prop types ([@dominique-mueller](https://github.com/dominique-mueller)) (#198)
- [DEV] Update dependencies

### Removed

_None_

### Meta

_None_

## [0.3.1] - 2020-11-15

### Added

_None_

### Changed

- Fixed bug where users can't progress from the language selection page (7e6da5)

### Removed

_None_

### Meta

_None_

## [0.3.0] - 2020-11-13

### Added

- Add button to open Community folder in explorer (#132)
- Add button to delete ALL installed liveries (don't worry, you have to confirm it) (#141)
- Add internationalisation (translation) support (#144)
- YOU CAN RESIZE THE WINDOW NOW STOP COMPLAINING PLEASE! (#155)
- You can now update your liveries at the press of a button! (#161)
- We now collect anonymous analytics about what liveries are being installed (the only data being sent is the name of the livery when you install it) (#161)

### Changed

- Show scrollbar on all tabs (was previously hidden) (#134)
- Add Longitude to plane name table to stop it showing as "asobo_longitude" (#135)
- Refresh installed liveries list after installation to show newly installed liveries (#136)
- Make refresh button in installed liveries tab actually refresh the installed liveries list (#136)
- Clarify refresh box text from "Livery list last updated" to "Last refreshed" (#140)
- Add missing aircraft translations (#142 & #158)
- \[DEV\] Fix broken sourcemap uploads (#143)
- \[DEV\] Create community folder if it does not exist, should fix the blank screen bug. (#148)

### Removed

_None_

### Meta

- Add "add to changelog" task in PR templates (#156)

## [0.2.2] - 2020-10-20

### Added

- Add more remote error logging to identify common issues in code (#118)

### Changed

- Code clean-up and refactors (#118)

### Removed

_None_

### Meta

_None_

## [0.2.1] - 2020-10-19

### Added

_None_

### Changed

- Rename manager to Liveries Mega Pack Manager

### Removed

_None_

### Meta

- Update README with info about the manager, and a brief FAQ

## [0.2.0] - 2020-10-17

### Added

- Sentry logging for failed livery installations (#105)
- Added installed livery management (updating coming soon!) (#107)

### Changed

- Allow access to setup stage without internet connectivity (#104)
- Changed the "Failed to install livery" message (#105)
- Prevent crashing when installing a corrupt livery (#105)
- Updated dependencies (#106)

### Removed

_None_

### Meta

_None_

## [0.1.2] - 2020-10-12

### Added

_None_

### Changed

- Fix the incorrect version showing in Settings (3cceb9265e0047285ca90fc73e8219dbb5af9646)

### Removed

_None_

### Meta

_None_

## [0.1.1] - 2020-10-12

### Added

- Add count of installed liveries to unexpanded accordion (8982ae5800da7a6833643bcf0606ace935916bec)
- Allow builds without a Sentry API key (37eeeab47e8125ab8efaa08c476b996419c99b84)
- Use `makeStyles` to generate classNames instead of inline styles (11d7453beaa282002538599e26e3419343ae24ab)
- Complete functioning auto-update system (#75) (2155eca2ccba45d3ff34064dc34280f1bc3b2d9d)
- Add application version and about info to settings (22ad1ed320de295a03c80a9b5b3103ba994882db)
- Show current version and version being updated to on update page (#77)

### Changed

- Update 'no image available' thumbnail (f88a7c1527009f8cc9f32aef0717cd8085e170df)
- Fix error when thumbnail is not defined (4d3ce24f1be27a652a925cee0b6687b228e85e62)
- Fix build on case sensitive filesystems (e996fb43657a97cd03f7633c79e02acf18662bb6)
- Extract RefreshBox from inside the available liveries tab to its own component (4038edf8d930b604a464604324e97adb002b9592)
- Make Smoketest only run on pushes to master (2b7fd6ad0e28afc25a00436e0fa016327cee82a0)
- Fix incorrect Google Fonts CSS URL on update page (#78)
- Ask user for their Community directory instead of root packages dir (#87 #88)
- Use new official domain for manager CDN and API (#86)

### Removed

_None_

### Meta

- Add GitHub issue and PR templates (#76)

## [0.1.0](https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/releases/tag/v0.1.0) - 2020-10-11

Initial release! Woohoo 🎉

### Added

- Initial splash screen (75948c386f559ddff1d88d16af9184f29e313855)
- Automated packages directory detection (a93d9188d1e17a5a2126b7b6233833029b36fdb0)
- Smoketest CI on all pushes and PRs (cf61cc5fd2669544efe8f95ed7b7b171fb2c5a7d)
- Complete automated releases and sourcemap upload on new tag (c3fb191f47e20073c983ade4ed28847f691bdcf6)
- Add list of all aircraft and liveries
- Add home screen article feed (ad8e46e742d185a34587c8ecab093e4a72f2eb4a)
- Add settings page (69ff8bcafc8904b684af27a1f46ab6da591b850e)
- Add hidden advanced settings (c6e2fa3c88c8a3e3a0ebca3d8ee684cebb4b75a5)

### Changed

_None_

### Removed

_None_

### Meta

_None_
