# Create KubeSphere Extension Console Project

Heavily inspired by create-next-app and create-react-app, this CLI tool can help you quickly set up The console part of a KubeSphere extension project.
You don't need to install or configure tools like webpack, Babel, TypeScript, etc. Just run the command shown as the following and your project will be ready to go.

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

## Getting Started

Run the command:

```shell
yarn create ks-project frontend
```

The wizard will create the project `frontend` in the current directory.
Inside that folder, it will generate the initial project structure and install the dependencies.

It might take a little while, but as soon as the message similar as below, you can go to the next step.

```shell
Success! The project frontend is created at /Users/chenzhen/kubesphere-extensions/frontend
Inside the directory, you can run the following commands:

  yarn create:ext
    Creates a new extension.

  yarn dev
    Starts the development server.

  yarn build:prod
    Builds the app for production to use.

  yarn start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd frontend
  yarn create:ext

And

  yarn dev

```

## Options

`create-ks-project` comes with the following option:

* -f, --fast-mode: Install dependencies from a tarball.

## Create your KubeSphere extension

Switch to the directory you just created and run the command:

```shell
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
? Are you sure you want to create extension: [demo] ? Yes
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
