import { throwInvalidStrategyError } from "../../errors/errors.mjs";
import { EXTRACT_DOWNLOAD_TRANSLATE_STRATEGIES } from "./strategies/index.mjs";

export function extractDownloadTranslate(commandArgs) {
  const isExistStrategy = commandArgs.strategy in EXTRACT_DOWNLOAD_TRANSLATE_STRATEGIES;

  if(isExistStrategy) {
    const strategy = EXTRACT_DOWNLOAD_TRANSLATE_STRATEGIES[commandArgs.strategy];

    strategy(commandArgs);
  } else {
    throwInvalidStrategyError(commandArgs.strategy, Object.keys(EXTRACT_DOWNLOAD_TRANSLATE_STRATEGIES));
  }
}


