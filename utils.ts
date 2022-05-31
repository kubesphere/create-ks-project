import fs from 'fs';
import validateProjectName from 'validate-npm-package-name';
import chalk from 'chalk';
import path from 'path';

export function makeDir(root: string, options = { recursive: true }): Promise<void> {
  return fs.promises.mkdir(root, options);
}

export async function isWriteable(directory: string): Promise<boolean> {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function validateNpmName(name: string): {
  valid: boolean;
  problems?: string[];
} {
  const nameValidation = validateProjectName(name);
  if (nameValidation.validForNewPackages) {
    return { valid: true };
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  };
}

export function getPkgManager(): string {
  return 'yarn';
}

export function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'LICENSE',
    'Thumbs.db',
    'docs',
    'mkdocs.yml',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
  ];

  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validFiles.includes(file))
    // Support IntelliJ IDEA-based editors
    .filter(file => !/\.iml$/.test(file));

  if (conflicts.length > 0) {
    console.log(`The directory ${chalk.green(name)} contains files that could conflict:`);
    console.log();
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(file)}/`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log('Either try using a new directory name, or remove the files listed above.');
    console.log();
    return false;
  }

  return true;
}
