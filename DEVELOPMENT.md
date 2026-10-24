# Development

See [Development](/web/DEVELOPMENT.md) for web development.
_Note: Other development guides are coming soon_

## Systems

- [Web Development](./web/DEVELOPMENT.md)
- [Infrastructure Development](./infra/README.md)

_Note: [uier.io](https://uier.io) (website, review toolbar and infrastructure) moved to its own repository: [signalco-io/uier](https://github.com/signalco-io/uier)._

## Conventions

### Changelog and commits

- We are using [Conventional Changelog with Angular conventions](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)
- Commits from core contributors and forks should be done against `next` branch

## GitHub actions

Pull requests are labeled automatically from changed file paths using
[`.github/labeler.yml`](./.github/labeler.yml). The labeler runs when a PR is
opened, reopened, updated, or edited, including PRs from forks. It uses the
configuration from the PR's base branch without checking out PR code.

When adding an app or package, update the path rules using existing repository
labels. Configured labels are removed if their paths no longer match; labels
outside the configuration (such as bug, feature, and status labels) are preserved.

You can use [`act`](https://github.com/nektos/act) to develop actions locally.

```bash
act -l
```

Example running `workflow_dispatch` event on `analyze_app` job:

```bash
act workflow_dispatch -j analyze_app -s GITHUB_TOKEN="$(gh auth token)" --secret-file ./config/gh-secrets.local
```

Notes:

- GitHub secrets can be places in `/config/gh-actions-secrets.local`
