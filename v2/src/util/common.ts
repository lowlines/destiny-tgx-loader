import * as fs from "fs";
import fetch from "node-fetch";
import * as path from "path";

export function getFile(url: string, isJson: boolean = true): Promise<any> {
  // console.log(`GET ${url}`);
  return fetch(url, {}).then(res => (isJson ? res.json() : res.arrayBuffer()));
}

export function mkdirs(folderPath: string) {
  folderPath.split(path.sep).reduce((currentPath, folder) => {
    currentPath += folder + path.sep;
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
    return currentPath;
  }, "");
}

export function mkpath(filePath: string) {
  mkdirs(path.dirname(filePath));
}

export function dumpFile(path: string, data: any, isRaw: boolean = false) {
  //   console.log(path.replace(tmpPath, ""));
  mkpath(path);
  fs.writeFileSync(path, isRaw ? data : JSON.stringify(data, null, "  "));
}
