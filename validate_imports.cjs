const fs = require('fs')
const path = require('path')

const srcDir = path.resolve(__dirname, 'src')
const aliases = {
  '@': srcDir,
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}

const allFiles = getAllFiles(srcDir).filter((f) => f.endsWith('.vue') || f.endsWith('.js'))
let errorsFound = 0

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8')
  const dir = path.dirname(file)

  // Basic regex for imports
  const importRegex = /import\s+.*\s+from\s+['"](.+)['"]/g
  let match

  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1]
    let resolvedPath = ''

    if (importPath.startsWith('@/')) {
      resolvedPath = path.join(srcDir, importPath.substring(2))
    } else if (importPath.startsWith('.')) {
      resolvedPath = path.resolve(dir, importPath)
    } else {
      // Skip node_modules
      continue
    }

    // Try with .vue, .js, or as a directory with index.js
    const extensions = ['', '.vue', '.js', '/index.js', '/index.vue']
    let exists = false
    for (const ext of extensions) {
      if (fs.existsSync(resolvedPath + ext) && !fs.statSync(resolvedPath + ext).isDirectory()) {
        exists = true
        break
      }
    }

    if (!exists) {
      console.log(`Error in ${path.relative(__dirname, file)}: Cannot find ${importPath}`)
      errorsFound++
    }
  }
})

if (errorsFound === 0) {
  console.log('No broken imports found!')
} else {
  console.log(`Found ${errorsFound} broken imports.`)
}
