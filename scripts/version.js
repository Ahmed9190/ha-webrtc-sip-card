import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VersionManager {
  constructor() {
    this.versionFile = path.join(__dirname, '../version.json');
    this.packageFile = path.join(__dirname, '../package.json');
    this.hacsFile = path.join(__dirname, '../hacs.json');
    this.manifestFile = path.join(__dirname, '../manifest.json');
    this.constantsFile = path.join(__dirname, '../src/constants.ts');
  }

  getCurrentVersion() {
    const version = JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));
    return version;
  }

  updateVersion(type = 'patch') {
    const version = this.getCurrentVersion();
    const [major, minor, patch] = version.version.split('.').map(Number);

    let newVersion;
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    // Update version.json
    version.version = newVersion;
    version.build += 1;
    fs.writeFileSync(this.versionFile, JSON.stringify(version, null, 2));

    // Update package.json
    const pkg = JSON.parse(fs.readFileSync(this.packageFile, 'utf8'));
    pkg.version = newVersion;
    fs.writeFileSync(this.packageFile, JSON.stringify(pkg, null, 2));

    // Update constants.ts
    const constants = fs.readFileSync(this.constantsFile, 'utf8');
    const updatedConstants = constants.replace(/(export const CARD_VERSION = ")[^"]+(")/, `$1${newVersion}$2`);
    fs.writeFileSync(this.constantsFile, updatedConstants);

    // Update manifest.json
    const manifest = JSON.parse(fs.readFileSync(this.manifestFile, 'utf8'));
    manifest.version = newVersion;
    fs.writeFileSync(this.manifestFile, JSON.stringify(manifest, null, 2));

    console.log(`Version updated to ${newVersion}`);
    return newVersion;
  }

  validateVersion() {
    const version = this.getCurrentVersion();
    const pkg = JSON.parse(fs.readFileSync(this.packageFile, 'utf8'));

    if (version.version !== pkg.version) {
      throw new Error('Version mismatch between version.json and package.json');
    }

    console.log(`Version ${version.version} validated`);
    return true;
  }
}

export default VersionManager;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const vm = new VersionManager();
  const command = process.argv[2];

  switch (command) {
    case 'bump':
      vm.updateVersion(process.argv[3] || 'patch');
      break;
    case 'validate':
      vm.validateVersion();
      break;
    default:
      console.log('Usage: node version.js [bump|validate] [major|minor|patch]');
  }
}
