# Changelog

All notable changed to the livery manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - Unreleased

### Added

_None_

### Changed


- Add Longitude to plane name table to stop it showing as "asobo_longitude" (#135)
- Refresh installed liveries list after installation to show newly installed liveries (#136)
- Make refresh button in installed liveries tab actually refresh the installed liveries list (#136)


### Removed

_None_

### Meta

_None_

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
