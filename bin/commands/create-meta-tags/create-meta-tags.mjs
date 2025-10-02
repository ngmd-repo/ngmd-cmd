import {
  existsSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { extname, join } from "node:path";

const DEFAULT_ARGS = {
  input: "index.html", // * Имя .html файла, который нужно размножить
  root: null, // * Путь к директории, где лежит .html файл, который нужно размножить
  tags: null, // * Теги через запятую, которыми будут называться файлы {tag-name}.html и в которые будет добавлен в секцию <head><meta name="${tag-name}"></head>
};

export function createMetaTags(commandArgs) {
  commandArgs = Object.assign(DEFAULT_ARGS, commandArgs);

  validateParams(commandArgs);

  const { input: htmlFileName, root } = commandArgs;
  const pathToHtml = join(root, htmlFileName);
  const tags = parseTags(commandArgs.tags);

  createTagsFiles(pathToHtml, root, tags);
  addMetaTags(root, tags);
  unlinkSync(pathToHtml);
}

function validateParams({ input, root, tags }) {
  try {
    validateInputHtml(input);
    validateRoot(root);
    modifiedAndValidateTags(tags);
  } catch (e) {
    throw new Error(e);
  }
}

function validateRoot(root) {
  if (!existsSync(root))
    throw "Invalid 'root' parameter. Use correct path to directory";
}

function validateInputHtml(fileName) {
  const isHtmlFile = extname(fileName) === ".html";

  if (!isHtmlFile)
    throw "Is invalid 'fileName' parameter. File must have .html extension";
}

function modifiedAndValidateTags(tags) {
  if (!tags) throw "Tags is required parameter";
  if (!parseTags(tags).length)
    throw "Is invalid 'tags' parameter. Valid example: --tags=some,meta,tags";
}

function parseTags(tags) {
  return tags.split(",").map((item) => item.trim());
}

function createTagsFiles(pathToHtml, directory, tags) {
  tags.forEach((tag) =>
    copyFileSync(pathToHtml, join(directory, `${tag}.html`))
  );
}

function addMetaTags(directory, tags) {
  tags.forEach((tag) => {
    const pathToFile = join(directory, `${tag}.html`);
    const htmlWithoutTag = readFileSync(pathToFile, "utf-8");
    const html = insertMetaTagToHtml(htmlWithoutTag, tag);

    writeFileSync(pathToFile, html, "utf-8");
  });
}

function insertMetaTagToHtml(html, tag) {
  const template = metaTagTemplate(tag);

  return html.replace("</head>", `\n${template}\n</head>`);
}

function metaTagTemplate(tagName) {
  return `<meta name="page" content="${tagName}">`;
}
