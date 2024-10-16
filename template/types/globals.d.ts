type ExtensionMenuParent =
  | 'topbar'
  | 'global'
  | 'toolbox'
  | 'access'
  | 'cluster'
  | 'workspace'
  | 'project'
  | 'platformSettings';

interface ExtensionAction {
  actionType?:
    | 'url-router'
    | 'url-current-tab'
    | 'url-new-tab'
    | 'url-new-window'
    | 'v3-modal'
    | 'modal'
    | 'sheet';
  actionValue?: string;
}

interface ExtensionMenu extends ExtensionAction {
  parent: ExtensionMenuParent;
  name: string;
  link?: string;
  title: string;
  icon?: string;
  order?: number;
  desc?: string;
  skipAuth?: boolean;
  authKey?: string;
  authAction?: string;
  children?: ExtensionMenu[];
  ksModule?: string;
  clusterModule?: string;
  workspaceModule?: string;
}

interface Extension {
  routes?: Record<string, any>[];
  routesByPatch?: Record<string, any>[];
  menus?: ExtensionMenu[];
  locales?: Record<string, any>;
  isCheckLicense?: boolean;
  events?: Record<string, any>;
}

interface Options {
  isSkipLicenseCheck?: boolean;
  extensionName?: string;
}

interface GlobalsConfig {
  kubesphereEdition?: 'ks' | 'kse' | undefined;
  isKsEdition?: boolean;
  isKseEdition?: boolean;
  importRemoteExtensions?: {
    includes?: string[];
    excludes?: string[];
  };
  [key: string]: any;
}

interface Globals {
  currentCluster?: string;
  config: GlobalsConfig;
  manifest: Record<string, string>;
  ksConfig: Record<string, any>;
  licenseInfo: {
    formattedLicenses: Record<string, any>[];
  };
  user: Record<string, any>;
  runtime: string;
  clusterRole: string;
  installedExtensions: {
    name: string;
    extensionName: string;
    link: string;
    resourceVersion: string;
  }[];
  context: {
    events: Record<string, any>;
    routes: Record<string, any>[];
    routesByPatch: Record<string, any>;
    injectionPoints: Record<string, any>;
    locales: Record<string, any>;
    registerLocales: (locales: Record<string, any> | undefined) => void;
    registerExtension: (extension: Extension, options?: Options) => void;
    registerExtensions: (extensions: Extension[], options?: Options) => void;
  };
  emitter: {
    all: any;
    on: any;
    off: any;
    emit: any;
  };
  run?: () => Promise<void>;
  clusterConfig?: Record<string, any>;
  theme: Record<string, string>;
  useDefaultTheme: boolean;
  defaultTheme: Record<string, string>;
  // TODO 新增别名
  workspacesAliasName: Record<string, string>;
  projectAliasName: Record<string, Record<string, string>>;
  clustersAliasName: Record<string, string>;
  userAliasName: Record<string, string>;
  platformRolesAliasName: Record<string, string>;
  ignoreSubRouteChange?: boolean;
}

interface TFunction {
  (key: string | string[], options?: Record<string, any>): string;

  (key: string | string[], defaultValue?: string, options?: Record<string, any>): string;
}

interface Window {
  readonly globals: Globals;
  readonly t: TFunction;
}

declare const globals: Globals;
declare const t: TFunction;
// eslint-disable-next-line @typescript-eslint/naming-convention
