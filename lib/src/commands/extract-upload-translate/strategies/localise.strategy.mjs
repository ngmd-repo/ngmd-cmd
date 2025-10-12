import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const DEFAULT_ARGS = {
  'entry': 'translate/index.ts', // * Путь к .ts файлу с мапой переводов 
  'upload-locale': 'en', // * Какую локаль забрать из файла entry
  'output-path': 'translate/', // * Путь, куда положить экстракт из файла entry
  'output-filename': 'translations.json', // * Название файла с экстрактом (расширение файла обязательно). Файл ляжет по пути: output-path/output-filename
}

function getTranslateDB(entry) {
  const isValidEntry = existsSync(entry);

  if(isValidEntry) return readFileSync(entry, { encoding: 'utf-8' });

  const errorMessage = `Invalid "entry" parameter. Please use correct path to translate file.`;

  console.error(errorMessage)

  throw new Error("Incorrect path to file")
}

function convertToJSONFormat(fileContent, locale) {
  fileContent = fileContent.trim()
  const trimStart = fileContent.replace(/^.+?{/, '{');
  const trimEnd = trimStart.replace(/}.+$/, '}');
  const translateMap = eval(`(${trimEnd})`);
  const isExistLocale = locale in translateMap;

  if(isExistLocale) return translateMap[locale]

  const errorMessage = `Locale "${locale}" doesn't exist. Please use available locales: ${Object.keys(translateMap)}`;

  console.error(errorMessage)

  throw new Error(`Invalid locale`);
}

function createTranslateJSONFile(path, filename, jsonTranslateMap) {
  const isExistDir = existsSync(path);

  if(!isExistDir) mkdirSync(path, { recursive: true });
  
  writeFileSync(`${path}/${filename}`, JSON.stringify(jsonTranslateMap, null, 2))
}

export function useLocaliseStrategy(commandArgs) {
  const args = Object.assign({}, DEFAULT_ARGS, commandArgs);
  const fileContent = getTranslateDB(args.entry);
  const jsonTranslateMap = convertToJSONFormat(fileContent, args['upload-locale']);

  createTranslateJSONFile(args['output-path'], args['output-filename'], jsonTranslateMap)
}

