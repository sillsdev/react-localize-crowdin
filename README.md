# react-localize-crowdin

[![Node Actions Status][github-actions-node-badge]][github-actions-node]
[![CodeQL Actions Status][github-actions-codeql-badge]][github-actions-codeql]
[![Coverage][codecov-badge]][codecov]
[![GitHub contributors][github-contribs-badge]][github-contribs]
[![GitHub][github-license-badge]][github-license]

[github-actions-node-badge]: https://github.com/sillsdev/react-localize-crowdin/workflows/Node.js%20CI/badge.svg
[github-actions-node]: https://github.com/sillsdev/react-localize-crowdin/actions/workflows/node.js.yml
[github-actions-codeql-badge]: https://github.com/sillsdev/react-localize-crowdin/workflows/CodeQL/badge.svg
[github-actions-codeql]: https://github.com/sillsdev/react-localize-crowdin/actions/workflows/codeql.yml
[codecov-badge]: https://codecov.io/gh/sillsdev/react-localize-crowdin/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/sillsdev/react-localize-crowdin
[github-contribs-badge]: https://img.shields.io/github/contributors/sillsdev/react-localize-crowdin?cacheSeconds=10000
[github-contribs]: https://github.com/sillsdev/react-localize-crowdin/graphs/contributors
[github-license-badge]: https://img.shields.io/github/license/sillsdev/react-localize-crowdin
[github-license]: https://github.com/sillsdev/react-localize-crowdin/blob/master/LICENSE

A node module to support localizing i18next apps with Crowdin

# Developer Guide

Run to main project script:

```bash
node index.js
```

Run linting on project:

```bash
npm run lint
```

Automatically format the repository using Prettier:

```bash
npm run prettier
```

Run the `*.spec.js` unit tests:

```bash
npm test
```

## Use `node index.js` for The Combine

This section assumes the `react-localize-crowdin` and `TheCombine` repos share a common parent directory.

### XLIFF to JSON (`-x2j`)

Convert a Crowdin XLIFF translation file to a JSON translation file for use with i18next:

```bash
node index -x2j translations.pt-BR.xlf translation.pt.json
cp translation.pt.json ../TheCombine/public/locales/pt/translation.json
```

### JSON to XLIFF source (`-j2x`)

Convert a JSON translation source file to an XLIFF source file for uploading to Crowdin:

```bash
cp ../TheCombine/public/locales/en/translation.json translation.en.json
node index -j2x translation.en.json translations.en.xlf
```

### JSON to XLIFF translations (`-j2xt`)

Create a bilingual XLIFF from source and pre-translated JSON files (e.g., `translation.id.json`) for uploading translations to Crowdin. The target language code is inferred from the target JSON filename.

```bash
node index -j2xt translation.en.json translation.id.json translations.id.xlf
```

To upload the resulting bilingual XLIFF to Crowdin, navigate to the "Translations" tab in the Crowdin project and, under "Upload existing translation", drop or select the `.xlf` file. In the "Source file" dropdown, type "transl" and select "/translations.en.xlf". The target language should be automatically selected. Then click the Import button.
