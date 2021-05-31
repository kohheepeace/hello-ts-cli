# hello-ts-cli tutorial
This github repository explains how to create a node cli tool with typescript and publish it as a npm (yarn) package.


## 📌Create yarn package

```sh
mkdir hello-ts-cli
cd hello-ts-cli
yarn init -y
```

## 📌Install Typescript in your project
To use typescript, let's install `typescript`.

```sh
yarn add typescript --dev
```
https://www.typescriptlang.org/download


## 📌Make first ts file
Make `src` folder and `cli.ts` inside it.

`src/cli.ts`
```ts
#!/usr/bin/env node

console.log("Hello World");
```

- [`#!/usr/bin/env node` is needed for making node.js cli tool.](https://stackoverflow.com/questions/33509816/what-exactly-does-usr-bin-env-node-do-at-the-beginning-of-node-files)
- [filename convention: `cli.ts`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin)

## 📌Typescript compile command
Let's check basic typescript command.

https://www.typescriptlang.org/docs/handbook/compiler-options.html
### ✔`tsc`

`tsc` is the command to compile the Typescript code.

```sh
yarn tsc src/cli.ts
```
This command creates `src/cli.js`.
### ✔`tsc --watch`
Automatically compile `ts` files when you make a change.
```sh
tsc src/index.ts --watch
```

## 📌`tsconfig.json`
https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
### ✔What is `tsconfig.json` ?
- Specify compile options
- Indicates that the directory is the root of a TypeScript project
- You can specify which files to compile and which files to exclude (**you don't need to specify each files to compile**).

### ✔Make `tsconfig.json`
```
yarn tsc --init
```
to create the `tsconfig.json` file.
### ✔Use Recommended `tsconfig.json` settings
📝In the beginning, you may not know what settings to use, so let's extend the recommended settings.

This time, we will use the recommended settings for `node14`.

https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases

`terminal`
```sh
yarn add -D @tsconfig/node14
```

Then,

`tsconfig.json`
```json
{
  "extends": "@tsconfig/node14/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### ✔ Add `rootDir`
Set the `rootDir` to `src` since `ts` files are only stored under the `src` directory.

`tsconfig.json`
```json
{
  "extends": "@tsconfig/node14/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"],
}
```

Ref: https://www.typescriptlang.org/tsconfig#rootDir


### ✔ Change output dir
- Change the output destination of the compiled `.ts` file to `lib`.
- Also, add exclude `lib` in `tsconfig.json`.
```json
{
  "extends": "@tsconfig/node14/tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib",
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib"],
}
```

[Ref: Naming Conventions of `lib`](https://stackoverflow.com/questions/39553079/difference-between-lib-and-dist-folders-when-packaging-library-using-webpack#:~:text=3%20Answers&text=Usually%20the%20dist%20folder%20is,npm%20will%20consume%20that%20directly)

## 📌Add `@types/node`
If you compile the file in this state, you will get the following error.

`terminal`
```sh
$ yarn tsc # thanks to `tsconfig.json`, you don't need to specify target ts files now.
Cannot find name 'console'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.

1 console.log("Hello World");
  ~~~~~~~
```

This is caused by the lack of `node` types. So, you can add
```sh
yarn add -D @types/node
```

Ref: https://github.com/microsoft/TypeScript/issues/9545


## 📌Add `main` and `bin` to `package.json`

`package.json`
```json
{
	"name": "hello-ts-cli",
	"version": "1.0.0",
	"main": "lib/cli.js",
	"bin": {
		"hello-ts-cli": "lib/cli.js"
	},
	"license": "MIT",
	"devDependencies": {
		"@tsconfig/node14": "^1.0.0",
		"@types/node": "^15.6.1",
		"typescript": "^4.3.2"
	},
	"dependencies": {
		"chalk": "^4.1.1",
		"commander": "^7.2.0"
	}
}
```
`main`: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main

`bin`: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin

## 📌Run cli scripts
Now we are ready to run the cli command. Let's install the current folder into `npm` global.

`terminal`
```sh
npm i -g .
```

Now you can use the `hello-ts-cli` command specified in `package.json`.

`terminal`
```sh
$ hello-ts-cli
Hello World
```

❗Don't forget to uninstall after finishing this tutorial.
```
npm uninstall -g .
```

## 📌Terminal Text Coloring
https://github.com/chalk/chalk

```sh
yarn add chalk
```

`src/cli.ts`
```ts
#!/usr/bin/env node
import chalk from "chalk";
console.log(chalk.blue("Hello World"));
```

```sh
yarn tsc
hello-ts-cli
```

## 📌Accept Args
https://github.com/tj/commander.js/

```
yarn add commander
```

I will use this example

https://github.com/tj/commander.js/#action-handler

```ts
#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
	.arguments("<name>")
	.option("-t, --title <honorific>", "title to use before name")
	.option("-d, --debug", "display some debugging")
	.action((name, options, command) => {
		if (options.debug) {
			console.error("Called %s with options %o", command.name(), options);
		}
		const title = options.title ? `${options.title} ` : "";
		console.log(chalk.blue(`Hello ${title}${name}`));
	});

program.parse();
```

Then compile and run command with options

```sh
$ yarn tsc
$ hello-ts-cli World --title="Super"
Hello Super World
```

## 📌Publish Yarn Package
1. [Create an npm account](https://www.npmjs.com/signup) 

Then,

```sh
# git tagging before publish
$ git tag v1.0.0
$ git push origin v1.0.0

# publish package
$ yarn publish
```

## 📌Update yarn package
```sh
$ yarn version
...
# Type new version here
question New version: 1.0.1
```
`yarn version` automatically creates new git tag.

```sh
$ git tag -l
v1.0.0
v1.0.1

# So, just push new version to remote
git push origin v1.0.1
```

## Refs
- https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
- https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
- https://www.digitalocean.com/community/tutorials/typescript-new-project
- https://itnext.io/how-to-create-your-own-typescript-cli-with-node-js-1faf7095ef89