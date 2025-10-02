import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises"
import { join } from "node:path"
import { createHash } from "node:crypto"

const DEFAULT_ARGS = {
  entry: 'locale', // * Путь к распакованной папке
  'locale-filename': 'translations.json', // * Имя файла в локальной папке из распакованного архива
  'output-path': 'assets/i18n', // * Путь к директории, куда будут помещены переименованные файлы
}

function validateSourceDirectory(path) {
  if (!existsSync(path)) {
    console.error(`Error: Directory "${path}" does not exist`);
    process.exit(1);
  }
}

async function cleanSourceDir(path) {
  if (existsSync(path)) {
    await rm(path, { recursive: true, force: true });
  }
}

async function prepareOutputDir(outputPath) {
  if (!existsSync(outputPath)) await mkdir(outputPath, { recursive: true });
}

async function getAvailableLocales(entryPath) {
  return await readdir(entryPath);
}

async function copyLocaleFile(entryPath, locale, localeFilename, outputPath) {
  const path = join(entryPath, locale, localeFilename);
  const outputFile = join(outputPath, `${locale}.json`);

  if (!existsSync(path)) {
    console.warn(`Warning: Locale file not found for "${locale}" at "${path}"`);
    return null;
  }

  const content = await readFile(path, 'utf-8');

  await writeFile(outputFile, content);

  return outputFile;
}

async function createVersionFile(path) {
  try {
    const files = await readdir(path);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (!jsonFiles.length) {
      console.error('Error: No JSON files found in the output directory');
      process.exit(1);
    }

    const hash = createHash('sha256');
    
    for (const file of jsonFiles) {
      const content = await readFile(join(path, file), 'utf-8');
      hash.update(content);
    }

    const hashValue = hash.digest('hex');
    const version = hashValue.slice(0, 8);
    
    const versionData = {
      version,
      hash: hashValue,
      timestamp: new Date().toISOString()
    };

    await writeFile(
      join(path, 'version.json'),
      JSON.stringify(versionData, null, 2)
    );
  } catch (error) {
    console.error('Error creating version file:', error);
    process.exit(1);
  }
}

export async function useRuntimeStrategy(commandArgs) {
  const args = Object.assign({}, DEFAULT_ARGS, commandArgs);

  validateSourceDirectory(args.entry);

  await prepareOutputDir(args['output-path']);

  const locales = await getAvailableLocales(args.entry);
  const copyPromises = locales.map(locale =>
    copyLocaleFile(
      args.entry,
      locale,
      args['locale-filename'],
      args['output-path']
    )
  );

  await Promise.all(copyPromises);
  await createVersionFile(args['output-path']);
  await cleanSourceDir(args.entry);

  console.log(`Locale files processing completed`);
}