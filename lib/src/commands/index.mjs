import { createMetaTags } from "./create-meta-tags/create-meta-tags.mjs";
import { extractDownloadTranslate } from "./extract-download-translate/extract-download-translate.mjs";
import { extractUploadTranslate } from "./extract-upload-translate/extract-upload-translate.mjs";

export const COMMANDS = {
  "extract-upload-translate": extractUploadTranslate,
  "extract-download-translate": extractDownloadTranslate,
  "create-meta-tags": createMetaTags,
};
