import fs from 'fs'
import path from 'path'


const cnname: any = {
  rename: 'The file name has been modified',
  change: 'The content of the file has been modified'
}
let isFileChangeEventScheduled = false;

export function watchDirectory(directoryPath: string, fn: Function) {
  handleChange(null, null, fn)
  fs.readdir(directoryPath, { withFileTypes: true }, (error, files) => {
    if (error) {
      console.error(`Error reading directory: ${error}`)
      return ''
    }
    
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file.name)

      fs.lstat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error retrieving file stats: ${err}`)
          return ''
        }
        
        if (stats.isDirectory()) {
          watchDirectory(filePath, fn)
        } else {

          fs.watch(filePath, { recursive: false }, (eventType, filename) => handleChange(eventType, filename, fn))
        }
      })
    })
  })
}

function handleChange(eventType: any, filename: any, fn: Function) {
  if (isFileChangeEventScheduled) {
    return;
  }

  isFileChangeEventScheduled = true;

  setTimeout(() => {
    eventType && console.log(`${filename}: ${cnname[eventType]}`)
    fn()

    isFileChangeEventScheduled = false;
  }, 500)
  
}