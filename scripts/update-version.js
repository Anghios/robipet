#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to version.json
const versionPath = path.join(__dirname, '..', 'public', 'version.json');

// Read package.json to get version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let version = '1.0.0';

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version || '1.0.0';
} catch (error) {
  console.warn('Could not read package.json, using default version');
}

// Create version.json with current timestamp
const versionData = {
  version: version,
  timestamp: Date.now()
};

fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2), 'utf8');
console.log(`✅ Version file updated: ${version} (timestamp: ${versionData.timestamp})`);
