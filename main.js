const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("Database is connected.");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS students(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        score INTEGER,
        status TEXT)
    `);

ipcMain.handle("sendData", async (event, arg) => {
  const { name, score, status } = arg;
  try {
     await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO students (name,score,status) VALUES (?,?,?)`,
          [name, score, status],
          (error) => {
            if (error) {
              reject()
            } else {
              resolve()
            }
          }
        );
      });
      const newUser = {name,score,status}
      return {success: true, message: "Data inserted successfully.", newData: newUser }
  } catch (error) {
    return {success: false, message: "Something went wrong in saving process." }
  }
  
});

ipcMain.handle("getData", async (event, arg) => {
  return await new Promise((resolve, reject) => {
    db.all(`SELECT id,name,score,status FROM students`, [], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
});
ipcMain.handle("editData", (event, arg) => {
  const id = arg;
  ipcMain.handle("updateData", (event, arg) => {
    console.log(arg);
  });
});

const createWindow = () => {
  const display = screen.getPrimaryDisplay().workAreaSize;
  const { width, height } = display;

  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
