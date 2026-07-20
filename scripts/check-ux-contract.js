#!/usr/bin/env node

/**
 * Reader-facing UX contract for Issue #150.
 *
 * The default mode validates deterministic source contracts with Node.js
 * built-ins only. Pass `--built-site docs/_site` after a Jekyll build to add
 * rendered route, link, fragment, sidebar, previous/next, and figure checks.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs');
const paths = {
  bookConfig: path.join(root, 'book-config.json'),
  jekyllConfig: path.join(docs, '_config.yml'),
  navigation: path.join(docs, '_data', 'navigation.yml'),
  layout: path.join(docs, '_layouts', 'book.html'),
  pageNavigation: path.join(docs, '_includes', 'page-navigation.html'),
  sidebar: path.join(docs, '_includes', 'sidebar-nav.html'),
  top: path.join(docs, 'index.md'),
  chapterThree: path.join(docs, 'chapters', 'chapter-03', 'index.md'),
  conceptMap: path.join(docs, 'appendices', 'concept-map', 'index.md'),
  glossary: path.join(docs, 'appendices', 'glossary', 'index.md'),
  figureIndex: path.join(docs, 'appendices', 'figure-index', 'index.md'),
  diagrams: path.join(docs, 'assets', 'images', 'diagrams'),
};

const appendices = [
  { id: 'A', title: '実務成果物テンプレート集', navTitle: '付録A：実務成果物テンプレート集', route: '/appendices/templates/' },
  { id: 'B', title: 'ケーススタディ', navTitle: '付録B：ケーススタディ', route: '/appendices/case-studies/' },
  { id: 'C', title: '推奨読書リスト', navTitle: '付録C：推奨読書リスト', route: '/appendices/reading-list/' },
  {
    id: 'D',
    title: '更新方針と更新履歴',
    navTitle: '付録D：更新方針と更新履歴',
    route: '/appendices/update-notes/',
    description: '変動情報の確認日、正本、適用範囲、陳腐化の兆候、内容上の更新履歴',
  },
  {
    id: 'E',
    title: '成果物連鎖の概念マップ',
    navTitle: '付録E：成果物連鎖の概念マップ',
    route: '/appendices/concept-map/',
    flag: 'conceptMap',
    source: paths.conceptMap,
  },
  {
    id: 'F',
    title: '用語集',
    navTitle: '付録F：用語集',
    route: '/appendices/glossary/',
    flag: 'glossary',
    source: paths.glossary,
  },
  {
    id: 'G',
    title: '図表索引',
    navTitle: '付録G：図表索引',
    route: '/appendices/figure-index/',
    flag: 'figureIndex',
    source: paths.figureIndex,
  },
];
const modules = appendices.slice(4);
const chapterThreeRoute = '/chapters/chapter-03/';
const connectionTerms = [
  { anchor: 'term-mcp', label: 'MCP' },
  { anchor: 'term-connector', label: 'connector' },
  { anchor: 'term-function-calling', label: 'function calling' },
  { anchor: 'term-external-api', label: '外部 API' },
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const count = (text, pattern) => (text.match(pattern) || []).length;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function readRequired(file, label) {
  try {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      failures.push(`${label} is missing: ${path.relative(root, file)}`);
      return '';
    }
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    failures.push(`${label} cannot be read: ${path.relative(root, file)} (${error.message})`);
    return '';
  }
}

function parseJson(source, label) {
  if (!source) return {};
  try {
    return JSON.parse(source);
  } catch (error) {
    failures.push(`${label} is not valid JSON (${error.message})`);
    return {};
  }
}

function stripYamlComment(value) {
  let quote = null;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (character === quote && value[index - 1] !== '\\') quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '#' && (index === 0 || /\s/.test(value[index - 1]))) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value.trimEnd();
}

function parseYamlScalar(rawValue) {
  const value = stripYamlComment(rawValue).trim();
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

function findYamlSection(lines, sectionPath) {
  const stack = [];
  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
    const indent = raw.length - raw.trimStart().length;
    const content = stripYamlComment(raw.trim());
    const mapping = content.match(/^([A-Za-z0-9_-]+):\s*$/);
    if (!mapping || content.startsWith('- ')) continue;
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
    stack.push({ key: mapping[1], indent });
    if (stack.map((item) => item.key).join('.') === sectionPath.join('.')) {
      return { index, indent };
    }
  }
  return null;
}

function parseYamlList(source, sectionPath, label) {
  if (!source) return [];
  try {
    const lines = source.split(/\r?\n/);
    const section = findYamlSection(lines, sectionPath);
    if (!section) {
      failures.push(`${label} section ${sectionPath.join('.')} is missing`);
      return [];
    }

    const entries = [];
    let current = null;
    let listIndent = null;
    for (let index = section.index + 1; index < lines.length; index += 1) {
      const raw = lines[index];
      if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
      const indent = raw.length - raw.trimStart().length;
      if (indent <= section.indent) break;
      const content = stripYamlComment(raw.trim());
      const item = content.match(/^-\s+([A-Za-z0-9_-]+):\s*(.*)$/);
      if (item) {
        if (listIndent === null) listIndent = indent;
        if (indent !== listIndent) {
          failures.push(`${label} has an unsupported nested list at line ${index + 1}`);
          continue;
        }
        current = {};
        entries.push(current);
        current[item[1]] = parseYamlScalar(item[2]);
        continue;
      }

      const property = content.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (property && current && listIndent !== null && indent > listIndent) {
        if (Object.hasOwn(current, property[1])) {
          failures.push(`${label} entry has duplicate key ${property[1]} at line ${index + 1}`);
        } else {
          current[property[1]] = parseYamlScalar(property[2]);
        }
      } else {
        failures.push(`${label} has unsupported YAML at line ${index + 1}`);
      }
    }
    return entries;
  } catch (error) {
    failures.push(`${label} cannot be parsed (${error.message})`);
    return [];
  }
}

function parseTopLevelYamlScalar(source, key, label) {
  if (!source) return '';
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  const match = source.match(pattern);
  if (!match) {
    failures.push(`${label} top-level key ${key} is missing`);
    return '';
  }
  try {
    return parseYamlScalar(match[1]);
  } catch (error) {
    failures.push(`${label} key ${key} cannot be parsed (${error.message})`);
    return '';
  }
}

function stripMarkdownNonContent(source) {
  const withoutComments = source.replace(/<!--[\s\S]*?-->/g, '');
  const output = [];
  let fence = null;
  for (const line of withoutComments.split(/\r?\n/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      const type = marker[1][0];
      if (fence === null) fence = type;
      else if (fence === type) fence = null;
      continue;
    }
    if (fence === null) output.push(line.replace(/`[^`\n]*`/g, ''));
  }
  return output.join('\n');
}

function extractMarkdownLinks(source) {
  const links = [];
  const content = stripMarkdownNonContent(source);
  const pattern = /(?<!!)\[([^\]\n]+)\]\(\s*([^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
  for (const match of content.matchAll(pattern)) {
    links.push({
      label: match[1].trim(),
      destination: match[2].trim(),
      index: match.index,
      raw: match[0],
    });
  }
  return links;
}

function normalizeSourceDestination(destination, currentRoute) {
  const liquid = destination.match(/^\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}$/);
  const value = liquid ? liquid[1] : destination;
  if (/^(?:https?:|mailto:|tel:|javascript:)/i.test(value)) return null;
  try {
    const resolved = new URL(value, `https://contract.invalid${currentRoute}`);
    return {
      path: resolved.pathname,
      fragment: resolved.hash ? decodeURIComponent(resolved.hash.slice(1)) : '',
    };
  } catch {
    return null;
  }
}

function extractSection(source, heading) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start < 0) return '';
  const level = heading.match(/^#+/)[0].length;
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const nextHeading = lines[index].match(/^(#+)\s/);
    if (nextHeading && nextHeading[1].length <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n');
}

function parseMarkdownTable(source) {
  const rows = source.split(/\r?\n/)
    .filter((line) => line.trim().startsWith('|') && line.trim().endsWith('|'))
    .map((line) => line.trim().slice(1, -1).split('|').map((cell) => cell.trim()));
  if (rows.length === 0) return [];
  return rows.slice(1).filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

function parseHtmlAttributes(rawAttributes) {
  const attributes = {};
  const pattern = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  for (const match of rawAttributes.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? '';
  }
  return attributes;
}

function extractHtmlStartTags(source, tagName) {
  const tags = [];
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  for (const match of source.matchAll(pattern)) {
    tags.push({ raw: match[0], attributes: parseHtmlAttributes(match[1]) });
  }
  return tags;
}

function extractHtmlBlocks(source, tagName) {
  const blocks = [];
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  for (const match of source.matchAll(pattern)) {
    blocks.push({
      raw: match[0],
      inner: match[2],
      attributes: parseHtmlAttributes(match[1]),
    });
  }
  return blocks;
}

function htmlText(source) {
  return source.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseFrontMatterTitle(source, label) {
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontMatter) {
    failures.push(`${label} must have YAML front matter`);
    return '';
  }
  const title = frontMatter[1].match(/^title:\s*(.+)$/m);
  if (!title) {
    failures.push(`${label} front matter title is missing`);
    return '';
  }
  try {
    return parseYamlScalar(title[1]);
  } catch (error) {
    failures.push(`${label} front matter title cannot be parsed (${error.message})`);
    return '';
  }
}

const bookConfigSource = readRequired(paths.bookConfig, 'book-config.json');
const jekyllConfigSource = readRequired(paths.jekyllConfig, 'docs/_config.yml');
const navigationSource = readRequired(paths.navigation, 'docs/_data/navigation.yml');
const layoutSource = readRequired(paths.layout, 'book layout');
const pageNavigationSource = readRequired(paths.pageNavigation, 'page-navigation include');
const sidebarSource = readRequired(paths.sidebar, 'sidebar include');
const topSource = readRequired(paths.top, 'top page');
const chapterThreeSource = readRequired(paths.chapterThree, 'Chapter 3 page');
const conceptMapSource = readRequired(paths.conceptMap, 'Appendix E page');
const glossarySource = readRequired(paths.glossary, 'Appendix F page');
const figureIndexSource = readRequired(paths.figureIndex, 'Appendix G page');

const bookConfig = parseJson(bookConfigSource, 'book-config.json');
const bookAppendices = Array.isArray(bookConfig.structure?.appendices)
  ? bookConfig.structure.appendices
  : [];
check(Array.isArray(bookConfig.structure?.appendices), 'book-config structure.appendices must be an array');
const configAppendices = parseYamlList(jekyllConfigSource, ['structure', 'appendices'], 'docs/_config.yml');
const navigationAppendices = parseYamlList(navigationSource, ['appendices'], 'docs/_data/navigation.yml');

// Keep the complete A→G appendix contract synchronized across both configs.
const expectedBookAppendices = appendices.map((appendix) => ({
  id: appendix.id.toLowerCase(),
  title: appendix.title,
  path: appendix.route,
}));
const actualBookAppendices = bookAppendices.map((entry) => ({
  id: entry.id,
  title: entry.title,
  path: entry.path,
}));
const expectedJekyllAppendices = appendices.map((appendix) => ({
  id: appendix.id,
  title: appendix.title,
  path: appendix.route,
}));
const actualJekyllAppendices = configAppendices.map((entry) => ({
  id: entry.id,
  title: entry.title,
  path: entry.path,
}));
check(JSON.stringify(actualBookAppendices) === JSON.stringify(expectedBookAppendices),
  `book-config appendices must be the exact A→G contract: ${JSON.stringify(expectedBookAppendices)}`);
check(JSON.stringify(actualJekyllAppendices) === JSON.stringify(expectedJekyllAppendices),
  `docs/_config.yml appendices must be the exact A→G contract: ${JSON.stringify(expectedJekyllAppendices)}`);

for (const appendix of appendices) {
  const bookMatches = bookAppendices.filter((entry) => String(entry.id).toUpperCase() === appendix.id);
  const configMatches = configAppendices.filter((entry) => String(entry.id).toUpperCase() === appendix.id);
  check(bookMatches.length === 1, `book-config appendix ${appendix.id} must be unique (found ${bookMatches.length})`);
  check(configMatches.length === 1, `docs/_config.yml appendix ${appendix.id} must be unique (found ${configMatches.length})`);
  const bookEntry = bookMatches[0];
  const configEntry = configMatches[0];
  if (bookEntry) {
    check(String(bookEntry.id) === appendix.id.toLowerCase(), `book-config appendix ${appendix.id} id must be ${appendix.id.toLowerCase()}`);
    check(bookEntry.title === appendix.title, `book-config appendix ${appendix.id} title must be ${appendix.title}`);
    check(bookEntry.path === appendix.route, `book-config appendix ${appendix.id} path must be ${appendix.route}`);
    if (appendix.description) {
      check(bookEntry.description === appendix.description,
        `book-config appendix ${appendix.id} description must be ${appendix.description}`);
    }
  }
  if (configEntry) {
    check(configEntry.id === appendix.id, `docs/_config.yml appendix ${appendix.id} id must be ${appendix.id}`);
    check(configEntry.title === appendix.title, `docs/_config.yml appendix ${appendix.id} title must be ${appendix.title}`);
    check(configEntry.path === appendix.route, `docs/_config.yml appendix ${appendix.id} path must be ${appendix.route}`);
  }
  if (bookEntry && configEntry) {
    check(String(bookEntry.id).toUpperCase() === configEntry.id, `appendix ${appendix.id} id is out of sync between configs`);
    check(bookEntry.title === configEntry.title, `appendix ${appendix.id} title is out of sync between configs`);
    check(bookEntry.path === configEntry.path, `appendix ${appendix.id} path is out of sync between configs`);
  }
}

// Parsed navigation entries are the source of sidebar and previous/next order.
for (const appendix of appendices) {
  const exactEntries = navigationAppendices.filter(
    (entry) => entry.title === appendix.navTitle && entry.path === appendix.route,
  );
  check(exactEntries.length === 1, `navigation appendix ${appendix.id} must have one title/path entry (found ${exactEntries.length})`);
  check(navigationAppendices.filter((entry) => entry.path === appendix.route).length === 1, `navigation route ${appendix.route} must be unique`);
  check(navigationAppendices.filter((entry) => entry.title === appendix.navTitle).length === 1, `navigation title ${appendix.navTitle} must be unique`);
}
const expectedNavigationAppendices = appendices.map((appendix) => ({
  title: appendix.navTitle,
  path: appendix.route,
}));
const actualNavigationAppendices = navigationAppendices.map((entry) => ({
  title: entry.title,
  path: entry.path,
}));
check(JSON.stringify(actualNavigationAppendices) === JSON.stringify(expectedNavigationAppendices),
  `navigation appendices must be the exact A→G title/path contract: ${JSON.stringify(expectedNavigationAppendices)}`);

const navigationNeighbors = (route) => {
  const index = navigationAppendices.findIndex((entry) => entry.path === route);
  return {
    previous: index > 0 ? navigationAppendices[index - 1]?.path : null,
    next: index >= 0 && index + 1 < navigationAppendices.length ? navigationAppendices[index + 1]?.path : null,
  };
};
const expectedSourceSequence = {
  E: { previous: appendices[3].route, next: appendices[5].route },
  F: { previous: appendices[4].route, next: appendices[6].route },
  G: { previous: appendices[5].route, next: null },
};
for (const module of modules) {
  const actual = navigationNeighbors(module.route);
  const expected = expectedSourceSequence[module.id];
  check(actual.previous === expected.previous, `navigation ${module.id} previous route must be ${expected.previous}`);
  check(actual.next === expected.next, `navigation ${module.id} next route must be ${expected.next ?? 'absent'}`);
}

// Flag → route → page and canonical layout navigation consistency.
const uxModules = bookConfig.ux?.modules || {};
for (const module of modules) {
  check(uxModules[module.flag] === true, `book-config ux.modules.${module.flag} must be true`);
  const source = module.id === 'E' ? conceptMapSource : module.id === 'F' ? glossarySource : figureIndexSource;
  check(parseFrontMatterTitle(source, `Appendix ${module.id}`) === module.navTitle, `Appendix ${module.id} front matter title must be ${module.navTitle}`);
  check(!source.includes('{% include page-navigation.html %}'), `Appendix ${module.id} must not duplicate layout navigation`);
}
check(count(layoutSource, /\{% include page-navigation\.html %\}/g) === 1, 'book layout must inject page-navigation exactly once');
check(!topSource.includes('{% include page-navigation.html %}'), 'top page must not duplicate layout navigation');
check(pageNavigationSource.includes('navigation.appendices'), 'page-navigation must derive sequence from navigation.appendices');
check(sidebarSource.includes('navigation.appendices'), 'sidebar must derive appendix entries from navigation.appendices');

// The top route must be one rendered Markdown link, not a comment or string.
const topLinks = extractMarkdownLinks(topSource);
for (const module of modules) {
  const matching = topLinks.filter((link) => normalizeSourceDestination(link.destination, '/')?.path === module.route);
  check(matching.length === 1, `top page must contain one Markdown link to ${module.route} (found ${matching.length})`);
  if (matching[0]) check(matching[0].label === module.navTitle, `top link ${module.route} must use label ${module.navTitle}`);
}

// Concept map: six deliverable dependency rows plus role/purpose routes.
const dependencyRows = parseMarkdownTable(extractSection(conceptMapSource, '## 6章の成果物依存'));
const dependencyStages = ['判断', '要求', '設計', 'delivery', '合意', '運用'];
check(dependencyRows.length === 6, `concept map dependency table must have 6 rows (found ${dependencyRows.length})`);
for (let index = 0; index < dependencyStages.length; index += 1) {
  const row = dependencyRows[index];
  if (!row) continue;
  check(row.length === 5, `concept map dependency row ${index + 1} must have 5 cells`);
  const expectedStage = `${index + 1}. ${dependencyStages[index]}`;
  check(row[0] === expectedStage, `concept map dependency row ${index + 1} must be ${expectedStage} (got ${row[0] ?? 'missing'})`);
  const rowLinks = extractMarkdownLinks(row.join(' | ')).map((link) => normalizeSourceDestination(link.destination, appendices[4].route)).filter(Boolean);
  check(rowLinks.some((link) => link.path === `/chapters/chapter-0${index + 1}/`), `concept map row ${index + 1} must link its chapter`);
  const nextChapter = index === 5 ? 1 : index + 2;
  check(rowLinks.some((link) => link.path === `/chapters/chapter-0${nextChapter}/`), `concept map row ${index + 1} must link its downstream chapter`);
  check(Boolean(row[2]) && Boolean(row[3]), `concept map row ${index + 1} must bind deliverables and handoff inputs`);
}

const conceptLinks = extractMarkdownLinks(conceptMapSource)
  .map((link) => ({ ...link, normalized: normalizeSourceDestination(link.destination, appendices[4].route) }))
  .filter((link) => link.normalized);
const requiredConceptRoutes = [
  ...Array.from({ length: 6 }, (_, index) => `/chapters/chapter-0${index + 1}/`),
  '/introduction/ai-collaboration-sop/',
  '/appendices/glossary/',
  '/appendices/figure-index/',
];
for (const route of requiredConceptRoutes) {
  check(conceptLinks.some((link) => link.normalized.path === route), `concept map must contain a Markdown route to ${route}`);
}
const roleRows = parseMarkdownTable(extractSection(conceptMapSource, '## 役割・目的別のルート'));
check(roleRows.length >= 6, `concept map role/purpose table must have at least 6 rows (found ${roleRows.length})`);
for (const [index, row] of roleRows.entries()) {
  check(row.length === 4, `concept map role route row ${index + 1} must have 4 cells`);
  check(Boolean(row[0]) && Boolean(row[1]) && Boolean(row[3]), `concept map role route row ${index + 1} must bind role, purpose, and deliverable`);
  check(extractMarkdownLinks(row[2] || '').length >= 1, `concept map role route row ${index + 1} must contain a route link`);
}
check(!/<script\b/i.test(conceptMapSource) && !/href\s*=\s*["']javascript:/i.test(conceptMapSource), 'concept map must be non-JavaScript');

// Glossary: each stable term anchor is bound to its definition and links.
const glossaryRows = glossarySource.split(/\r?\n/)
  .filter((line) => line.trim().startsWith('|') && /<a id="term-[^"]+"><\/a>/.test(line))
  .map((line) => line.trim().slice(1, -1).split('|').map((cell) => cell.trim()));
const allTermAnchors = [...glossarySource.matchAll(/<a id="(term-[^"]+)"><\/a>/g)].map((match) => match[1]);
const uniqueTermAnchors = new Set(allTermAnchors);
check(allTermAnchors.length >= 20, `glossary must define at least 20 term anchors (found ${allTermAnchors.length})`);
check(uniqueTermAnchors.size === allTermAnchors.length, 'glossary term anchors must be unique');
check(glossaryRows.length === allTermAnchors.length, 'every glossary term anchor must belong to exactly one glossary row');
for (const [index, row] of glossaryRows.entries()) {
  const anchorMatches = [...(row[0] || '').matchAll(/<a id="(term-[^"]+)"><\/a>/g)];
  check(row.length === 4, `glossary row ${index + 1} must have 4 cells`);
  check(anchorMatches.length === 1, `glossary row ${index + 1} must bind one stable term anchor`);
  check(htmlText((row[0] || '').replace(/<a[^>]*><\/a>/g, '')).length > 0, `glossary row ${index + 1} must name the term`);
  check(htmlText(row[1] || '').length >= 20, `glossary row ${index + 1} must have a meaningful definition`);
  const chapterLinks = extractMarkdownLinks(row[2] || '').map((link) => normalizeSourceDestination(link.destination, appendices[5].route)).filter(Boolean);
  const relatedLinks = extractMarkdownLinks(row[3] || '').map((link) => normalizeSourceDestination(link.destination, appendices[5].route)).filter(Boolean);
  check(chapterLinks.some((link) => /^\/chapters\/chapter-0[1-6]\/$/.test(link.path)), `glossary row ${index + 1} must link a related chapter`);
  check(relatedLinks.some((link) => link.path === '/introduction/ai-collaboration-sop/'), `glossary row ${index + 1} must link the SOP`);
  check(relatedLinks.some((link) => link.path.startsWith('/appendices/')), `glossary row ${index + 1} must link a related appendix`);
}

// Chapter 3 connection terminology must be defined once and support round-trip navigation.
const chapterThreeTermLinks = extractMarkdownLinks(chapterThreeSource)
  .map((link) => ({ ...link, normalized: normalizeSourceDestination(link.destination, chapterThreeRoute) }))
  .filter((link) => link.normalized?.path === appendices[5].route && link.normalized.fragment);
const chapterThreeDecisionSource = stripMarkdownNonContent(extractSection(chapterThreeSource, '## この章で扱う判断'));
const chapterThreeDecisionTermLinks = extractMarkdownLinks(chapterThreeDecisionSource)
  .map((link) => ({ ...link, normalized: normalizeSourceDestination(link.destination, chapterThreeRoute) }))
  .filter((link) => link.normalized?.path === appendices[5].route && link.normalized.fragment);
const connectionPrimer = extractSection(
  chapterThreeSource,
  '### 3.4.1 接続方式の位置づけ',
);
check(connectionPrimer.includes('同じ「規程検索」'), 'Chapter 3 connection primer must include one shared policy-search example');
for (const term of connectionTerms) {
  const rows = glossaryRows.filter((row) => (row[0] || '').includes(`id="${term.anchor}"`));
  check(rows.length === 1, `glossary must define one connection term #${term.anchor}`);
  const row = rows[0];
  if (row) {
    const chapterLinks = extractMarkdownLinks(row[2] || '')
      .map((link) => normalizeSourceDestination(link.destination, appendices[5].route))
      .filter(Boolean);
    check(chapterLinks.some((link) => link.path === chapterThreeRoute && link.fragment === 'section-3-4'),
      `glossary #${term.anchor} must link Chapter 3 §3.4`);
  }
  const forwardLinks = chapterThreeTermLinks.filter((link) => link.normalized.fragment === term.anchor);
  check(forwardLinks.length === 1, `Chapter 3 must link glossary #${term.anchor} exactly once (found ${forwardLinks.length})`);
  if (forwardLinks[0]) check(forwardLinks[0].label === term.label, `Chapter 3 glossary #${term.anchor} link label must be ${term.label}`);
  const firstOccurrenceLinks = chapterThreeDecisionTermLinks.filter((link) => link.normalized.fragment === term.anchor);
  check(firstOccurrenceLinks.length === 1, `Chapter 3 decision list must link first occurrence to glossary #${term.anchor} exactly once (found ${firstOccurrenceLinks.length})`);
  const firstLabelIndex = chapterThreeDecisionSource.indexOf(term.label);
  const firstOccurrenceLink = firstOccurrenceLinks[0];
  const linkedLabelIndex = firstOccurrenceLink
    ? firstOccurrenceLink.index + firstOccurrenceLink.raw.indexOf(term.label)
    : -1;
  check(firstOccurrenceLink?.label === term.label && firstLabelIndex === linkedLabelIndex,
    `Chapter 3 first ${term.label} occurrence must be the canonical glossary link to #${term.anchor}`);
}

const requiredConceptTerms = [
  'term-source-hierarchy',
  'term-requirements-brief',
  'term-ai-system-adr',
  'term-verification-cost',
  'term-risk-register',
  'term-postmortem',
];
for (const anchor of requiredConceptTerms) {
  const links = conceptLinks.filter((link) => link.normalized.path === appendices[5].route && link.normalized.fragment === anchor);
  check(links.length === 1, `concept map must bind one important term link to glossary #${anchor}`);
  check(uniqueTermAnchors.has(anchor), `concept map glossary target #${anchor} must exist`);
}

// Figure index: inventory row and figure block must bind the same ID/file.
let svgFiles = [];
try {
  if (!fs.existsSync(paths.diagrams) || !fs.statSync(paths.diagrams).isDirectory()) {
    failures.push(`diagram directory is missing: ${path.relative(root, paths.diagrams)}`);
  } else {
    svgFiles = fs.readdirSync(paths.diagrams).filter((file) => file.endsWith('.svg')).sort();
  }
} catch (error) {
  failures.push(`diagram inventory cannot be read (${error.message})`);
}
check(svgFiles.length === 3, `expected exactly 3 SVG diagrams (found ${svgFiles.length})`);

const inventoryRows = parseMarkdownTable(extractSection(figureIndexSource, '## 図版インベントリ'));
check(inventoryRows.length === svgFiles.length, `figure inventory must have ${svgFiles.length} rows (found ${inventoryRows.length})`);
const inventoryPairs = [];
for (const [index, row] of inventoryRows.entries()) {
  const anchorLinks = extractMarkdownLinks(row[0] || '')
    .map((link) => normalizeSourceDestination(link.destination, appendices[6].route))
    .filter(Boolean);
  const filenames = [...(row[1] || '').matchAll(/`([^`]+\.svg)`/g)].map((match) => match[1]);
  check(row.length === 4, `figure inventory row ${index + 1} must have 4 cells`);
  check(anchorLinks.length === 1 && Boolean(anchorLinks[0].fragment), `figure inventory row ${index + 1} must link one stable fragment`);
  check(filenames.length === 1, `figure inventory row ${index + 1} must bind one SVG filename`);
  if (anchorLinks[0] && filenames[0]) inventoryPairs.push({ stableId: anchorLinks[0].fragment, filename: filenames[0] });
}

const figureBlocks = extractHtmlBlocks(figureIndexSource, 'figure');
check(figureBlocks.length === svgFiles.length, `figure index must have ${svgFiles.length} figure blocks (found ${figureBlocks.length})`);
for (const file of svgFiles) {
  const stableId = `figure-${file.replace(/\.svg$/, '')}`;
  const matchingInventory = inventoryPairs.filter((pair) => pair.stableId === stableId && pair.filename === file);
  check(matchingInventory.length === 1, `figure inventory must bind #${stableId} to ${file} exactly once`);
  check(inventoryPairs.filter((pair) => pair.stableId === stableId).length === 1, `figure inventory fragment #${stableId} must be unique`);
  check(inventoryPairs.filter((pair) => pair.filename === file).length === 1, `figure inventory filename ${file} must be unique`);

  const matchingBlocks = figureBlocks.filter((block) => block.attributes.id === stableId);
  check(matchingBlocks.length === 1, `figure ${file} must have one block with stable ID #${stableId}`);
  const block = matchingBlocks[0];
  if (!block) continue;
  check(block.attributes['aria-labelledby'] === `${stableId}-caption`, `figure #${stableId} must reference its caption ID`);
  const images = extractHtmlStartTags(block.inner, 'img');
  const captions = extractHtmlBlocks(block.inner, 'figcaption');
  check(images.length === 1, `figure #${stableId} must contain one image`);
  check(captions.length === 1, `figure #${stableId} must contain one caption`);
  if (images[0]) {
    const imageTarget = normalizeSourceDestination(images[0].attributes.src || '', appendices[6].route);
    check(imageTarget?.path === `/assets/images/diagrams/${file}`, `figure #${stableId} must expose ${file}`);
    check((images[0].attributes.alt || '').trim().length >= 10, `figure #${stableId} must have meaningful alt text`);
  }
  const svgReferences = [...block.raw.matchAll(/([A-Za-z0-9-]+\.svg)/g)].map((match) => match[1]);
  check(svgReferences.length === 1 && svgReferences[0] === file, `figure #${stableId} must bind only its expected SVG filename`);
  if (captions[0]) {
    check(captions[0].attributes.id === `${stableId}-caption`, `figure #${stableId} caption must have stable ID #${stableId}-caption`);
    const captionText = htmlText(captions[0].inner);
    check(captionText.includes('用途'), `figure #${stableId} caption must state its purpose`);
    check(captionText.includes('関連章'), `figure #${stableId} caption must state related chapters`);
    check(captionText.includes('概念図') || captionText.includes('説明用'), `figure #${stableId} caption must state conceptual/illustrative status`);
    const captionLinks = extractHtmlStartTags(captions[0].inner, 'a')
      .map((tag) => normalizeSourceDestination(tag.attributes.href || '', appendices[6].route))
      .filter(Boolean);
    check(captionLinks.some((link) => /^\/chapters\/chapter-0[1-6]\/$/.test(link.path)), `figure #${stableId} caption must link a related chapter`);
  }
}

// Every source link to an explicit glossary term must resolve to an anchor.
for (const [label, source, route] of [
  ['concept map', conceptMapSource, appendices[4].route],
  ['figure index', figureIndexSource, appendices[6].route],
]) {
  const termLinks = extractMarkdownLinks(source)
    .map((link) => normalizeSourceDestination(link.destination, route))
    .filter((link) => link?.path === appendices[5].route && link.fragment);
  for (const link of termLinks) {
    check(uniqueTermAnchors.has(link.fragment), `${label} links missing glossary anchor #${link.fragment}`);
  }
}

function builtFileForPath(siteDirectory, baseurl, pathname) {
  if (pathname === baseurl || pathname === `${baseurl}/`) return path.join(siteDirectory, 'index.html');
  if (!pathname.startsWith(`${baseurl}/`)) return null;
  const relative = pathname.slice(baseurl.length + 1);
  if (!relative) return path.join(siteDirectory, 'index.html');
  if (pathname.endsWith('/')) return path.join(siteDirectory, relative, 'index.html');
  return path.join(siteDirectory, relative);
}

function extractBuiltIds(source) {
  return new Set([...source.matchAll(/\bid=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] ?? match[2]));
}

function classList(attributes) {
  return (attributes.class || '').split(/\s+/).filter(Boolean);
}

function checkBuiltSite(siteDirectory, baseurl) {
  const builtPages = new Map();
  const builtTargets = new Map();
  const readBuiltTarget = (file, label) => {
    const key = path.resolve(file);
    if (!builtTargets.has(key)) {
      const source = readRequired(file, label);
      builtTargets.set(key, { source, ids: extractBuiltIds(source) });
    }
    return builtTargets.get(key);
  };
  const requestedPages = [{ label: 'built top page', route: '/', file: path.join(siteDirectory, 'index.html') }];
  requestedPages.push({
    label: 'built Chapter 3',
    route: chapterThreeRoute,
    file: path.join(siteDirectory, chapterThreeRoute.replace(/^\//, ''), 'index.html'),
  });
  for (const module of modules) {
    requestedPages.push({
      label: `built Appendix ${module.id}`,
      route: module.route,
      file: path.join(siteDirectory, module.route.replace(/^\//, ''), 'index.html'),
    });
  }
  for (const page of requestedPages) builtPages.set(page.route, readBuiltTarget(page.file, page.label).source);

  const builtTop = builtPages.get('/') || '';
  const builtTopLinks = extractHtmlStartTags(builtTop, 'a');
  for (const module of modules) {
    const expectedPath = `${baseurl}${module.route}`;
    const matching = builtTopLinks.filter((tag) => {
      try {
        return new URL(tag.attributes.href || '', `https://contract.invalid${baseurl}/`).pathname === expectedPath;
      } catch {
        return false;
      }
    });
    check(matching.length >= 1, `built top page must link ${expectedPath}`);
  }

  const builtChapterThree = builtPages.get(chapterThreeRoute) || '';
  const builtChapterThreeLinks = extractHtmlStartTags(builtChapterThree, 'a');
  const chapterThreeUrl = `https://contract.invalid${baseurl}${chapterThreeRoute}`;
  for (const term of connectionTerms) {
    const matching = builtChapterThreeLinks.filter((tag) => {
      try {
        const target = new URL(tag.attributes.href || '', chapterThreeUrl);
        return target.origin === 'https://contract.invalid'
          && target.pathname === `${baseurl}${appendices[5].route}`
          && target.hash === `#${term.anchor}`;
      } catch {
        return false;
      }
    });
    check(matching.length === 1, `built Chapter 3 must link glossary #${term.anchor} exactly once (found ${matching.length})`);
  }

  // Check all internal links and fragments originating from E/F/G.
  for (const module of modules) {
    const html = builtPages.get(module.route) || '';
    const currentUrl = `https://contract.invalid${baseurl}${module.route}`;
    for (const anchor of extractHtmlStartTags(html, 'a')) {
      const href = anchor.attributes.href || '';
      if (!href || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
      let resolved;
      try {
        resolved = new URL(href, currentUrl);
      } catch {
        failures.push(`built Appendix ${module.id} has malformed href ${href}`);
        continue;
      }
      if (resolved.origin !== 'https://contract.invalid') continue;
      const targetFile = builtFileForPath(siteDirectory, baseurl, resolved.pathname);
      if (!targetFile) {
        failures.push(`built Appendix ${module.id} has out-of-base internal href ${href}`);
        continue;
      }
      const target = readBuiltTarget(targetFile, `built link target for ${href}`);
      if (resolved.hash && target.source) {
        let fragment = resolved.hash.slice(1);
        try {
          fragment = decodeURIComponent(fragment);
        } catch {
          failures.push(`built Appendix ${module.id} has invalid encoded fragment ${resolved.hash}`);
          continue;
        }
        check(target.ids.has(fragment), `built Appendix ${module.id} links missing fragment ${resolved.pathname}#${fragment}`);
      }
    }

    // Exactly one active sidebar entry must resolve to the current page.
    const activeSidebar = extractHtmlStartTags(html, 'a').filter((tag) => {
      const classes = classList(tag.attributes);
      return classes.includes('toc-link') && classes.includes('active');
    });
    check(activeSidebar.length === 1, `built Appendix ${module.id} must have one active sidebar entry (found ${activeSidebar.length})`);
    if (activeSidebar[0]) {
      let activePath = '';
      try {
        activePath = new URL(activeSidebar[0].attributes.href || '', currentUrl).pathname;
      } catch {
        // The malformed href is reported by the internal-link pass.
      }
      check(activePath === `${baseurl}${module.route}`, `built Appendix ${module.id} active sidebar entry must target its route`);
      check(activeSidebar[0].attributes['aria-current'] === 'page', `built Appendix ${module.id} active sidebar entry must set aria-current=page`);
    }

    const anchors = extractHtmlStartTags(html, 'a');
    const previous = anchors.filter((tag) => classList(tag.attributes).includes('nav-prev'));
    const next = anchors.filter((tag) => classList(tag.attributes).includes('nav-next'));
    const expected = expectedSourceSequence[module.id];
    check(previous.length === 1, `built Appendix ${module.id} must have one previous link`);
    if (previous[0]) {
      const previousPath = new URL(previous[0].attributes.href, currentUrl).pathname;
      check(previousPath === `${baseurl}${expected.previous}`, `built Appendix ${module.id} previous link must target ${expected.previous}`);
    }
    check(next.length === (expected.next ? 1 : 0), `built Appendix ${module.id} next link count must be ${expected.next ? 1 : 0}`);
    if (next[0] && expected.next) {
      const nextPath = new URL(next[0].attributes.href, currentUrl).pathname;
      check(nextPath === `${baseurl}${expected.next}`, `built Appendix ${module.id} next link must target ${expected.next}`);
    }
  }

  const builtFigureIndex = builtPages.get(appendices[6].route) || '';
  const builtFigures = extractHtmlBlocks(builtFigureIndex, 'figure');
  const figureCurrentUrl = `https://contract.invalid${baseurl}${appendices[6].route}`;
  check(builtFigures.length === svgFiles.length, `built figure index must have ${svgFiles.length} figure blocks`);
  for (const file of svgFiles) {
    const stableId = `figure-${file.replace(/\.svg$/, '')}`;
    const blocks = builtFigures.filter((block) => block.attributes.id === stableId);
    check(blocks.length === 1, `built figure ${file} must have one stable block #${stableId}`);
    const block = blocks[0];
    if (!block) continue;
    const images = extractHtmlStartTags(block.inner, 'img');
    const captions = extractHtmlBlocks(block.inner, 'figcaption');
    check(images.length === 1, `built figure #${stableId} must contain one image`);
    check(captions.length === 1, `built figure #${stableId} must contain one caption`);
    if (images[0]) {
      const source = images[0].attributes.src || '';
      const resolved = new URL(source, `https://contract.invalid${baseurl}${appendices[6].route}`);
      check(resolved.pathname === `${baseurl}/assets/images/diagrams/${file}`, `built figure #${stableId} must expose ${file}`);
      check((images[0].attributes.alt || '').trim().length >= 10, `built figure #${stableId} must retain meaningful alt text`);
      const asset = builtFileForPath(siteDirectory, baseurl, resolved.pathname);
      check(Boolean(asset) && fs.existsSync(asset), `built figure asset ${file} must exist`);
    }
    if (captions[0]) {
      check(captions[0].attributes.id === `${stableId}-caption`, `built figure #${stableId} must retain its caption ID`);
      const captionLinks = extractHtmlStartTags(captions[0].inner, 'a');
      check(captionLinks.length >= 1, `built figure #${stableId} caption must render related links as HTML anchors`);
      check(captionLinks.some((tag) => {
        try {
          const pathname = new URL(tag.attributes.href, figureCurrentUrl).pathname;
          return /^\/chapters\/chapter-0[1-6]\/$/.test(pathname.slice(baseurl.length));
        } catch {
          return false;
        }
      }), `built figure #${stableId} caption must render a related chapter link`);
    }
  }
}

const builtArgument = process.argv.indexOf('--built-site');
if (builtArgument >= 0) {
  const providedPath = process.argv[builtArgument + 1];
  if (!providedPath || providedPath.startsWith('--')) {
    failures.push('--built-site requires a directory path');
  } else {
    const siteDirectory = path.resolve(root, providedPath);
    if (!fs.existsSync(siteDirectory) || !fs.statSync(siteDirectory).isDirectory()) {
      failures.push(`built site directory is missing: ${path.relative(root, siteDirectory)}`);
    } else {
      const configuredBaseurl = parseTopLevelYamlScalar(jekyllConfigSource, 'baseurl', 'docs/_config.yml').replace(/\/$/, '');
      checkBuiltSite(siteDirectory, configuredBaseurl);
    }
  }
}

if (failures.length > 0) {
  console.error('UX contract failed:');
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`UX source contract passed: ${modules.length} synchronized modules, ${navigationAppendices.length} ordered appendix routes, ${svgFiles.length} bound figures, and ${allTermAnchors.length} glossary terms.`);
if (builtArgument >= 0) console.log('Built UX contract passed: internal links/fragments, active sidebar, previous/next routes, and figures are consistent.');
