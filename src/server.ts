import express, { Express, Request, Response } from 'express'
import * as http from 'http'
import morgan from 'morgan'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import spdy from 'spdy'
import TextDictionary from "./TextDictionary.js";

dotenv.config()

const app: Express = express()
const httpServer = http.createServer(app)

async function main() {
  if (process.env.NODE_ENV !== 'dev') {
    app.use(morgan('dev'))
  }

  const PORT = process.env.PORT || 5000
  const SSL_PORT = process.env.SSL_PORT || 5020

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  const __dirname = path.resolve()

  let currentDir = ''
  let lang = 'en'

  const uploads = path.join(__dirname, '/uploads/')
  const certs = path.join(__dirname, '/certs/')



  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const custom = req.params[0]
      // console.log('CUSTOM', custom, '\n', uploads)
      cb(null, custom ? uploads + custom : uploads)
    },
    filename: function (req, file, cb) {
      const origName = Buffer.from(file.originalname, 'latin1').toString('utf8')
      cb(null, origName.includes('index.html') || origName.includes('index.htm') ? origName + '_' : origName) // сохраняем оригинальное имя файла
    },
  })

  app.use('/uploads', express.static(path.join(__dirname, '/uploads/')))
  app.use('/static', express.static(path.join(__dirname, '/static/')))

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const catalog = getFilesInDirectory(uploads, true)
      console.log(catalog)
      console.log('lang', lang, Object.keys(TextDictionary))
      res.render('manager', {
        files: catalog,
        isRoot: true,
        currentPath: '',
        TextDictionary: TextDictionary,
        lang: lang,
        langCodes: Object.keys(TextDictionary)
      })
    }),
  )

  app.get(
    '/uploads/*',
    asyncHandler(async (req: Request, res: Response) => {
      console.log('RQ', req.params[0])
      if (!req.params[0]) res.redirect('/')
      const catalog = getFilesInDirectory(uploads + (req.params[0] ? req.params[0].slice(0, -1) : ''), false)
      console.log(catalog)
      currentDir = req.params[0]
      res.render('manager', {
        files: catalog,
        isRoot: false,
        currentPath: req.params[0],
        TextDictionary: TextDictionary,
        lang: lang,
        langCodes: Object.keys(TextDictionary)
      })
    }),
  )

  const upload = multer({ storage: storage })

  app.post('/upload/*', upload.array('input_file'), (req, res) => {
    console.log('FN', req?.body)
    console.log('FF', req?.file?.filename, req?.file?.fieldname)
    // res.status(201).json({ message: 'File uploaded.' })
    res.redirect(req.params[0] ? `/uploads/${req.params[0]}` : '/')
  })

  app.post('/move/*', upload.array('current_file'), (req, res) => {
    if (req.query.fileName) {
      deleteFiles(req.query.fileName as string, res, uploads, currentDir)
    }
    // res.status(201).json({ message: 'File moved.' })

    // res.status(201).json({ message: 'File moved.' })
  })

  app.post('/newFolder', (req, res) => {
    console.log(req.body)
    if (req.body.folderName) {
      if (!fs.existsSync(uploads + currentDir + req.body.folderName)) {
        fs.mkdirSync(uploads + currentDir + req.body.folderName)
        res.status(201).json({ message: 'Folder created.' })
      } else res.status(400).json({ message: 'File or folder already exists.' })
    }
  })

  app.put('/rename', (req, res) => {
    console.log(req.body)
    if (req.body.newName) {
      if (!fs.existsSync(uploads + currentDir + req.body.newName)) {
        fs.renameSync(uploads + currentDir + req.body.oldName, uploads + currentDir + req.body.newName)
        res.status(201).json({ message: 'Folder renamed.' })
      } else res.status(400).json({ message: 'File or folder already exists.' })
    }
  })

  app.delete('/delete', (req, res) => {
    console.log(req.body)
    console.log("NDF", ('/' + process.env.NOT_DELETABLE_FOLDERS?.toString().split('$**$')), '\n', req.body.fileName,!('/' + process.env.NOT_DELETABLE_FOLDERS?.toString().split('$**$')).includes(req.body.fileName.replace('/', '')))
    deleteFiles(req.body.fileName, res, uploads, currentDir)
  })

  app.put('/lang', (req, res) => {
    console.log(req.body)
    lang = req.body.lang
    res.status(201).json({ message: 'Language changed.' })
  })


  if (process.env.MODE === 'ssl'){
    const options = {
      key: fs.readFileSync(path.join(certs, 'key.pem')),
      cert: fs.readFileSync(path.join(certs, 'cert.pem')),
    }
    spdy.createServer(options, app).listen(SSL_PORT, () => {
      console.log('HTTP/2 server is running on port ' + SSL_PORT)
    })
  }else if (process.env.MODE === 'httpOnly'){
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  }else{
    const options = {
      key: fs.readFileSync(path.join(certs, 'key.pem')),
      cert: fs.readFileSync(path.join(certs, 'cert.pem')),
    }
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
    spdy.createServer(options, app).listen(SSL_PORT, () => {
      console.log('HTTP/2 server is running on port ' + SSL_PORT)
    })
  }

}

main()

function getFilesInDirectory(directoryPath: string, isRoot: boolean, filesList: string[] = []) {
  if (process.env.SYSTEM === 'win') {
    directoryPath = directoryPath.replace(/\//g, '\\')
  }
  const files = fs.readdirSync(directoryPath)
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      // Добавляем пустую папку в список с меткой :directory
      filesList.push(filePath)
    } else {
      // Добавляем файл в список
      filesList.push(filePath)
    }
  })
  console.log('FD', filesList, directoryPath)
  return filesList.map((file) => {
    const relativePath = (isRoot ? '/' : '') + file.replace(directoryPath, '').replace(/\\/g, '/')
    // Если это папка, добавляем метку :directory
    if (fs.statSync(file).isDirectory()) {
      return relativePath + ':directory'
    } else {
      return relativePath
    }
  })
}

function deleteFiles(fileName:string, res:Response, uploads:string, currentDir:string) {
  const isDeletable = !process.env.NOT_DELETABLE_FOLDERS?.toString().split('$**$').some(folder => fileName.endsWith(folder));
  if (fileName && isDeletable) {
    const filePath = path.join(uploads, currentDir, fileName)
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isDirectory()) {
        // Если это каталог, удаляем его рекурсивно
        fs.rmdirSync(filePath, { recursive: true })
        res.status(201).json({ message: 'Directory deleted.' })
      } else {
        // Если это файл, удаляем его
        fs.unlinkSync(filePath)
        res.status(201).json({ message: 'File deleted.' })
      }
    } else {
      res.status(400).json({ message: 'File or folder not found.' })
    }
  } else {
    res.status(400).json({ message: 'File or folder cannot be deleted' })
  }
}
