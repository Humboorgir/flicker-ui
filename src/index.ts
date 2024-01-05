#!/usr/bin/env node

import { Command } from "commander";
import add from "./commands/add";
import list from "./commands/list";

const program = new Command();

program.name("flicker-ui").description("Simple CLI to copy premade react components").version("1.0.0");

program.addCommand(add).addCommand(list);

program.parse();
