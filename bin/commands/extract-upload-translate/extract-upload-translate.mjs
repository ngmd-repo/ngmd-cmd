import { throwInvalidStrategyError } from '../../errors/errors.mjs';
import { EXTRACT_UPLOAD_TRANSLATE_STRATEGIES } from './strategies/index.mjs'


export function extractUploadTranslate(commandArgs) {
  const isExistStrategy = commandArgs.strategy in EXTRACT_UPLOAD_TRANSLATE_STRATEGIES;

  if(isExistStrategy) {
    EXTRACT_UPLOAD_TRANSLATE_STRATEGIES[commandArgs.strategy](commandArgs);
  } else {
    throwInvalidStrategyError(commandArgs.strategy, Object.keys(EXTRACT_UPLOAD_TRANSLATE_STRATEGIES));
  }
}


