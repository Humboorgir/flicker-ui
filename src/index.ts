#!/usr/bin/env node

import { Command } from "commander";
import init from "./commands/init";
import add from "./commands/add";
import list from "./commands/list";

const program = new Command();

// TODO: update components to their latest version and work on the website
program.name("flicker-ui").description("Simple CLI to copy premade react components").version("0.3.3");

program.addCommand(init).addCommand(add).addCommand(list);

program.parse();
