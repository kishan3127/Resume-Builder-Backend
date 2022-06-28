const fs = require("fs");
const path = require("path");
const DIR = path.join(__dirname, "logger", "logs");

function create(name, data) {
  fs.writeFileSync(name, data);
}

function remove(name) {
  fs.unlinkSync(name);
}

function listDir(path, callback) {
  return fs.readdirSync(path, async (error, file) => {
    if (error) return error;
    return file;
  });
}

function append(name, data) {
  try {
    fs.appendFileSync(name, data);
    return "Appended";
  } catch (error) {
    return error;
  }
}

function rename(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath);
    return "Renamed";
  } catch (error) {
    return error;
  }
}

module.exports = {
  create,
  remove,
  listDir,
  append,
  rename,
};
