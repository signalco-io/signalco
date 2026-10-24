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
