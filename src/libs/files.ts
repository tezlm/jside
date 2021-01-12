import { join } from "path";
import * as fs from "fs";
import { remote } from "electron";
const dataDir = remote.app.getPath("userData");
const sketchPath = join(dataDir, "sketch.js");
const filesDir = join(dataDir, "files");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir, { recursive: true });
if (!fs.existsSync(sketchPath)) fs.writeFileSync(sketchPath, "");

export function saveSketch(value): void {
  fs.writeFileSync(sketchPath, value);
}

export function loadSketch(): string {
  return fs.readFileSync(sketchPath, "utf8");
}

export function saveFile(path, value): void {
  fs.writeFileSync(path, value);
}

export function openFile(path): string {
  return fs.readFileSync(path, "utf8");
}

export function fileOpen(): string[] {
  return remote.dialog.showOpenDialogSync({
    title: "open file",
    properties: ["openFile"],
    filters: [{ name: "js", extensions: ["js"] }],
    defaultPath: filesDir,
  });
}

export function fileSave(): string {
  return remote.dialog.showSaveDialogSync({
    title: "save file",
    filters: [{ name: "js", extensions: ["js"] }],
    defaultPath: filesDir,
  });
}
