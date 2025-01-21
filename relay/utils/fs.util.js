import fs from "fs";

export function checkDatabaseRoute(filePath) {
  console.log("file: ", filePath);
  if (!fs.existsSync(filePath)) {
    // Create the file if it doesn't exist
    fs.writeFileSync(filePath, "", "utf8");
    console.log(`File created: ${filePath}`);
  } else {
    console.log(`File exists: ${filePath}`);
  }

  return filePath;
}
