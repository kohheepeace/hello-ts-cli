#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
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
