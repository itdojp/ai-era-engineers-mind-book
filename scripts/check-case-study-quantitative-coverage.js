#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const caseStudyPath = path.join(root, 'docs', 'appendices', 'case-studies.md');
const packagePath = path.join(root, 'package.json');
const workflowPath = path.join(root, '.github', 'workflows', 'book-qa.yml');

const CLASSIFICATIONS = ['仮定値', '目標例', '実測例', '外部benchmark'];
const SOURCE_REQUIRED_MARKERS = [
  ['架空モデルケース宣言', /架空モデルケース/u],
  ['4区分の導入', /数値の由来と用途を次の4区分/u],
  ['仮定値の定義', /\|\s*\*\*仮定値\*\*\s*\|/u],
  ['目標例の定義', /\|\s*\*\*目標例\*\*\s*\|/u],
  ['実測例の定義', /\|\s*\*\*実測例\*\*\s*\|/u],
  ['外部benchmarkの定義', /\|\s*\*\*外部benchmark\*\*\s*\|/u],
  ['現在の採用状況', /現在の採用状況/u],
  ['実測例0件', /実測例は0件/u],
  ['外部benchmark 0件', /外部benchmarkは0件/u],
  ['未出典値の転用禁止', /業界標準として転用してはならない/u],
  ['数値なし凡例', /数値を含まない行は、数値区分を/u],
  ['測定テンプレート', /自組織データへ差し替える測定テンプレート/u],
  ['測定テンプレート記入例', /測定テンプレートの記入例/u],
  ['母数', /母数 \/ 対象範囲/u],
  ['測定期間', /測定期間 \/ baseline/u],
  ['計算式', /\|\s*計算式\s*\|/u],
  ['guardrail', /\|\s*guardrail\s*\|/u],
  ['解釈上の注意', /解釈上の注意 \/ 適用条件/u],
  ['owner', /owner \/ 確認日/u],
];
const BUILT_REQUIRED_MARKERS = SOURCE_REQUIRED_MARKERS.map(([name, pattern]) => [name, pattern])
  .map(([name]) => {
    const text = new Map([
      ['架空モデルケース宣言', '架空モデルケース'],
      ['4区分の導入', '数値の由来と用途を次の4区分'],
      ['仮定値の定義', '仮定値'],
      ['目標例の定義', '目標例'],
      ['実測例の定義', '実測例'],
      ['外部benchmarkの定義', '外部benchmark'],
      ['現在の採用状況', '現在の採用状況'],
      ['実測例0件', '実測例は0件'],
      ['外部benchmark 0件', '外部benchmarkは0件'],
      ['未出典値の転用禁止', '業界標準として転用してはならない'],
      ['数値なし凡例', '数値を含まない行は、数値区分を'],
      ['測定テンプレート', '自組織データへ差し替える測定テンプレート'],
      ['測定テンプレート記入例', '測定テンプレートの記入例'],
      ['母数', '母数 / 対象範囲'],
      ['測定期間', '測定期間 / baseline'],
      ['計算式', '計算式'],
      ['guardrail', 'guardrail'],
      ['解釈上の注意', '解釈上の注意 / 適用条件'],
      ['owner', 'owner / 確認日'],
    ]).get(name);
    return [name, text];
  });

const UNIT_VALUE = /\d[\d,]*(?:\.\d+)?(?:\s*(?:〜|～|→|から|-)\s*\d[\d,]*(?:\.\d+)?)?\s*(?:%|％|名|件|ページ|質問|週間|週|日|時間|分|秒|ms|時|月|年|回|倍|ファイル)/u;
const CLOCK_RANGE = /(?:^|[^\d])\d{1,2}:\d{2}(?:\s*[-〜～]\s*\d{1,2}:\d{2})?(?!\d)/u;
const ISO_DATE = /(?:^|[^\d])\d{4}-\d{2}-\d{2}(?!\d)/u;
const BARE_NUMBER = /(?:^|[^A-Za-z0-9_])(?:N\s*=\s*)?(?:\d+(?:,\d{3})*(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?(?![A-Za-z0-9_])/u;

const SELF_TEST_SCRIPT = 'node scripts/check-case-study-quantitative-coverage.js --self-test';
const CHECK_SCRIPT = 'node scripts/check-case-study-quantitative-coverage.js';
const BUILT_SCRIPT = 'node scripts/check-case-study-quantitative-coverage.js --built-site docs/_site';
const SELF_TEST_COMMAND = 'npm run test:case-study-quantitative-coverage';
const CHECK_COMMAND = 'npm run check:case-study-quantitative-coverage';
const SOURCE_WORKFLOW_COMMAND = `${SELF_TEST_COMMAND} && ${CHECK_COMMAND}`;
const SOURCE_WORKFLOW_STEP = 'Case-study quantitative coverage contract';
const BUILT_WORKFLOW_COMMAND = 'node scripts/check-case-study-quantitative-coverage.js --built-site _site';
const BUILT_WORKFLOW_STEP = 'Verify rendered case-study quantitative coverage';
const BUILD_STEP = 'Build (Jekyll; GitHub Pages compatible)';

function blankPreservingNewlines(value) {
  return value.replace(/[^\n]/gu, ' ');
}

function maskClassifications(value) {
  const pattern = new RegExp(CLASSIFICATIONS.join('|'), 'gu');
  return value.replace(pattern, (match) => ' '.repeat(match.length));
}

// Decode each semantic HTML code/pre text node exactly once, then keep it out of
// subsequent document-level entity decoding. This preserves quantitative values
// readers can see in code while preventing code-only labels (including encoded
// labels) from satisfying the prose/table classification contract.
function protectHtmlCodeContents(value) {
  const replacements = [];
  const protectedValue = value.replace(
    /<(code|pre)\b[^>]*>([\s\S]*?)<\/\1\s*>/giu,
    (_match, _tag, content) => {
      const token = `\uE000CASESTUDYCODE${replacements.length}\uE001`;
      let visibleContent = content.replace(/<[^>]+>/gu, (tag) => blankPreservingNewlines(tag));
      visibleContent = decodeHtmlEntities(visibleContent);
      visibleContent = maskClassifications(visibleContent);
      replacements.push([token, visibleContent]);
      return token;
    },
  );
  return {
    value: protectedValue,
    restore(target) {
      return replacements.reduce((output, [token, content]) => output.replaceAll(token, content), target);
    },
  };
}

// Preserve quantitative values in reader-visible code, but do not accept a classification label
// whose only occurrence is code syntax rather than prose/table metadata.
function maskSourceCodeClassifications(source) {
  const output = [];
  let fence = null;
  let inlineCodeTicks = null;
  for (const line of source.split(/(?<=\n)/u)) {
    if (fence !== null) {
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*(?:\r?\n)?$/u);
      const masked = maskClassifications(line);
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) fence = null;
      output.push(masked);
      continue;
    }
    if (inlineCodeTicks === null) {
      const opening = line.match(/^ {0,3}(`{3,}|~{3,})([^\r\n]*)(?:\r?\n)?$/u);
      if (opening && (opening[1][0] !== '`' || !opening[2].includes('`'))) {
        fence = { character: opening[1][0], length: opening[1].length };
        output.push(maskClassifications(line));
        continue;
      }
    }
    let cursor = 0;
    let masked = '';
    while (cursor < line.length) {
      if (line[cursor] === '`') {
        let end = cursor + 1;
        while (line[end] === '`') end += 1;
        const ticks = end - cursor;
        masked += line.slice(cursor, end);
        if (inlineCodeTicks === null) inlineCodeTicks = ticks;
        else if (ticks === inlineCodeTicks) inlineCodeTicks = null;
        cursor = end;
      } else if (inlineCodeTicks !== null) {
        const classification = CLASSIFICATIONS.find((item) => line.startsWith(item, cursor));
        if (classification) {
          masked += ' '.repeat(classification.length);
          cursor += classification.length;
        } else {
          masked += line[cursor];
          cursor += 1;
        }
      } else {
        masked += line[cursor];
        cursor += 1;
      }
    }
    output.push(masked);
  }
  return output.join('');
}

// Preserve fenced and inline-code content because readers see it, but blank real HTML comments.
function stripHtmlComments(source) {
  const output = [];
  let fence = null;
  let inComment = false;
  let inlineCodeTicks = null;
  for (const line of source.split(/(?<=\n)/u)) {
    if (fence !== null) {
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*(?:\r?\n)?$/u);
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) fence = null;
      output.push(line);
      continue;
    }
    if (!inComment && inlineCodeTicks === null) {
      const opening = line.match(/^ {0,3}(`{3,}|~{3,})([^\r\n]*)(?:\r?\n)?$/u);
      if (opening && (opening[1][0] !== '`' || !opening[2].includes('`'))) {
        fence = { character: opening[1][0], length: opening[1].length };
        output.push(line);
        continue;
      }
    }
    let cursor = 0;
    let visible = '';
    while (cursor < line.length) {
      if (inComment) {
        const end = line.indexOf('-->', cursor);
        if (end < 0) {
          visible += blankPreservingNewlines(line.slice(cursor));
          cursor = line.length;
        } else {
          visible += blankPreservingNewlines(line.slice(cursor, end + 3));
          cursor = end + 3;
          inComment = false;
        }
      } else if (line[cursor] === '`') {
        let end = cursor + 1;
        while (line[end] === '`') end += 1;
        const ticks = end - cursor;
        visible += line.slice(cursor, end);
        if (inlineCodeTicks === null) inlineCodeTicks = ticks;
        else if (ticks === inlineCodeTicks) inlineCodeTicks = null;
        cursor = end;
      } else if (inlineCodeTicks !== null) {
        visible += line[cursor];
        cursor += 1;
      } else if (line.startsWith('<!--', cursor)) {
        inComment = true;
      } else {
        visible += line[cursor];
        cursor += 1;
      }
    }
    output.push(visible);
  }
  return output.join('');
}

// Policy markers must be prose/table contract, not illustrative code.
function stripFencedCode(source) {
  let fence = null;
  return source.split(/(?<=\n)/u).map((line) => {
    if (fence !== null) {
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*(?:\r?\n)?$/u);
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) fence = null;
      return blankPreservingNewlines(line);
    }
    const opening = line.match(/^ {0,3}(`{3,}|~{3,})([^\r\n]*)(?:\r?\n)?$/u);
    if (opening && (opening[1][0] !== '`' || !opening[2].includes('`'))) {
      fence = { character: opening[1][0], length: opening[1].length };
      return blankPreservingNewlines(line);
    }
    return line;
  }).join('');
}

function stripClosedCodeSpans(source) {
  let output = '';
  let cursor = 0;
  while (cursor < source.length) {
    if (source[cursor] !== '`') {
      output += source[cursor];
      cursor += 1;
      continue;
    }
    let markerEnd = cursor + 1;
    while (source[markerEnd] === '`') markerEnd += 1;
    const marker = source.slice(cursor, markerEnd);
    let search = markerEnd;
    let closing = -1;
    while ((search = source.indexOf(marker, search)) >= 0) {
      const before = source[search - 1];
      const after = source[search + marker.length];
      if (before !== '`' && after !== '`') {
        closing = search;
        break;
      }
      search += marker.length;
    }
    if (closing < 0) {
      output += marker;
      cursor = markerEnd;
      continue;
    }
    const span = source.slice(cursor, closing + marker.length);
    output += blankPreservingNewlines(span);
    cursor = closing + marker.length;
  }
  return output;
}

function policyVisibleSource(source) {
  let visible = stripHtmlComments(source);
  visible = visible.replace(
    /<(code|pre)\b[^>]*>[\s\S]*?<\/\1\s*>/giu,
    (match) => blankPreservingNewlines(match),
  );
  visible = decodeHtmlEntities(visible);
  visible = stripClosedCodeSpans(stripFencedCode(visible));
  return visible.replace(/<[^>]+>/gu, (match) => blankPreservingNewlines(match));
}

function sourceQuantitativeText(source) {
  let visible = stripHtmlComments(source);
  const protectedCode = protectHtmlCodeContents(visible);
  visible = protectedCode.value;
  visible = decodeHtmlEntities(visible);
  visible = maskSourceCodeClassifications(visible);
  visible = visible.replace(/<[^>]+>/gu, (match) => blankPreservingNewlines(match));
  return protectedCode.restore(visible);
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

function readerArticleText(htmlSource, failures, label, policyMode = false) {
  const article = htmlSource.match(/<article\b[^>]*>([\s\S]*?)<\/article\s*>/iu);
  if (!article) {
    failures.push(`${label}: rendered article element is missing`);
    return '';
  }
  let visible = stripHtmlComments(article[1]);
  visible = visible.replace(
    /<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/giu,
    (match) => blankPreservingNewlines(match),
  );
  let protectedCode = null;
  if (policyMode) {
    visible = visible.replace(
      /<(code|pre)\b[^>]*>[\s\S]*?<\/\1\s*>/giu,
      (match) => blankPreservingNewlines(match),
    );
  } else {
    protectedCode = protectHtmlCodeContents(visible);
    visible = protectedCode.value;
  }
  visible = visible.replace(
    /<(tr|p|li|h[1-6])\b[^>]*>([\s\S]*?)<\/\1\s*>/giu,
    (_match, _tag, content) => `\n${content.replace(/\s+/gu, ' ')}\n`,
  );
  visible = visible.replace(/<br\s*\/?>|<\/(?:section|div)\s*>/giu, '\n');
  visible = visible.replace(/<[^>]+>/gu, ' ');
  visible = decodeHtmlEntities(visible);
  if (protectedCode) visible = protectedCode.restore(visible);
  return visible
    .split(/\r?\n/u)
    .map((line) => line.replace(/\s+/gu, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

function removeStructuralNumbers(line) {
  let scan = line;
  scan = scan.replace(/https?:\/\/\S+/giu, ' ');
  scan = scan.replace(/\[[^\]]*\]\([^)]*\)/gu, ' ');
  scan = scan.replace(/\bB(?:\.\d+)+\b/gu, ' ');
  scan = scan.replace(/\bP\d+(?:\s*\/\s*P\d+)*\b/giu, ' ');
  scan = scan.replace(/\bB2B\b/giu, ' ');
  scan = scan.replace(/\/v\d+(?:\/[\w.-]+)*/giu, ' ');
  scan = scan.replace(/\bp\d{2}\b/giu, ' ');
  scan = scan.replace(/(?:第|付録)\d+(?:章)?/gu, ' ');
  scan = scan.replace(/\d+(?:つ|区分|ケース|ステップ)(?:の)?/gu, ' ');
  scan = scan.replace(/^\s*\d+\.\s+/u, ' ');
  return scan;
}

function quantitativeMatch(line) {
  if (UNIT_VALUE.test(line) || CLOCK_RANGE.test(line) || ISO_DATE.test(line)) return true;
  return BARE_NUMBER.test(removeStructuralNumbers(line));
}

function categoryMatches(line) {
  return CLASSIFICATIONS.filter((classification) => line.includes(classification));
}

function requireSourceMarkers(source, fileName, failures) {
  const visiblePolicy = policyVisibleSource(source);
  for (const [name, pattern] of SOURCE_REQUIRED_MARKERS) {
    if (!pattern.test(visiblePolicy)) failures.push(`${fileName}: visible policy marker is missing: ${name}`);
  }
}

function requireBuiltMarkers(source, fileName, failures) {
  for (const [name, marker] of BUILT_REQUIRED_MARKERS) {
    if (!source.includes(marker)) failures.push(`${fileName}: rendered policy marker is missing: ${name}`);
  }
}

function analyzeQuantitativeLines(source, fileName) {
  const failures = [];
  const stats = Object.fromEntries(CLASSIFICATIONS.map((key) => [key, 0]));
  let quantitativeLines = 0;
  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (!quantitativeMatch(line)) continue;
    quantitativeLines += 1;
    const zeroStatus = line.includes('実測例は0件') && line.includes('外部benchmarkは0件');
    const categories = categoryMatches(line);
    if (categories.length === 0) {
      failures.push(`${fileName}:${index + 1}: quantitative value lacks a reader-visible classification: ${line.trim()}`);
      continue;
    }
    if (!zeroStatus && categories.length !== 1) {
      failures.push(`${fileName}:${index + 1}: quantitative value must have exactly one classification: ${categories.join(', ')}`);
      continue;
    }
    if (zeroStatus) continue;
    const classification = categories[0];
    stats[classification] += 1;
    if (classification === '実測例') {
      for (const detail of ['母数=', '測定期間=', '計算式=', 'データ源=']) {
        if (!line.includes(detail)) failures.push(`${fileName}:${index + 1}: 実測例 requires ${detail}`);
      }
    }
    if (classification === '外部benchmark') {
      if (!/https:\/\/\S+/u.test(line)) failures.push(`${fileName}:${index + 1}: 外部benchmark requires a visible HTTPS primary-source URL`);
      if (!line.includes('適用条件=')) failures.push(`${fileName}:${index + 1}: 外部benchmark requires 適用条件=`);
    }
  }
  if (quantitativeLines === 0) failures.push(`${fileName}: no quantitative values were detected`);
  return { failures, quantitativeLines, stats };
}

function analyzeSource(source, fileName = 'docs/appendices/case-studies.md') {
  const visible = sourceQuantitativeText(source);
  const result = analyzeQuantitativeLines(visible, fileName);
  requireSourceMarkers(source, fileName, result.failures);
  return result;
}

function analyzeBuiltHtml(htmlSource, fileName = 'built case-study HTML') {
  const failures = [];
  const visibleQuantitative = readerArticleText(htmlSource, failures, fileName, false);
  const visiblePolicy = readerArticleText(htmlSource, failures, fileName, true);
  const result = analyzeQuantitativeLines(visibleQuantitative, fileName);
  failures.push(...result.failures);
  requireBuiltMarkers(visiblePolicy, fileName, failures);
  return { failures, quantitativeLines: result.quantitativeLines, stats: result.stats };
}

function parseStrictAndChain(command, label, failures) {
  const withoutAndAnd = command.replaceAll('&&', '');
  if (/[;&|]/u.test(withoutAndAnd)) {
    failures.push(`${label} must use only a fail-closed && command chain`);
    return [];
  }
  const parts = command.split(/\s*&&\s*/u).map((part) => part.trim());
  if (parts.length === 0 || parts.some((part) => part.length === 0)) {
    failures.push(`${label} contains an empty command`);
    return [];
  }
  return parts;
}

function exactFailClosedStep(activeWorkflow, name, command, failures, label) {
  if ((activeWorkflow.split(command).length - 1) !== 1) failures.push(`Book QA must contain exactly one active ${label} command`);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const step = activeWorkflow.match(new RegExp(`- name: ${escaped}\\s*\\n([\\s\\S]*?)(?=\\n\\s*- name:|$)`, 'u'));
  if (!step) {
    failures.push(`Book QA ${label} step is missing`);
    return;
  }
  const runLines = step[1].split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.startsWith('run:'));
  if (runLines.length !== 1 || runLines[0] !== `run: ${command}`) failures.push(`Book QA ${label} command must be one exact fail-closed run line`);
  if (/\bcontinue-on-error\s*:/u.test(step[1])) failures.push(`Book QA ${label} step must fail closed`);
  if (/^\s*if\s*:/mu.test(step[1])) failures.push(`Book QA ${label} step must not be conditional`);
}

function checkWiring(packageSource, workflowSource) {
  const failures = [];
  let packageJson;
  try {
    packageJson = JSON.parse(packageSource);
  } catch (error) {
    return [`package.json is invalid JSON: ${error.message}`];
  }
  const scripts = packageJson.scripts || {};
  for (const [name, expected] of [
    ['test:case-study-quantitative-coverage', SELF_TEST_SCRIPT],
    ['check:case-study-quantitative-coverage', CHECK_SCRIPT],
    ['check:case-study-quantitative-coverage:built', BUILT_SCRIPT],
  ]) {
    if (scripts[name] !== expected) failures.push(`package script ${name} is missing or changed`);
  }
  const aggregate = parseStrictAndChain(scripts.test || '', 'scripts.test', failures);
  const start = aggregate.indexOf(SELF_TEST_COMMAND);
  if (start < 0 || aggregate[start + 1] !== CHECK_COMMAND) failures.push('scripts.test must run the quantitative self-test and source check once, in that order');
  if (aggregate.filter((command) => command === SELF_TEST_COMMAND).length !== 1
      || aggregate.filter((command) => command === CHECK_COMMAND).length !== 1) {
    failures.push('scripts.test must contain each quantitative source command exactly once');
  }
  const activeWorkflow = workflowSource.split(/\r?\n/u).filter((line) => !/^\s*#/u.test(line)).join('\n');
  exactFailClosedStep(activeWorkflow, SOURCE_WORKFLOW_STEP, SOURCE_WORKFLOW_COMMAND, failures, 'quantitative source coverage');
  exactFailClosedStep(activeWorkflow, BUILT_WORKFLOW_STEP, BUILT_WORKFLOW_COMMAND, failures, 'rendered quantitative coverage');
  const buildIndex = activeWorkflow.indexOf(`- name: ${BUILD_STEP}`);
  const builtIndex = activeWorkflow.indexOf(`- name: ${BUILT_WORKFLOW_STEP}`);
  if (buildIndex < 0 || builtIndex < buildIndex) failures.push('Book QA rendered quantitative coverage must run after the Jekyll build');
  return failures;
}

function sourceFixture(valueLine = '| latency | 500ms以下 | 目標例 | 自組織で再設定 |') {
  return [
    '# 付録B',
    'この付録は架空モデルケースである。',
    '本付録では、数値の由来と用途を次の4区分で表示する。',
    '| **仮定値** | 架空値 |',
    '| **目標例** | 目標 |',
    '| **実測例** | 測定 |',
    '| **外部benchmark** | 外部値 |',
    '現在の採用状況: 実測例は0件、外部benchmarkは0件。業界標準として転用してはならない。数値を含まない行は、数値区分を—とする。',
    '## 自組織データへ差し替える測定テンプレート',
    '### 測定テンプレートの記入例',
    '| 母数 / 対象範囲 | 分母 |',
    '| 測定期間 / baseline | 期間 |',
    '| 計算式 | 式 |',
    '| guardrail | 安全指標 |',
    '| 解釈上の注意 / 適用条件 | 注意 |',
    '| owner / 確認日 | 担当 |',
    valueLine,
  ].join('\n');
}

function builtFixture(valueRow = '<tr><td>latency</td><td>500ms以下</td><td>目標例</td></tr>') {
  return [
    '<html><body><nav>第1章</nav><article class="page-content">',
    '<p>この付録は架空モデルケースである。</p>',
    '<p>数値の由来と用途を次の4区分で表示する。</p>',
    '<table><tr><td>仮定値</td><td>目標例</td><td>実測例</td><td>外部benchmark</td></tr></table>',
    '<p>現在の採用状況: 実測例は0件、外部benchmarkは0件。業界標準として転用してはならない。数値を含まない行は、数値区分を—とする。</p>',
    '<h2>自組織データへ差し替える測定テンプレート</h2>',
    '<h3>測定テンプレートの記入例</h3>',
    '<table><tr><td>母数 / 対象範囲</td><td>測定期間 / baseline</td><td>計算式</td><td>guardrail</td><td>解釈上の注意 / 適用条件</td><td>owner / 確認日</td></tr>',
    valueRow,
    '</table></article></body></html>',
  ].join('');
}

function wiringFixture() {
  const packageJson = JSON.stringify({ scripts: {
    test: `npm run lint && ${SELF_TEST_COMMAND} && ${CHECK_COMMAND} && npm run check-links`,
    'test:case-study-quantitative-coverage': SELF_TEST_SCRIPT,
    'check:case-study-quantitative-coverage': CHECK_SCRIPT,
    'check:case-study-quantitative-coverage:built': BUILT_SCRIPT,
  } });
  const workflow = [
    `- name: ${SOURCE_WORKFLOW_STEP}`,
    `  run: ${SOURCE_WORKFLOW_COMMAND}`,
    `- name: ${BUILD_STEP}`,
    '  run: bundle exec jekyll build',
    `- name: ${BUILT_WORKFLOW_STEP}`,
    `  run: ${BUILT_WORKFLOW_COMMAND}`,
    '- name: Next',
    '  run: echo ok',
  ].join('\n');
  return { packageJson, workflow };
}

function runSelfTest() {
  const failures = [];
  const positive = analyzeSource(sourceFixture(), 'positive.md');
  if (positive.failures.length > 0) failures.push(`source positive failed: ${positive.failures.join('; ')}`);
  const contentNegatives = [
    ['unclassified unit', sourceFixture('| latency | 500ms以下 | — |')],
    ['missing required marker', sourceFixture().replace('| owner / 確認日 | 担当 |\n', '')],
    ['comment-only classification', sourceFixture('| latency | 500ms | <!-- 目標例 --> |')],
    ['inline-code classification', sourceFixture('| latency | 500ms | `目標例` |')],
    ['fenced-code classification', sourceFixture('```text\n500ms 目標例\n```')],
    ['comment-only policy', sourceFixture().replace('| **仮定値** | 架空値 |', '<!-- | **仮定値** | 架空値 | -->')],
    ['fenced policy', sourceFixture().replace('| **仮定値** | 架空値 |', '```text\n| **仮定値** | 架空値 |\n```')],
    ['unsubstantiated measured', sourceFixture('| latency | 500ms | 実測例 |')],
    ['unsubstantiated external', sourceFixture('| latency | 500ms | 外部benchmark |')],
    ['clock', sourceFixture('平日9:00-20:00に利用する。')],
    ['date', sourceFixture('更新日は2026-07-20である。')],
    ['bare decimal', sourceFixture('| accuracy | 0.91 | — |')],
    ['bare integer', sourceFixture('| sample | N=1200 | — |')],
    ['scientific notation', sourceFixture('| error | 1e-3 | — |')],
    ['Japanese-adjacent decimal', sourceFixture('精度0.91を採用する。')],
    ['Japanese-adjacent integer', sourceFixture('閾値1200を採用する。')],
    ['Japanese-adjacent scientific notation', sourceFixture('誤差1e-3以下を採用する。')],
    ['HTML entity code classification', sourceFixture('| accuracy | 0.91 | <code data-label="目標例">&#x76ee;&#x6a19;&#x4f8b;</code> |')],
    ['double HTML entity code classification', sourceFixture('| accuracy | 0.91 | <code>&amp;#x76ee;&amp;#x6a19;&amp;#x4f8b;</code> |')],
    ['escaped angle-bracket number in code', sourceFixture('| threshold | <code>&lt;1&gt;</code> | — |')],
  ];
  for (const [name, source] of contentNegatives) {
    if (analyzeSource(source, `${name}.md`).failures.length === 0) failures.push(`source self-test accepted ${name}`);
  }
  for (const [name, source] of [
    ['measured', sourceFixture('| latency | 500ms | 実測例 | 母数=1,000件、測定期間=30日、計算式=p95、データ源=monitor |')],
    ['external', sourceFixture('| latency | 500ms | 外部benchmark | https://example.org/primary 適用条件=同一version |')],
  ]) {
    const result = analyzeSource(source, `${name}.md`);
    if (result.failures.length > 0) failures.push(`${name} source positive failed: ${result.failures.join('; ')}`);
  }

  const builtPositive = analyzeBuiltHtml(builtFixture(), 'positive.html');
  if (builtPositive.failures.length > 0) failures.push(`built positive failed: ${builtPositive.failures.join('; ')}`);
  const builtNegatives = [
    builtFixture('<tr><td>latency</td><td>500ms</td><td>—</td></tr>'),
    builtFixture('<tr><td>latency</td><td>500ms</td><td><!-- 目標例 --></td></tr>'),
    builtFixture('<tr><td>latency</td><td>500ms</td><td><code>目標例</code></td></tr>'),
    builtFixture('<tr><td>latency</td><td>500ms</td><td><pre>目標例</pre></td></tr>'),
    builtFixture('<tr><td>精度0.91を採用する。</td><td>—</td></tr>'),
    builtFixture('<tr><td>閾値1200を採用する。</td><td>—</td></tr>'),
    builtFixture('<tr><td>誤差1e-3以下を採用する。</td><td>—</td></tr>'),
    builtFixture('<tr><td>accuracy</td><td>0.91</td><td><code data-label="目標例">&#x76ee;&#x6a19;&#x4f8b;</code></td></tr>'),
    builtFixture('<tr><td>accuracy</td><td>0.91</td><td><code>&amp;#x76ee;&amp;#x6a19;&amp;#x4f8b;</code></td></tr>'),
    builtFixture('<tr><td>threshold</td><td><code>&lt;1&gt;</code></td><td>—</td></tr>'),
    builtFixture().replace('<h3>測定テンプレートの記入例</h3>', '<pre>測定テンプレートの記入例</pre>'),
    builtFixture().replace('測定テンプレートの記入例', ''),
  ];
  for (const [index, html] of builtNegatives.entries()) {
    if (analyzeBuiltHtml(html, `built-negative-${index + 1}.html`).failures.length === 0) failures.push(`built self-test accepted mutation ${index + 1}`);
  }

  const { packageJson, workflow } = wiringFixture();
  if (checkWiring(packageJson, workflow).length > 0) failures.push('wiring positive fixture failed');
  const wiringNegatives = [
    [JSON.stringify({ scripts: { test: `${SELF_TEST_COMMAND} && ${CHECK_COMMAND}` } }), workflow],
    [packageJson.replace(' && ', ' & '), workflow],
    [packageJson.replace(`${SELF_TEST_COMMAND} && ${CHECK_COMMAND}`, `${CHECK_COMMAND} && ${SELF_TEST_COMMAND}`), workflow],
    [packageJson, workflow.replace(`- name: ${SOURCE_WORKFLOW_STEP}\n`, `- name: ${SOURCE_WORKFLOW_STEP}\n  if: always()\n`)],
    [packageJson, workflow.replace(`- name: ${BUILT_WORKFLOW_STEP}\n`, `- name: ${BUILT_WORKFLOW_STEP}\n  continue-on-error: true\n`)],
    [packageJson, workflow.replace(BUILT_WORKFLOW_COMMAND, `${BUILT_WORKFLOW_COMMAND} || true`)],
    [packageJson, workflow.replace(`- name: ${BUILT_WORKFLOW_STEP}`, '- name: Removed rendered gate')],
    [packageJson, workflow.replace(`- name: ${BUILD_STEP}`, '- name: Build renamed')],
  ];
  for (const [index, [pkg, yaml]] of wiringNegatives.entries()) {
    if (checkWiring(pkg, yaml).length === 0) failures.push(`wiring self-test accepted mutation ${index + 1}`);
  }
  if (failures.length > 0) {
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    process.exit(1);
  }
  console.log(`OK: case-study quantitative coverage self-test (${contentNegatives.length} source negatives, ${builtNegatives.length} built negatives, ${wiringNegatives.length} wiring negatives)`);
}

function readRequired(filePath, label, failures) {
  try {
    if (!fs.statSync(filePath).isFile()) throw new Error('not a file');
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    failures.push(`${label} cannot be read: ${error.message}`);
    return '';
  }
}

function finish(result, successMessage) {
  if (result.failures.length > 0) {
    for (const failure of result.failures) console.error(`ERROR: ${failure}`);
    process.exit(1);
  }
  console.log(`${successMessage}: ${result.quantitativeLines} quantitative lines classified (仮定値 ${result.stats['仮定値']}, 目標例 ${result.stats['目標例']}, 実測例 ${result.stats['実測例']}, 外部benchmark ${result.stats['外部benchmark']})`);
}

function runSourceCheck() {
  const failures = [];
  const source = readRequired(caseStudyPath, 'case-study source', failures);
  const packageSource = readRequired(packagePath, 'package.json', failures);
  const workflowSource = readRequired(workflowPath, 'Book QA workflow', failures);
  const result = source ? analyzeSource(source) : { failures: [], quantitativeLines: 0, stats: Object.fromEntries(CLASSIFICATIONS.map((key) => [key, 0])) };
  result.failures.unshift(...failures);
  if (packageSource && workflowSource) result.failures.push(...checkWiring(packageSource, workflowSource));
  finish(result, 'OK: source quantitative coverage and fail-closed wiring');
}

function runBuiltCheck(directory) {
  const failures = [];
  const builtRoot = path.resolve(root, directory);
  const candidates = [
    path.join(builtRoot, 'appendices', 'case-studies', 'index.html'),
    path.join(builtRoot, 'appendices', 'case-studies.html'),
  ];
  const builtPath = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!builtPath) {
    for (const candidate of candidates) failures.push(`built case-study page is missing: ${path.relative(root, candidate)}`);
    finish({ failures, quantitativeLines: 0, stats: Object.fromEntries(CLASSIFICATIONS.map((key) => [key, 0])) }, '');
    return;
  }
  const htmlSource = readRequired(builtPath, 'built case-study page', failures);
  const result = htmlSource ? analyzeBuiltHtml(htmlSource, path.relative(root, builtPath)) : { failures: [], quantitativeLines: 0, stats: Object.fromEntries(CLASSIFICATIONS.map((key) => [key, 0])) };
  result.failures.unshift(...failures);
  finish(result, 'OK: rendered case-study quantitative coverage');
}

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--self-test') runSelfTest();
else if (args.length === 0) runSourceCheck();
else if (args.length === 2 && args[0] === '--built-site') runBuiltCheck(args[1]);
else {
  console.error(`Usage: node ${path.relative(process.cwd(), __filename)} [--self-test | --built-site <directory>]`);
  process.exit(2);
}
