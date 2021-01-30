import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  MenuItem,
  shell,
  dialog,
} from "electron";
import { generateMenu } from "./libs/menu";
import { parse } from "./libs/args";
import { options } from "./libs/options";
import * as path from "path";
const args = parse();
const allowed = ["js", "json", "md", "txt", "mlog"];
console.log(args);
const keys = [
  { key: "enter", ctrl: true, shift: false, alt: false, message: "run" },
  { key: "l", ctrl: true, shift: false, alt: false, message: "clear" },
  { key: "s", ctrl: true, shift: false, alt: true, message: "format" },
  { key: "e", ctrl: true, shift: true, alt: false, message: "showFile" },
];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) app.quit();

const createWindow = (): void => {
  // Create the browser window.
  const win = new BrowserWindow({
    height: 400,
    width: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    show: false,
  });

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "window/index.html"));

  win.once("ready-to-show", () => {
    if (args.file) {
      // (ab)use openRecent
      win.webContents.send("openRecent", args.file);
    }
    win.show();
  });

  win.webContents.on("before-input-event", (e, input) => {
    for (const i of keys) {
      if (
        input.key.toLowerCase() === i.key &&
        i.ctrl === (input.control || input.meta) &&
        i.shift === input.shift &&
        i.alt === input.alt
      ) {
        e.preventDefault();

        win.webContents.send("menu", i.message);
      }
    }
  });

  const menu = generateMenu(win, args.options);
  menu.append(
    new MenuItem({
      label: "help",
      role: "help",
      click: (): void => showHelp(win),
    })
  );

  Menu.setApplicationMenu(menu);

  ipcMain.on("updateRecent", (e) => {
    const recent = menu.getMenuItemById("recent");
    for (let i = 0; i < recent.submenu.items.length; i++)
      recent.submenu.items[i].visible = false;
    recent.submenu.items = [];
    for (const file of options.recent) {
      recent.submenu.append(
        new MenuItem({
          label: path.basename(file),
          click: (): void => win.webContents.send("openRecent", file),
        })
      );
    }
  });

  ipcMain.on("showFile", (e, file) => {
    shell.showItemInFolder(file);
  });
};

function showHelp(parent): void {
  const help = new BrowserWindow({
    height: 350,
    width: 350,
    show: false,
    parent,
    modal: true,
  });

  help.loadFile(path.join(__dirname, "window/help.html"));
  help.setMenu(null);

  help.once("ready-to-show", () => {
    help.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
