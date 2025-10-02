import { useLocaliseStrategy } from "./localise.strategy.mjs";
import { useRuntimeStrategy } from "./runtime.strategy.mjs";

export const EXTRACT_DOWNLOAD_TRANSLATE_STRATEGIES = {
  localise: useLocaliseStrategy,
  runtime: useRuntimeStrategy
}