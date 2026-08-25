import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [typographyCssPath, sourceDirectory, contractPath] = process.argv.slice(2);
if (!typographyCssPath || !sourceDirectory) {
  console.error('Usage: node check-typography-drift.mjs <typography.css> <source-directory> [component-contract.json]');
  process.exit(2);
}

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

const typographyCss = readFileSync(typographyCssPath, 'utf8');
const availableClasses = new Set([...typographyCss.matchAll(/\.([A-Za-z0-9_-]+)\s*\{/g)].map(match => match[1]));
const sourceFiles = filesIn(sourceDirectory).filter(path => /\.(?:[cm]?[jt]sx?|css|scss)$/i.test(path));
const source = sourceFiles.map(path => ({ path, text: readFileSync(path, 'utf8') }));
const problems = [];

function exceptionOnLine(text, index) {
  const start = text.lastIndexOf('\n', index) + 1;
  const end = text.indexOf('\n', index);
  return text.slice(start, end === -1 ? text.length : end).includes('dhm-typography-exception');
}

for (const file of source.filter(entry => /\.(?:css|scss)$/i.test(entry.path))) {
  const properties = [...file.text.matchAll(/\b(font(?:-family|-weight|-size)?|line-height|letter-spacing)\s*:/g)];
  for (const property of properties) {
    if (exceptionOnLine(file.text, property.index)) continue;
    const line = file.text.slice(0, property.index).split('\n').length;
    problems.push(`${file.path}:${line} duplicates ${property[1]} instead of using a DHM text-style class`);
  }
}

if (contractPath) {
  const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
  for (const mapping of contract.typography ?? []) {
    if (!availableClasses.has(mapping.className)) {
      problems.push(`Contract references unavailable typography class: ${mapping.className}`);
      continue;
    }
    if (!source.some(file => /\.(?:[cm]?[jt]sx?)$/i.test(file.path) && file.text.includes(mapping.className))) {
      problems.push(`Typography class ${mapping.className} is declared for ${mapping.element ?? 'a component element'} but is not used in TSX`);
    }
  }
}

if (problems.length) {
  console.error(['Typography drift detected:', ...problems.map(problem => `- ${problem}`)].join('\n'));
  process.exit(1);
}

console.log(`Typography drift check passed (${availableClasses.size} generated text-style classes).`);
