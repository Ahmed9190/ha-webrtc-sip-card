import { execSync } from 'child_process';
import fs from 'fs';

function generateReleaseNotes(version) {
  try {
    // Get commits since last tag
    const lastTag = execSync('git describe --tags --abbrev=0 HEAD^', { encoding: 'utf8' }).trim();
    const commits = execSync(`git log ${lastTag}..HEAD --oneline`, { encoding: 'utf8' }).trim().split('\n');

    const features = [];
    const fixes = [];
    const breaking = [];
    const other = [];

    commits.forEach(commit => {
      const msg = commit.substring(8); // Remove commit hash

      if (msg.startsWith('feat:') || msg.startsWith('✨')) {
        features.push(msg.replace(/^(feat:|✨)\s*/, ''));
      } else if (msg.startsWith('fix:') || msg.startsWith('🐛')) {
        fixes.push(msg.replace(/^(fix:|🐛)\s*/, ''));
      } else if (msg.includes('BREAKING CHANGE') || msg.startsWith('💥')) {
        breaking.push(msg);
      } else if (!msg.startsWith('chore:') && !msg.startsWith('docs:')) {
        other.push(msg);
      }
    });

    let notes = `## What's New in v${version}\n\n`;

    if (breaking.length > 0) {
      notes += `### ⚠️ Breaking Changes\n`;
      breaking.forEach(item => notes += `- ${item}\n`);
      notes += '\n';
    }

    if (features.length > 0) {
      notes += `### ✨ New Features\n`;
      features.forEach(item => notes += `- ${item}\n`);
      notes += '\n';
    }

    if (fixes.length > 0) {
      notes += `### 🐛 Bug Fixes\n`;
      fixes.forEach(item => notes += `- ${item}\n`);
      notes += '\n';
    }

    if (other.length > 0) {
      notes += `### 📦 Other Changes\n`;
      other.forEach(item => notes += `- ${item}\n`);
      notes += '\n';
    }

    // Add installation instructions
    notes += `### 📥 Installation\n\n`;
    notes += `**HACS (Recommended):**\n`;
    notes += `1. Open HACS → Frontend\n`;
    notes += `2. Search for "Advanced Card"\n`;
    notes += `3. Install and restart Home Assistant\n\n`;

    notes += `**Manual:**\n`;
    notes += `1. Download \`my-advanced-card.js\` from assets below\n`;
    notes += `2. Place in \`/config/www/\`\n`;
    notes += `3. Add resource in Home Assistant\n\n`;

    notes += `### 🔍 Verification\n`;
    notes += `- **Version:** ${version}\n`;
    notes += `- **Compatibility:** Home Assistant 2023.4+\n`;
    notes += `- **HACS:** Compatible\n`;

    return notes;

  } catch (error) {
    console.error('Error generating release notes:', error);
    return `## Release v${version}\n\nNew version with improvements and fixes.`;
  }
}

if (require.main === module) {
  const version = process.argv[2];
  if (!version) {
    console.error('Usage: node generate-release-notes.js <version>');
    process.exit(1);
  }

  console.log(generateReleaseNotes(version));
}

module.exports = generateReleaseNotes;
