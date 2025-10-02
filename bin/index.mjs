#!/usr/bin/env node
import { COMMANDS } from "./commands/index.mjs";
import { wrapAsync } from "./utils/async-handler.mjs";

function extractArguments(argsArray) {
  const reg =
    /^--(?<commandName>[a-zA-Z0-9-_]+)\s?[=]{1}\s?(?<commandValue>[a-zA-Z0-9-_/.,]+)$/;
  const args = argsArray
    .filter((arg) => reg.test(arg))
    .reduce((accum, arg) => {
      const { commandName, commandValue } = arg.match(reg).groups;

      accum[commandName] = commandValue;

      return accum;
    }, {});

  return args;
}

function run() {
  const commandArgsMap = extractArguments(process.argv);
  const { command } = commandArgsMap;
  const isExistCommand = command in COMMANDS;

  if (isExistCommand) {
    const commandHandler = COMMANDS[command];

    wrapAsync(commandHandler)(commandArgsMap);
  } else {
    const errorMessage = `Command "${command}" doesn't exist. Available commands: ${Object.keys(
      COMMANDS
    ).join(", ")}`;

    console.error(errorMessage);
    process.exit(1);
  }
}

run();
