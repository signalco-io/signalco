# Development for Station

Actions status

[![Create new release](https://github.com/signalco-io/signalco/actions/workflows/create-release.yml/badge.svg)](https://github.com/signalco-io/station/actions/workflows/create-release.yml)

[![Publish Binaries](https://github.com/signalco-io/signalco/actions/workflows/station-release-binaries.yml/badge.svg)](https://github.com/signalco-io/station/actions/workflows/release-binaries.yml)

## Table of contents

- [Getting Started](#getting-started)
- [Contributing](#contributing)
  - [Commits](#commits)
- [Publishing](#publishing)
- [Channels](#channels)
  - [Voice](#voice)

## Getting Started

Requirements:

- [.NET 9 SDK](https://dotnet.microsoft.com/)

Running station

```bash
dotnet run --project ./Signal.Beacon.WorkerService
```

## Contributing

### Commits

Commit messages need to contain semantic-release anotations in order to propperly trigger release.

The table below shows which commit message gets you which release type when `semantic-release` runs (using the default configuration):

| Commit message | Release type               |
| -------------- | -------------------------- |
| `fix(Docs): Fixed a typo in documentation` | Patch Release |
| `feat(Docs): Added new documentation file` | Feature Release |
| `perf(Docs): Removed documentation for feature`<br /><br />`BREAKING CHANGE: The documentation for this feature was removed.`<br />`This feature is no longer supported.` | Breaking Release |

For more info see [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

## Publishing

Example publish command for Windows x64 target:

```bash
dotnet publish -r win-x64 --self-contained true
```

Example publish command for ARM64 (eg. >= Rpi3) target:

```bash
dotnet publish -r linux-arm64 --self-contained true
```

_[.NET Core RID Catalog](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog) for more options for `-r` flag._

## Channels

### Internal services

- Processor
- Voice
- ConductHandler

### Channels

- BroadLink
- Divoom
- iRobot
- PhilipsHue
- Processor
- Signal
- Samsung
- Zigbee2Mqtt

### Voice

#### Wake word - Porcupine

Wake word aucustic model is located in:

- `resourceskeyword_files/<PLATFORM>/computer.ppn`
