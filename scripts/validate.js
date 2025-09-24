import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class BuildValidator {
  constructor(options = {}) {
    this.strict = options.strict || false;
    this.distPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../dist');
    this.srcPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../src');
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📋',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌'
    }[type] || 'ℹ️';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  error(message) {
    this.errors.push(message);
    this.log(message, 'error');
  }

  warning(message) {
    this.warnings.push(message);
    this.log(message, 'warning');
  }

  success(message) {
    this.log(message, 'success');
  }

  // Check if required build files exist
  validateBuildFiles() {
    this.log('Validating build files...');

    const requiredFiles = [
      'ha-webrtc-sip-card.js',
      'ha-webrtc-sip-card-editor.js'
    ];

    const optionalFiles = [
      'manifest.json'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(this.distPath, file);
      if (!fs.existsSync(filePath)) {
        this.error(`Required build file missing: ${file}`);
      } else {
        this.success(`Found required file: ${file}`);
      }
    });

    optionalFiles.forEach(file => {
      const filePath = path.join(this.distPath, file);
      if (fs.existsSync(filePath)) {
        this.success(`Found optional file: ${file}`);
      } else {
        this.warning(`Optional file missing: ${file}`);
      }
    });
  }

  // Validate JavaScript syntax and structure
  validateJavaScript() {
    this.log('Validating JavaScript files...');

    const jsFiles = ['ha-webrtc-sip-card.js', 'ha-webrtc-sip-card-editor.js'];

    jsFiles.forEach(file => {
      const filePath = path.join(this.distPath, file);

      if (!fs.existsSync(filePath)) {
        this.error(`Cannot validate ${file}: file not found`);
        return;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check file size
        const sizeMB = (content.length / 1024 / 1024).toFixed(2);
        if (content.length > 5 * 1024 * 1024) { // 5MB limit
          this.error(`${file} is too large: ${sizeMB}MB (max 5MB)`);
        } else {
          this.success(`${file} size OK: ${sizeMB}MB`);
        }

        // Check for basic syntax issues
        if (content.includes('undefined') && !content.includes('typeof undefined')) {
          this.warning(`${file} contains 'undefined' references`);
        }

        // Check for console.log in production
        if (process.env.NODE_ENV === 'production' && content.includes('console.log')) {
          this.warning(`${file} contains console.log statements in production build`);
        }

        // Check for custom element registration - look for class definitions and custom element patterns
        if (file.includes('card.js')) {
          const hasClassDefinition = content.includes('class ') && (content.includes('WebRTCSipCard') || content.includes('extends LitElement'));
          const hasCustomElementPattern = content.includes('customElement') || content.includes('customElements');
          
          if (!hasClassDefinition && !hasCustomElementPattern) {
            this.error(`${file} missing customElements.define registration`);
          }
        }

        // Check for proper export/import structure
        if (!content.includes('class ') && !content.includes('function ')) {
          this.warning(`${file} may not contain proper class or function definitions`);
        }

        this.success(`${file} JavaScript validation passed`);

      } catch (error) {
        this.error(`${file} validation failed: ${error.message}`);
      }
    });
  }

  // Validate HACS compliance
  validateHACS() {
    this.log('Validating HACS compliance...');

    // Check hacs.json exists and is valid
    const hacsPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../hacs.json');
    if (!fs.existsSync(hacsPath)) {
      this.error('hacs.json file is missing');
      return;
    }

    try {
      const hacsConfig = JSON.parse(fs.readFileSync(hacsPath, 'utf8'));

      // Required HACS fields
      const requiredFields = ['name', 'filename'];
      requiredFields.forEach(field => {
        if (!hacsConfig[field]) {
          this.error(`hacs.json missing required field: ${field}`);
        }
      });

      // Validate filename matches actual file
      if (hacsConfig.filename) {
        const expectedFile = path.join(this.distPath, hacsConfig.filename);
        if (!fs.existsSync(expectedFile)) {
          this.error(`HACS filename "${hacsConfig.filename}" does not match built file`);
        } else {
          this.success(`HACS filename validation passed`);
        }
      }

      // Check for recommended fields
      const recommendedFields = ['render_readme', 'zip_release', 'hide_default_branch'];
      recommendedFields.forEach(field => {
        if (hacsConfig[field] === undefined) {
          this.warning(`hacs.json missing recommended field: ${field}`);
        }
      });

      this.success('HACS configuration validation passed');

    } catch (error) {
      this.error(`hacs.json validation failed: ${error.message}`);
    }
  }

  // Validate README and documentation
  validateDocumentation() {
    this.log('Validating documentation...');

    const readmePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../README.md');
    if (!fs.existsSync(readmePath)) {
      this.error('README.md is missing');
      return;
    }

    const content = fs.readFileSync(readmePath, 'utf8');

    // Check for required sections
    const requiredSections = [
      '# ', // Title
      '## Installation',
      '## Configuration',
      '## Features'
    ];

    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        this.warning(`README.md missing recommended section: ${section.replace('#', '').trim()}`);
      }
    });

    // Check for HACS badge
    if (!content.includes('hacs') && !content.includes('HACS')) {
      this.warning('README.md missing HACS badge or reference');
    }

    // Check for example configuration
    if (!content.includes('``````yml') && !content.includes('```yaml')) {
      this.warning('README.md missing YAML configuration examples');
    }

    this.success('Documentation validation completed');
  }

  // Validate version consistency
  validateVersions() {
    this.log('Validating version consistency...');

    const files = {
      'package.json': path.join(path.dirname(new URL(import.meta.url).pathname), '../package.json'),
      'version.json': path.join(path.dirname(new URL(import.meta.url).pathname), '../version.json'),
      'hacs.json': path.join(path.dirname(new URL(import.meta.url).pathname), '../hacs.json')
    };

    const versions = {};

    Object.entries(files).forEach(([name, filePath]) => {
      if (fs.existsSync(filePath)) {
        try {
          const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          // Only include files that have a version field
          if (config.version !== undefined) {
            versions[name] = config.version;
          }
        } catch (error) {
          this.error(`Failed to read version from ${name}: ${error.message}`);
        }
      }
    });

    // Check if all versions match
    const versionValues = Object.values(versions);
    const uniqueVersions = [...new Set(versionValues)];

    if (uniqueVersions.length > 1) {
      this.error(`Version mismatch found: ${JSON.stringify(versions)}`);
    } else if (uniqueVersions.length === 1) {
      this.success(`All versions consistent: ${uniqueVersions[0]}`);
    } else {
      this.warning('No version information found');
    }
  }

  // Validate file permissions and structure
  validateFileStructure() {
    this.log('Validating file structure...');

    // Check .hacsignore exists
    const hacsIgnorePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../.hacsignore');
    if (!fs.existsSync(hacsIgnorePath)) {
      this.warning('.hacsignore file is missing (recommended for clean HACS installation)');
    } else {
      this.success('.hacsignore file found');
    }

    // Check LICENSE file exists
    const licensePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../LICENSE');
    if (!fs.existsSync(licensePath)) {
      this.warning('LICENSE file is missing (required for public distribution)');
    } else {
      this.success('LICENSE file found');
    }

    // Validate dist folder permissions
    if (fs.existsSync(this.distPath)) {
      const stats = fs.statSync(this.distPath);
      if (!stats.isDirectory()) {
        this.error('dist path exists but is not a directory');
      } else {
        this.success('dist directory structure valid');
      }
    } else {
      this.error('dist directory is missing');
    }
  }

  // Calculate and validate checksums
  validateChecksums() {
    this.log('Validating file checksums...');

    const jsFiles = ['ha-webrtc-sip-card.js', 'ha-webrtc-sip-card-editor.js'];
    const checksums = {};

    jsFiles.forEach(file => {
      const filePath = path.join(this.distPath, file);

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        checksums[file] = hash;
        this.success(`${file} checksum: ${hash.substring(0, 8)}...`);
      }
    });

    // Save checksums for CI/CD
    const checksumPath = path.join(this.distPath, 'checksums.json');
    fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
    this.success('Checksums saved to checksums.json');
  }

  // Run security checks
  validateSecurity() {
    this.log('Running security validation...');

    const jsFiles = ['ha-webrtc-sip-card.js', 'ha-webrtc-sip-card-editor.js'];

    jsFiles.forEach(file => {
      const filePath = path.join(this.distPath, file);

      if (!fs.existsSync(filePath)) return;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for potentially dangerous patterns
      const dangerousPatterns = [
        { pattern: /eval\s*\(/g, message: 'eval() usage detected' },
        { pattern: /Function\s*\(/g, message: 'Function constructor usage detected' },
        { pattern: /innerHTML\s*=/g, message: 'innerHTML assignment detected (potential XSS)' },
        { pattern: /document\.write/g, message: 'document.write usage detected' },
        { pattern: /\.outerHTML\s*=/g, message: 'outerHTML assignment detected' }
      ];

      dangerousPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(content)) {
          if (this.strict) {
            this.error(`${file}: ${message}`);
          } else {
            this.warning(`${file}: ${message}`);
          }
        }
      });
    });

    this.success('Security validation completed');
  }

  // Main validation runner
  async validate() {
    this.log('🔍 Starting comprehensive validation...');

    const startTime = Date.now();

    // Run all validations
    this.validateBuildFiles();
    this.validateJavaScript();
    this.validateHACS();
    this.validateDocumentation();
    this.validateVersions();
    this.validateFileStructure();
    this.validateChecksums();
    this.validateSecurity();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Summary
    this.log(`\n📊 Validation Summary (${duration}s):`);

    if (this.errors.length > 0) {
      this.log(`❌ Errors: ${this.errors.length}`, 'error');
      this.errors.forEach(error => this.log(`  • ${error}`, 'error'));
    }

    if (this.warnings.length > 0) {
      this.log(`⚠️  Warnings: ${this.warnings.length}`, 'warning');
      this.warnings.forEach(warning => this.log(`  • ${warning}`, 'warning'));
    }

    if (this.errors.length === 0) {
      this.log(`✅ All validations passed!`, 'success');
      if (this.warnings.length === 0) {
        this.log(`🎉 Perfect score! No warnings.`, 'success');
      }
    }

    // Exit with appropriate code
    if (this.errors.length > 0) {
      process.exit(1);
    } else if (this.strict && this.warnings.length > 0) {
      this.log('Strict mode: treating warnings as errors', 'error');
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');

  const validator = new BuildValidator({ strict });
  validator.validate().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

export default BuildValidator;    
