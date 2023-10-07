import fs from "fs"
import path from "path"

export const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "../../", filePath)
  fs.unlink(filePath, (err) => console.log(err))
}
