import { readdirSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs"

const DEFAULT_ARGS = {
  'entry': 'locale', // * Путь к разахивированной папке
  'locale-filename': 'translations.json', // * Название файла в папке с локалью в выгруженном архиве
  'output-path': 'translate', // * Путь к директории, куда положить файл с экстрактом переводов
  'output-filename': 'index.ts', // * Название файла, куда сделать экстракт архива. Файл ляжет по пути: output-path/output-filename
  'translate-map-name': 'TranslateDB', // * Название для константы с мапой переводов в файле экстракта (output-filename)
}

function checkArchiveFolder(pathToArchive) {
  const isExistArchiveFolder = existsSync(pathToArchive);

  if(!isExistArchiveFolder) {
    const errorMessage = `Path "${pathToArchive}" to translates archive is invalid. Please use correct path to unzip folder.`;

    console.error(errorMessage);

    throw new Error(`Incorrect path`);
  }
}

function extractArchiveToJSONTranslateMap(pathToArchive, localeFileName) {
  checkArchiveFolder(pathToArchive);

  const locales = readdirSync(pathToArchive);
  const translateMap = locales.reduce((accum, locale) => {
    const pathToLocaleFile = `${pathToArchive}/${locale}/${localeFileName}`;
    const localeTranslateMap = readFileSync(pathToLocaleFile, { encoding: 'utf-8' });

    accum[locale] = JSON.parse(localeTranslateMap);

    return accum;
  }, {})

  return translateMap
}

function translateFileTemplate(jsonTranslateMap, translateMapName) {
  return `export const ${translateMapName} = ${JSON.stringify(jsonTranslateMap, null, 2)} as const;`
}

function createTranslateTSFile(jsonTranslateMap, args) {
  const fileContents = translateFileTemplate(jsonTranslateMap, args['translate-map-name']);
  const filePath = `${args['output-path']}/${args['output-filename']}`;
  const isExistDir = existsSync(args['output-path']);
  const isExistFile = existsSync(filePath);

  if(isExistFile) unlinkSync(filePath);
  if(!isExistDir) mkdirSync(args['output-path'], { recursive: true });

  writeFileSync(filePath, fileContents)
}

export function useLocaliseStrategy(commandArgs) {
  const args = Object.assign({}, DEFAULT_ARGS, commandArgs);
  const jsonTranslateMap = extractArchiveToJSONTranslateMap(args.entry, args['locale-filename']);

  createTranslateTSFile(jsonTranslateMap, args);
}