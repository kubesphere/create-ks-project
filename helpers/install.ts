/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';
import spawn from 'cross-spawn';
import got from 'got';
import tar from 'tar';
import { Stream } from 'stream';
import { promisify } from 'util';
import cliProgress from 'cli-progress';
// import type { PackageManager } from './get-pkg-manager';

const pipeline = promisify(Stream.pipeline);

interface InstallArgs {
  /**
   * Indicate whether to install packages using npm, pnpm or Yarn.
   */
  packageManager: string;
  /**
   * Indicate whether there is an active Internet connection.
   */
  isOnline: boolean;
  /**
   * Indicate whether the given dependencies are devDependencies.
   */
  devDependencies?: boolean;
}

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export function install(
  root: string,
  dependencies: string[] | null,
  { packageManager, isOnline, devDependencies }: InstallArgs,
): Promise<void> {
  /**
   * (p)npm-specific command-line flags.
   */
  const npmFlags: string[] = [];
  /**
   * Yarn-specific command-line flags.
   */
  const yarnFlags: string[] = [];
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise((resolve, reject) => {
    let args: string[];
    let command = packageManager;
    const useYarn = packageManager === 'yarn';

    if (dependencies && dependencies.length) {
      /**
       * If there are dependencies, run a variation of `{packageManager} add`.
       */
      if (useYarn) {
        /**
         * Call `yarn add --exact (--offline)? (-D)? ...`.
         */
        args = ['add', '--exact', '--ignore-workspace-root-check'];
        if (!isOnline) args.push('--offline');
        args.push('--cwd', root);
        if (devDependencies) args.push('--dev');
        args.push(...dependencies);
      } else {
        /**
         * Call `(p)npm install [--save|--save-dev] ...`.
         */
        args = ['install', '--save-exact'];
        args.push(devDependencies ? '--save-dev' : '--save');
        args.push(...dependencies);
      }
    } else {
      /**
       * If there are no dependencies, run a variation of `{packageManager}
       * install`.
       */
      args = ['install'];
      if (!isOnline) {
        console.log(chalk.yellow('You appear to be offline.'));
        if (useYarn) {
          console.log(chalk.yellow('Falling back to the local Yarn cache.'));
          console.log();
          args.push('--offline');
        } else {
          console.log();
        }
      }
    }
    /**
     * Add any package manager-specific flags.
     */
    if (useYarn) {
      args.push(...yarnFlags);
    } else {
      args.push(...npmFlags);
    }
    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });
        return;
      }
      resolve();
    });
  });
}

export function installFromCache(root: string): any {
  console.log(chalk.yellow('Installing packages from cache...'));
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(100, 0);
  const downStream = got.stream('https://ks-deps.gd2.qingstor.com/deps.tar.gz');

  downStream.on('downloadProgress', progress => {
    bar.update(progress.percent * 100);
  });

  return pipeline(downStream, tar.extract({ cwd: root }));
}
