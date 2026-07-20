#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const docsRoot = path.join(root, 'docs');
const appendixPath = path.join(docsRoot, 'appendices', 'update-notes.md');
const runbookPath = path.join(root, 'MAINTENANCE.md');
const packagePath = path.join(root, 'package.json');
const workflowPath = path.join(root, '.github', 'workflows', 'book-qa.yml');

const forbidden = [
  { id: 'raw Issue number', pattern: /\bIssue\s*#?\s*\d+\b/giu },
  { id: 'raw PR number', pattern: /\bPR\s*#?\s*\d+\b/giu },
  {
    id: 'internal Issue or PR URL',
    pattern: /https:\/\/github\.com\/itdojp\/ai-era-engineers-mind-book\/(?:issues|pull)\/\d+/giu,
  },
  { id: 'portfolio sprint marker', pattern: /\bportfolio(?:-level)?\s+sprint\b/giu },
  { id: 'review-thread remediation evidence', pattern: /\breview\s+thread\s*対応/giu },
  { id: 'Book QA evidence', pattern: /\bBook\s+QA\b/giu },
  { id: 'Copilot review evidence', pattern: /\bCopilot\s+review\b/giu },
  { id: 'main merge commit evidence', pattern: /\bmain\s+merge\s+commit\b/giu },
  { id: 'PR head evidence', pattern: /\bPR\s+head\b/giu },
  { id: 'merge SHA evidence', pattern: /\bmerge\s+SHA\b/giu },
  { id: 'Pages deployment evidence', pattern: /\bPages\s+deployment\b/giu },
  { id: 'GitHub Actions run ID evidence', pattern: /\bGitHub\s+Actions\s+run\s+ID\s+\d+\b/giu },
  { id: 'CI run evidence', pattern: /\bCI(?:\s+run)?\s+\d{5,}\b/giu },
  { id: 'workflow run evidence', pattern: /\b(?:GitHub\s+)?(?:Actions|workflow)\s+run(?:\s+ID)?\s+\d{5,}\b/giu },
  { id: 'pages-build-deployment job ID evidence', pattern: /\bpages-build-deployment\s+\d+\b/giu },
  { id: 'squash merge SHA evidence', pattern: /\bsquash\s+merge\s+[0-9a-f]{40}\b/giu },
  { id: 'unresolved review thread evidence', pattern: /\bunresolved\s+(?:review\s+)?threads?\b/giu },
];

function stripHtmlComments(source) {
  const output = [];
  let fence = null;
  let inComment = false;

  for (const line of source.split(/(?<=\n)/u)) {
    const fenceMarker = !inComment && line.match(/^\s*(`{3,}|~{3,})/u);
    if (fenceMarker) {
      const marker = fenceMarker[1];
      if (fence === null) fence = { character: marker[0], length: marker.length };
      else if (marker[0] === fence.character && marker.length >= fence.length) fence = null;
      output.push(line);
      continue;
    }
    if (fence !== null) {
      output.push(line);
      continue;
    }

    let cursor = 0;
    let visible = '';
    while (cursor < line.length) {
      if (inComment) {
        const end = line.indexOf('-->', cursor);
        if (end < 0) {
          visible += line.slice(cursor).replace(/[^\n]/gu, ' ');
          cursor = line.length;
        } else {
          visible += line.slice(cursor, end + 3).replace(/[^\n]/gu, ' ');
          cursor = end + 3;
          inComment = false;
        }
      } else {
        const start = line.indexOf('<!--', cursor);
        if (start < 0) {
          visible += line.slice(cursor);
          cursor = line.length;
        } else {
          visible += line.slice(cursor, start);
          cursor = start;
          inComment = true;
        }
      }
    }
    output.push(visible);
  }
  return output.join('');
}

function lineNumberAt(source, offset) {
  return source.slice(0, offset).split('\n').length;
}

function scanEntries(entries) {
  const findings = [];
  for (const entry of entries) {
    const visible = stripHtmlComments(entry.source);
    for (const rule of forbidden) {
      const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
      for (const match of visible.matchAll(pattern)) {
        findings.push({
          path: entry.path,
          line: lineNumberAt(visible, match.index),
          rule: rule.id,
          value: match[0],
        });
      }
    }
  }
  return findings;
}

function collectFiles(directory, predicate) {
  const entries = [];
  const visit = (current) => {
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      if (item.name === '_site') continue;
      const absolute = path.join(current, item.name);
      if (item.isDirectory()) visit(absolute);
      else if (item.isFile() && predicate(absolute)) {
        entries.push({
          path: path.relative(root, absolute),
          source: fs.readFileSync(absolute, 'utf8'),
        });
      }
    }
  };
  visit(directory);
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

function collectReaderSources(directory) {
  const readerVisibleExtensions = new Set(['.html', '.md', '.yaml', '.yml']);
  return collectFiles(directory, (file) => readerVisibleExtensions.has(path.extname(file).toLowerCase()));
}

function blankPreservingNewlines(value) {
  return value.replace(/[^\n]/gu, ' ');
}

function decodeHtmlEntities(value) {
  const named = new Map([
    ['amp', '&'], ['apos', "'"], ['gt', '>'], ['lt', '<'], ['nbsp', ' '],
    ['num', '#'], ['quot', '"'],
  ]);
  return value.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/giu, (match, decimal, hex, name) => {
    if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    return named.get(name.toLowerCase()) ?? match;
  });
}

function replaceHtmlTags(source) {
  let output = '';
  let cursor = 0;
  while (cursor < source.length) {
    if (source[cursor] !== '<') {
      output += source[cursor];
      cursor += 1;
      continue;
    }

    let quote = null;
    let end = cursor + 1;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (quote !== null) {
        if (character === quote) quote = null;
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === '>') {
        break;
      }
    }
    if (end >= source.length) {
      output += source.slice(cursor);
      break;
    }

    const tag = source.slice(cursor, end + 1);
    const attributes = [...tag.matchAll(/\b(?:alt|aria-label|title)\s*=\s*(?:"([^"]*)"|'([^']*)')/giu)]
      .map((match) => match[1] ?? match[2] ?? '')
      .filter(Boolean);
    const newlines = tag.match(/\n/gu)?.length ?? 0;
    output += ` ${attributes.join(' ')} ${'\n'.repeat(newlines)}`;
    cursor = end + 1;
  }
  return output;
}

function readerVisibleHtml(source) {
  let visible = stripHtmlComments(source);
  visible = visible.replace(
    /<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/giu,
    (match) => blankPreservingNewlines(match),
  );
  visible = replaceHtmlTags(visible);
  return decodeHtmlEntities(visible);
}

function collectBuiltHtml(directory) {
  return collectFiles(directory, (file) => path.extname(file).toLowerCase() === '.html')
    .map((entry) => ({ ...entry, source: readerVisibleHtml(entry.source) }));
}

function readRequired(file, label, failures) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    failures.push(`${label} is missing: ${path.relative(root, file)}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function requireVisibleMarkers(source, label, markers, failures) {
  const visible = stripHtmlComments(source);
  for (const marker of markers) {
    if (!visible.includes(marker)) failures.push(`${label} is missing visible marker: ${marker}`);
  }
}

function parseStrictAndChain(command, label, failures) {
  if (/\|\||[;|]/u.test(command)) {
    failures.push(`${label} must use only a fail-closed && command chain`);
    return [];
  }
  return command.split(/\s*&&\s*/u).map((part) => part.trim()).filter(Boolean);
}

function checkWiring(packageSource, workflowSource, failures) {
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageSource);
  } catch (error) {
    failures.push(`package.json is invalid JSON: ${error.message}`);
    return;
  }

  const scripts = packageJson.scripts || {};
  const selfTest = 'node scripts/check-reader-maintainer-boundary.js --self-test';
  const check = 'node scripts/check-reader-maintainer-boundary.js';
  if (scripts['test:reader-maintainer-boundary'] !== selfTest) {
    failures.push('package script test:reader-maintainer-boundary is missing or changed');
  }
  if (scripts['check:reader-maintainer-boundary'] !== check) {
    failures.push('package script check:reader-maintainer-boundary is missing or changed');
  }

  const aggregate = parseStrictAndChain(scripts.test || '', 'scripts.test', failures);
  const expected = [
    'npm run test:reader-maintainer-boundary',
    'npm run check:reader-maintainer-boundary',
  ];
  const start = aggregate.indexOf(expected[0]);
  if (start < 0 || aggregate[start + 1] !== expected[1]) {
    failures.push('scripts.test must run boundary self-test and check once, in that order');
  }
  if (aggregate.filter((command) => expected.includes(command)).length !== expected.length) {
    failures.push('scripts.test must contain each boundary command exactly once');
  }

  const command = 'npm run test:reader-maintainer-boundary && npm run check:reader-maintainer-boundary';
  const activeWorkflow = workflowSource
    .split(/\r?\n/u)
    .filter((line) => !/^\s*#/u.test(line))
    .join('\n');
  if ((activeWorkflow.split(command).length - 1) !== 1) {
    failures.push('Book QA must contain exactly one active reader / maintainer boundary command');
  }
  const stepMatch = activeWorkflow.match(
    /- name: Reader \/ maintainer boundary contract\s*\n([\s\S]*?)(?=\n\s*- name:|$)/u,
  );
  if (!stepMatch) {
    failures.push('Book QA reader / maintainer boundary step is missing');
  } else {
    const runLines = stepMatch[1]
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => line.startsWith('run:'));
    if (runLines.length !== 1 || runLines[0] !== `run: ${command}`) {
      failures.push('Book QA boundary command must be one exact fail-closed run line');
    }
    if (/\bcontinue-on-error\s*:/u.test(stepMatch[1])) failures.push('Book QA boundary step must fail closed');
    if (/^\s*if\s*:/mu.test(stepMatch[1])) failures.push('Book QA boundary step must not be conditional');
  }

  const builtCommand = 'node scripts/check-reader-maintainer-boundary.js --built-site _site';
  if ((activeWorkflow.split(builtCommand).length - 1) !== 1) {
    failures.push('Book QA must contain exactly one active built-site boundary command');
  }
  const buildIndex = activeWorkflow.indexOf('- name: Build (Jekyll; GitHub Pages compatible)');
  const builtCheckIndex = activeWorkflow.indexOf(builtCommand);
  if (buildIndex < 0 || builtCheckIndex < buildIndex) {
    failures.push('Book QA built-site boundary command must run after the Jekyll build');
  }
  const builtStepMatch = activeWorkflow.match(
    /- name: Verify rendered reader \/ maintainer boundary\s*\n([\s\S]*?)(?=\n\s*- name:|$)/u,
  );
  if (!builtStepMatch) {
    failures.push('Book QA rendered reader / maintainer boundary step is missing');
  } else {
    const runLines = builtStepMatch[1]
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => line.startsWith('run:'));
    if (runLines.length !== 1 || runLines[0] !== `run: ${builtCommand}`) {
      failures.push('Book QA built-site boundary command must be one exact fail-closed run line');
    }
    if (/\bcontinue-on-error\s*:/u.test(builtStepMatch[1])) failures.push('Book QA built-site boundary step must fail closed');
    if (/^\s*if\s*:/mu.test(builtStepMatch[1])) failures.push('Book QA built-site boundary step must not be conditional');
  }
}

function runSelfTest() {
  const failures = [];
  for (const rule of forbidden) {
    const samples = {
      'raw Issue number': 'Issue #127 を完了する。',
      'raw PR number': 'PR #83 を確認する。',
      'internal Issue or PR URL': 'https://github.com/itdojp/ai-era-engineers-mind-book/pull/83',
      'portfolio sprint marker': 'portfolio-level sprint で追跡する。',
      'review-thread remediation evidence': 'review thread 対応を記録する。',
      'Book QA evidence': 'Book QA の結果を残す。',
      'Copilot review evidence': 'Copilot review を確認する。',
      'main merge commit evidence': 'main merge commit を記録する。',
      'PR head evidence': 'PR head で成功した。',
      'merge SHA evidence': 'merge SHA 6da2632 を確認した。',
      'Pages deployment evidence': 'Pages deployment 成功。',
      'GitHub Actions run ID evidence': 'GitHub Actions run ID 12345 で確認した。',
      'CI run evidence': 'CI 29708168790 で確認した。',
      'workflow run evidence': 'workflow run 29708168790 で確認した。',
      'pages-build-deployment job ID evidence': 'pages-build-deployment 29187595459 の結果を確認した。',
      'squash merge SHA evidence': 'squash merge 0123456789abcdef0123456789abcdef01234567 を確認した。',
      'unresolved review thread evidence': 'unresolved review thread が 0 だった。',
    };
    const findings = scanEntries([{ path: 'docs/test.md', source: samples[rule.id] }]);
    if (!findings.some((finding) => finding.rule === rule.id)) {
      failures.push(`self-test did not reject ${rule.id}`);
    }
  }

  for (const [source, expected] of [
    ['Issue 127 を確認した。', 'raw Issue number'],
    ['PR 83 を確認した。', 'raw PR number'],
    ['Actions run 29708168790 で確認した。', 'workflow run evidence'],
  ]) {
    const findings = scanEntries([{ path: 'docs/variant.md', source }]);
    if (!findings.some((finding) => finding.rule === expected)) {
      failures.push(`self-test did not reject phrase variant for ${expected}`);
    }
  }

  const hidden = scanEntries([{
    path: 'docs/comment.md',
    source: '<!-- Issue #127 / PR #83 / Book QA / main merge commit -->\n公開本文',
  }]);
  if (hidden.length !== 0) failures.push('self-test treated an HTML comment as reader-visible content');

  const fenced = scanEntries([{
    path: 'docs/fenced.md',
    source: '```text\nIssue #127\n```',
  }]);
  if (!fenced.some((finding) => finding.rule === 'raw Issue number')) {
    failures.push('self-test failed to reject a rendered fenced marker');
  }

  const fencedComment = scanEntries([{
    path: 'docs/fenced-comment.md',
    source: '```html\n<!-- Issue #127 / PR #83 / Book QA -->\n```',
  }]);
  for (const expected of ['raw Issue number', 'raw PR number', 'Book QA evidence']) {
    if (!fencedComment.some((finding) => finding.rule === expected)) {
      failures.push(`self-test failed to reject ${expected} inside a rendered fenced comment`);
    }
  }

  const nestedFencedComment = scanEntries([{
    path: 'docs/nested-fenced-comment.md',
    source: ['````html', '```html', '<!-- Issue #127 / PR #83 / Book QA -->', '```', '````'].join('\n'),
  }]);
  for (const expected of ['raw Issue number', 'raw PR number', 'Book QA evidence']) {
    if (!nestedFencedComment.some((finding) => finding.rule === expected)) {
      failures.push(`self-test closed a four-backtick fence with a shorter three-backtick fence before ${expected}`);
    }
  }

  const legitimateExamples = scanEntries([{
    path: 'docs/example.md',
    source: 'PR comment、review thread、CI logを成果物として扱う。GitHub Actions run、CI run、workflow run、pages-build-deployment ジョブ、squash merge abcdef1の手順を説明する。',
  }]);
  if (legitimateExamples.length !== 0) {
    failures.push('self-test rejected generic reader-facing delivery examples');
  }

  const renderedHtml = scanEntries([{
    path: '_site/test.html',
    source: readerVisibleHtml('<nav title="Issue &#35;127">PR &#x23;83</nav><script>Issue #999</script>'),
  }]);
  for (const expected of ['raw Issue number', 'raw PR number']) {
    if (!renderedHtml.some((finding) => finding.rule === expected)) {
      failures.push(`self-test failed to reject rendered HTML ${expected}`);
    }
  }
  if (renderedHtml.some((finding) => finding.value.includes('999'))) {
    failures.push('self-test treated script content as reader-visible evidence');
  }

  const quotedGreaterThan = scanEntries([{
    path: '_site/attribute.html',
    source: readerVisibleHtml('<span title="Issue &#35;127>">reader text</span>'),
  }]);
  if (!quotedGreaterThan.some((finding) => finding.rule === 'raw Issue number')) {
    failures.push('self-test truncated a quoted attribute at a literal greater-than sign');
  }

  const packageFixture = JSON.stringify({
    scripts: {
      test: 'npm run lint && npm run test:reader-maintainer-boundary && npm run check:reader-maintainer-boundary && npm run check-links',
      'test:reader-maintainer-boundary': 'node scripts/check-reader-maintainer-boundary.js --self-test',
      'check:reader-maintainer-boundary': 'node scripts/check-reader-maintainer-boundary.js',
    },
  });
  const workflowFixture = [
    '- name: Reader / maintainer boundary contract',
    '  run: npm run test:reader-maintainer-boundary && npm run check:reader-maintainer-boundary',
    '- name: Build (Jekyll; GitHub Pages compatible)',
    '  run: bundle exec jekyll build',
    '- name: Verify rendered reader / maintainer boundary',
    '  run: node scripts/check-reader-maintainer-boundary.js --built-site _site',
    '- name: Next step',
    '  run: echo ok',
  ].join('\n');
  const baselineWiring = [];
  checkWiring(packageFixture, workflowFixture, baselineWiring);
  if (baselineWiring.length !== 0) failures.push(`self-test baseline wiring failed: ${baselineWiring.join('; ')}`);

  const wiringMutations = [
    workflowFixture.replace('boundary\n', 'boundary\n  if: always()\n'),
    workflowFixture.replace('boundary\n', 'boundary\n  continue-on-error: true\n'),
    workflowFixture.replace('boundary\n', 'boundary || true\n'),
    workflowFixture.replace('node scripts/check-reader-maintainer-boundary.js --built-site _site', 'echo skipped'),
    workflowFixture.replace(
      'Verify rendered reader / maintainer boundary\n',
      'Verify rendered reader / maintainer boundary\n  continue-on-error: true\n',
    ),
  ];
  for (const [index, mutatedWorkflow] of wiringMutations.entries()) {
    const mutationFailures = [];
    checkWiring(packageFixture, mutatedWorkflow, mutationFailures);
    if (mutationFailures.length === 0) failures.push(`self-test accepted workflow mutation ${index + 1}`);
  }

  const missingAggregate = JSON.parse(packageFixture);
  missingAggregate.scripts.test = missingAggregate.scripts.test
    .replace('npm run test:reader-maintainer-boundary && ', '');
  const aggregateFailures = [];
  checkWiring(JSON.stringify(missingAggregate), workflowFixture, aggregateFailures);
  if (aggregateFailures.length === 0) failures.push('self-test accepted missing aggregate command');

  if (failures.length > 0) {
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    process.exit(1);
  }
  console.log(`OK: reader / maintainer boundary self-test (${forbidden.length + 8} content cases, 6 wiring negatives)`);
}

function runSourceCheck() {
  const failures = [];
  const entries = collectReaderSources(docsRoot);
  for (const finding of scanEntries(entries)) {
    failures.push(`${finding.path}:${finding.line}: ${finding.rule}: ${finding.value}`);
  }

  const appendix = readRequired(appendixPath, 'reader-facing Appendix D', failures);
  const runbook = readRequired(runbookPath, 'maintainer runbook', failures);
  const packageSource = readRequired(packagePath, 'package.json', failures);
  const workflowSource = readRequired(workflowPath, 'Book QA workflow', failures);

  requireVisibleMarkers(appendix, 'reader-facing Appendix D', [
    'この付録は**読者向け**です。',
    '確認日',
    '対象バージョン',
    '正本',
    '適用範囲',
    '再確認条件',
    '### 記録例（架空）',
    '架空の Example API v3.2',
    '読者がその手順を実行する必要はありません。',
    'MAINTENANCE.md',
  ], failures);
  requireVisibleMarkers(runbook, 'maintainer runbook', [
    'この文書は、本書の本文、品質ゲート、GitHub Pages公開を変更する**保守者向け**です。',
    '`docs/`',
    '公開サイトの対象外',
    'Issue #127',
    'PR #83',
    'review thread',
    'Book QA',
    'main merge commit',
    'merge SHA',
    'Pages deployment',
    'GitHub Actions run ID',
  ], failures);

  checkWiring(packageSource, workflowSource, failures);

  if (failures.length > 0) {
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    process.exit(1);
  }
  console.log(`OK: ${entries.length} public reader-source files keep reader and maintainer information separated`);
}

function runBuiltCheck(directory) {
  const failures = [];
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    failures.push(`built site directory is missing: ${path.relative(root, directory)}`);
  } else {
    const entries = collectBuiltHtml(directory);
    if (entries.length === 0) failures.push(`built site contains no HTML files: ${path.relative(root, directory)}`);
    for (const finding of scanEntries(entries)) {
      failures.push(`${finding.path}:${finding.line}: ${finding.rule}: ${finding.value}`);
    }
    if (failures.length === 0) {
      console.log(`OK: ${entries.length} rendered HTML files keep reader and maintainer information separated`);
      return;
    }
  }
  for (const failure of failures) console.error(`ERROR: ${failure}`);
  process.exit(1);
}

const builtSiteIndex = process.argv.indexOf('--built-site');
if (process.argv.includes('--self-test')) runSelfTest();
else if (builtSiteIndex >= 0) {
  const requestedPath = process.argv[builtSiteIndex + 1];
  if (!requestedPath) {
    console.error('ERROR: --built-site requires a directory path');
    process.exit(1);
  }
  runBuiltCheck(path.resolve(root, requestedPath));
} else runSourceCheck();
