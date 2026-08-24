#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const { decodeHTML } = require('entities');

const REQUIRED_MAINTENANCE_MARKERS = [
  '## 共有コンポーネント同期メタデータ',
  'shared.version',
  'shared.compatibleVersions',
  'shared.lastSync',
  'book-formatter/shared/version.json',
  'book-formatter/scripts/sync-components.js',
  'docs/appendices/update-notes.md',
  '内容の鮮度',
  '手動更新',
  'book-local',
  'owner: ' + String.fromCharCode(96) + 'ootakazuhiko' + String.fromCharCode(96),
];

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseSemanticVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value ?? '');
  return match ? match.slice(1).map(Number) : null;
}

function compareSemanticVersions(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function optionValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(name + ' requires a file path');
  }
  return value;
}

function readerVisibleText(value) {
  return decodeHTML(value
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]*>/g, ''))
    .replace(/\p{Default_Ignorable_Code_Point}/gu, '');
}

function validate(state, now = new Date()) {
  const errors = [];
  const shared = state.config.shared;

  if (!shared || typeof shared !== 'object' || Array.isArray(shared)) {
    errors.push('book-config.json must define shared metadata');
    return errors;
  }
  const currentVersion = parseSemanticVersion(shared.version);
  if (!currentVersion) {
    errors.push('shared.version must be a semantic version');
  }

  const compatibleVersions = Object.hasOwn(shared, 'compatibleVersions')
    ? shared.compatibleVersions
    : [];
  if (!Array.isArray(compatibleVersions)) {
    errors.push('shared.compatibleVersions must be an array when present');
  } else {
    if (compatibleVersions.length > 1) {
      errors.push('shared.compatibleVersions may declare at most one staged version');
    }
    for (const version of compatibleVersions) {
      const parsedVersion = parseSemanticVersion(version);
      if (!parsedVersion) {
        errors.push('shared.compatibleVersions entries must be semantic versions');
      } else if (currentVersion && compareSemanticVersions(parsedVersion, currentVersion) <= 0) {
        errors.push('shared.compatibleVersions must contain only a forward version');
      } else if (!state.maintenance.includes('`' + version + '`')) {
        errors.push('each shared.compatibleVersions entry must be documented in MAINTENANCE.md: ' + version);
      }
    }
  }

  const acceptedVersions = Array.isArray(compatibleVersions)
    ? [shared.version, ...compatibleVersions]
    : [shared.version];
  if (state.formatterVersion !== null && !acceptedVersions.includes(state.formatterVersion)) {
    errors.push(
      'shared.version or a reviewed compatible version must match the pinned formatter: '
      + acceptedVersions.join(', ') + ' != ' + state.formatterVersion,
    );
  }

  const parsed = new Date(shared.lastSync);
  if (
    typeof shared.lastSync !== 'string'
    || Number.isNaN(parsed.getTime())
    || parsed.toISOString() !== shared.lastSync
  ) {
    errors.push('shared.lastSync must be a canonical ISO-8601 timestamp');
  } else if (parsed.getTime() > now.getTime()) {
    errors.push('shared.lastSync must not be in the future');
  }

  for (const marker of REQUIRED_MAINTENANCE_MARKERS) {
    if (!state.maintenance.includes(marker)) {
      errors.push('MAINTENANCE.md must document: ' + marker);
    }
  }

  const publicFreshness = readerVisibleText(state.publicFreshness);
  for (const forbidden of ['shared.version', 'shared.compatibleVersions', 'shared.lastSync', 'book-config.json#shared']) {
    if (publicFreshness.includes(forbidden)) {
      errors.push('public freshness notes must not expose maintainer metadata: ' + forbidden);
    }
  }

  return errors;
}

function loadState() {
  const formatterVersionPath = optionValue('--formatter-version');
  const builtSitePath = optionValue('--built-site');
  const publicFreshness = [fs.readFileSync('docs/appendices/update-notes.md', 'utf8')];
  if (builtSitePath) {
    publicFreshness.push(fs.readFileSync(
      builtSitePath + '/appendices/update-notes/index.html',
      'utf8',
    ));
  }
  return {
    config: readJson('book-config.json'),
    formatterVersion: formatterVersionPath
      ? readJson(formatterVersionPath).version
      : null,
    maintenance: fs.readFileSync('MAINTENANCE.md', 'utf8'),
    publicFreshness: publicFreshness.join('\n'),
  };
}

function expectRejected(base, name, mutate, marker) {
  const state = clone(base);
  mutate(state);
  const errors = validate(state);
  if (!errors.some((error) => error.includes(marker))) {
    throw new Error('self-test ' + name + ': mutation was not rejected (' + errors.join('; ') + ')');
  }
}

const state = loadState();
const errors = validate(state);
if (errors.length) {
  console.error('Shared metadata contract failed:');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

if (process.argv.includes('--self-test')) {
  const cases = [
    ['missing shared object', (s) => { delete s.config.shared; }, 'define shared metadata'],
    ['invalid version', (s) => { s.config.shared.version = 'latest'; }, 'semantic version'],
    ['formatter version mismatch', (s) => { s.formatterVersion = '999.0.0'; }, 'must match the pinned formatter'],
    ['compatibility list is not an array', (s) => { s.config.shared.compatibleVersions = '3.2.3'; }, 'must be an array'],
    ['null compatibility list', (s) => { s.config.shared.compatibleVersions = null; }, 'must be an array'],
    ['invalid compatible version', (s) => { s.config.shared.compatibleVersions = ['next']; }, 'entries must be semantic versions'],
    ['multiple staged versions', (s) => { s.config.shared.compatibleVersions = ['3.2.3', '3.3.0']; }, 'at most one staged version'],
    ['non-forward compatible version', (s) => { s.config.shared.compatibleVersions = ['3.2.1']; }, 'only a forward version'],
    ['current version repeated as compatible', (s) => { s.config.shared.compatibleVersions = [s.config.shared.version]; }, 'only a forward version'],
    ['undocumented compatible version', (s) => { s.config.shared.compatibleVersions = ['3.2.4']; }, 'must be documented'],
    ['invalid timestamp', (s) => { s.config.shared.lastSync = '2026-02-04'; }, 'canonical ISO-8601'],
    ['missing generator source', (s) => { s.maintenance = s.maintenance.replace('book-formatter/scripts/sync-components.js', 'unknown-generator'); }, 'sync-components.js'],
    ['public timestamp leak', (s) => { s.publicFreshness += '\nshared.lastSync\n'; }, 'must not expose'],
    ['public version leak', (s) => { s.publicFreshness += '\nshared.version\n'; }, 'must not expose'],
    ['public compatibility leak', (s) => { s.publicFreshness += '\nshared.compatibleVersions\n'; }, 'must not expose'],
    ['entity-encoded public leak', (s) => { s.publicFreshness += '\nshared&#46;version\n'; }, 'must not expose'],
    ['markup-split public leak', (s) => { s.publicFreshness += '\nshared.<span>lastSync</span>\n'; }, 'must not expose'],
    ['invisible-entity public leak', (s) => { s.publicFreshness += '\nshared&ZeroWidthSpace;.version\n'; }, 'must not expose'],
  ];
  cases.forEach(([name, mutate, marker]) => expectRejected(state, name, mutate, marker));
  console.log('Shared metadata contract self-test passed: ' + cases.length + ' negative mutations rejected.');
} else {
  console.log('Shared metadata contract passed: version ' + state.config.shared.version + ', last sync ' + state.config.shared.lastSync + '.');
}
