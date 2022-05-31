// https://github.com/vercel/next.js/blob/canary/packages/create-next-app/create-app.ts
import chalk from 'chalk';
import cpy from 'cpy';
// import fs from 'fs';
// import os from 'os';
import path from 'path';
import { isWriteable, makeDir, isFolderEmpty } from './utils';
import packageJson from './template/package.json';
import { install } from './helpers/install';
import { tryGitInit } from './helpers/git';

export async function createApp({
  appPath,
  packageManager,
}: {
  appPath: string;
  packageManager: string;
}): Promise<void> {
  const root = path.resolve(appPath);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    );
    console.error('It is likely you do not have write permissions for this folder.');
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === 'yarn';
  const originalDirectory = process.cwd();

  console.log();
  console.log(`Creating a new KS app in ${chalk.green(root)}.`);
  console.log();

  process.chdir(root);

  await cpy('**', root, {
    parents: true,
    cwd: path.join(__dirname, 'template'),
  });

  const installFlags = { packageManager, isOnline: true };

  const dependencies: string[] = Object.keys(packageJson.dependencies).map(key => {
    // @ts-ignore
    return `${key}@${packageJson.dependencies[key]}`;
  });
  if (dependencies.length) {
    console.log();
    console.log('Installing dependencies:');
    for (const dependency of dependencies) {
      console.log(`- ${chalk.cyan(dependency)}`);
    }
    console.log();

    await install(root, dependencies, installFlags);
  }

  const devDependencies: string[] = Object.keys(packageJson.devDependencies).map(key => {
    // @ts-ignore
    return `${key}@${packageJson.devDependencies[key]}`;
  });
  if (devDependencies.length) {
    console.log();
    console.log('Installing devDependencies:');
    for (const devDependency of devDependencies) {
      console.log(`- ${chalk.cyan(devDependency)}`);
    }
    console.log();

    const devInstallFlags = { devDependencies: true, ...installFlags };
    await install(root, devDependencies, devInstallFlags);
  }

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.');
    console.log();
  }

  let cdpath: string;
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(
    chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}create-plugin <plugin-name>`),
  );
  console.log('    Create a new plugin.');
  console.log();
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build:dll`));
  console.log('    Builds the dll files.');
  console.log();
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build:prod`));
  console.log('    Builds the app for production.');
  console.log();
  console.log(chalk.cyan(`  ${packageManager} start`));
  console.log('    Runs the built app in production mode.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(
    `  ${chalk.cyan(`${packageManager} ${useYarn ? '' : 'run '}create-plugin <plugin-name>`)}`,
  );
  console.log();
  console.log('And');
  console.log();
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`));
  console.log();
}
