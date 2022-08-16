# Create KS Ext

Heavily inspired by create-next-app and create-react-app. This CLI tool can help you quickly setting up a KubeSphere extension project.
You don't need to install or configure tools like webpack, Babel, TypeScript, etc. Just run the command and your project will be ready to go.

## Prerequisites
- Access to a Unix-based operating system, such as Linux, MacOS or
  [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)
- `curl` or `wget` installed
- Node.js [Active LTS Release](https://nodejs.org/en/about/releases/) installed using one of these
  methods:
    - Using `nvm` (recommended)
        - [Installing nvm](https://github.com/nvm-sh/nvm#install--update-script)
        - [Install and change Node version with nvm](https://nodejs.org/en/download/package-manager/#nvm)
    - [Binary Download](https://nodejs.org/en/download/)
    - [Package manager](https://nodejs.org/en/download/package-manager/)
- `yarn` [Installation](https://classic.yarnpkg.com/en/docs/install)
- `git` [installation](https://github.com/git-guides/install-git)
- Ensure the ports 8000 and 8001 is available for the local environment, we use the two ports for the bff server and webpack-dev-server.

## Install

Run the command:
```
yarn create ks-ext
```
The wizard will ask you the directory name(default is `my-app`) to be installed in. and create the directory in the current directory.
Inside that directory, it will generate the initial project structure and install the dependencies.

It might take a little while, but as soon as the message below, you can go to the next step.
```shell
Success! Created my-ext at /Users/chenzhen/Workspace/qingcloud/create-ks-app/dist/my-ext
Inside that directory, you can run several commands:

  yarn create:ext
    Create a new extension.

  yarn dev
    Starts the development server.

  yarn build:dll
    Builds the dll files.

  yarn build:prod
    Builds the app for production.

  yarn start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd my-ext
  yarn create:ext

And

  yarn dev

```

## Create your KubeSphere extension

Switch to the directory you just created and run the command:
```
yarn create:ext
```

the wizard will ask you the extension name, displayName, description and author.

```shell
$ ksc create:ext
? Extension Name demo
? Display Name Demo
? Description this is demo
? Author chenzhen
? Language JavaScript
? Ensure to create extension: [demo] ? Yes
✨  Done in 12.64s.
```
Then the extension will be created in the `extensions` directory. The files structure of the extension is as follows:

```shell
.
├── Dockerfile
├── README.md
├── package.json
└── src
    ├── App.jsx
    ├── index.js
    ├── locales
    │   ├── en
    │   │   ├── base.json
    │   │   └── index.js
    │   ├── index.js
    │   └── zh
    │       ├── base.json
    │       └── index.js
    └── routes
        └── index.js

```

## Run development environment

1. Edit the local_config.yaml file in the `configs` directory. Replace the apiServer value with the real value

```shell
server:
  apiServer:
    url: http://apiserver.local
    wsUrl: ws://apiserver.local
```
2. run the dev

```shell    
yarn dev
```
And open the browser to http://localhost:8000/, you will see the kubesphere page. 
for more information about the development environment, please refer to the [development documentation](https://kubesphere-dev-guide.netlify.app/extension-dev-guide)
