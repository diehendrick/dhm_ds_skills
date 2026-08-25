import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [typographyCssPath, manifestPath, sourceDirectory, contractPath] = process.argv.slice(2);
if (!typographyCssPath || !manifestPath || !sourceDirectory || !contractPath) {
  console.error('Usage: node check-token-alignment.mjs <typography.css> <manifest.json> <source-directory> <component-contract.json>');
  process.exit(2);
}

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function exceptionOnLine(text, index, name) {
  const start = text.lastIndexOf('\n', index) + 1;
  const end = text.indexOf('\n', index);
  return text.slice(start, end === -1 ? text.length : end).includes(`dhm-${name}-exception`);
}

const typographyCss = readFileSync(typographyCssPath, 'utf8');
const availableClasses = new Set([...typographyCss.matchAll(/\.([A-Za-z0-9_-]+)\s*\{/g)].map(match => match[1]));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
const tokensByVariable = new Map(entries.map(entry => [entry.cssVariable, entry]));
const tokensByPath = new Map(entries.map(entry => [entry.tokenPath, entry]));
const source = filesIn(sourceDirectory)
  .filter(path => /\.(?:[cm]?[jt]sx?|css|scss)$/i.test(path))
  .map(path => ({ path, text: readFileSync(path, 'utf8') }));
const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
const problems = [];

for (const file of source.filter(entry => /\.(?:css|scss)$/i.test(entry.path))) {
  for (const property of file.text.matchAll(/\b(font(?:-family|-weight|-size)?|line-height|letter-spacing)\s*:/g)) {
    if (!exceptionOnLine(file.text, property.index, 'typography')) problems.push(`${file.path}:${file.text.slice(0, property.index).split('\n').length} duplicates ${property[1]} without a DHM text-style class`);
  }
  for (const value of file.text.matchAll(/(?:#[0-9a-f]{3,8}\b|\brgba?\([^)]*\)|\b(?:padding|margin|gap|border-radius|box-shadow)\s*:\s*[^;]*(?:\d+(?:\.\d+)?(?:px|rem|em)|#[0-9a-f]{3,8}|rgba?\())/gi)) {
    if (!exceptionOnLine(file.text, value.index, 'token')) problems.push(`${file.path}:${file.text.slice(0, value.index).split('\n').length} contains a hard-coded visual value without a DHM token`);
  }
}

for (const mapping of contract.typography ?? []) {
  if (!availableClasses.has(mapping.className)) problems.push(`Contract references unavailable typography class: ${mapping.className}`);
  else if (!source.some(file => /\.(?:[cm]?[jt]sx?)$/i.test(file.path) && file.text.includes(mapping.className))) problems.push(`Typography class ${mapping.className} is not used in TSX`);
}

for (const mapping of contract.roles ?? []) {
  const entry = tokensByVariable.get(mapping.cssVariable);
  if (!entry) problems.push(`Role ${mapping.role} references unavailable CSS variable: ${mapping.cssVariable}`);
  else if (mapping.tokenPath !== entry.tokenPath || !tokensByPath.has(mapping.tokenPath)) problems.push(`Role ${mapping.role} does not match manifest token path: ${mapping.tokenPath}`);
  else if (!source.some(file => file.text.includes(`var(${mapping.cssVariable})`))) problems.push(`Role ${mapping.role} maps ${mapping.cssVariable} but it is not used in source`);
}

if (problems.length) {
  console.error(['DHM token alignment failed:', ...problems.map(problem => `- ${problem}`)].join('\n'));
  process.exit(1);
}
console.log(`DHM token alignment passed (${availableClasses.size} typography classes, ${contract.roles?.length ?? 0} role mappings).`);
