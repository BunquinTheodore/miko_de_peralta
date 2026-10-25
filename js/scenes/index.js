// Concatenates the five scene modules in film order.
import { scenes as boot } from "./boot.js";
import { scenes as about } from "./about.js";
import { scenes as experience } from "./experience.js";
import { scenes as toolkit } from "./toolkit.js";
import { scenes as work } from "./work.js";

export function buildAll(C, P) {
  return [...boot(C, P), ...about(C, P), ...experience(C, P), ...toolkit(C, P), ...work(C, P)];
}
