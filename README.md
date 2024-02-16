# File manager
ExpressJS + Typescript + PUG

## Description
A simple file manager created using ExpressJS, Typescript and PUG.

SSL support implemented

### Allows:
- upload files (by button and using drag and drop)
- create folders
- rename and delete files and folders (right mouse button on file or folder)

### Implemented in 4 languages: 
- English
- Ukrainian
- Russian
- Slovak. 

You can add new translations in the file along the path `src/TextDictionary.ts`

### Structure
- SSL certificate and key in the folder `certs` (`cert.pem` and `key.pem` files)
- The PUG file is located in the folder `views`
- Styles, scripts and everything public in the folder `static`


### .env options
**NODE_ENV** - **dev** or **prod** (for development or production mode)

**SYSTEM** - **win** or **lin** (for correct processing of routes to Windows and Linux systems, respectively)

**PORT** - port number for the HTTP server

**SSL_PORT** - port number for the HTTPS server

**NOT_DELETABLE_FOLDERS** - list of names of files and folders not available for deletion (separator: **$\*\*$**)

**MODE** - **ssl**, **httpOnly** or **full** (for HTTPS only, HTTP only or both protocols mode, respectively)

### Example .env file
````
NODE_ENV=dev
SYSTEM=win
PORT=5000
SSL_PORT=5020
NOT_DELETABLE_FOLDERS=Important_folder$**$Do_not_delete
MODE=full
````
# Quick start

Download the git repository
```sh
git clone https://github.com/AzrailVOI/file-manager.git
```
Go to the project folder
```sh
cd file-manager
```
Install dependencies
```sh
pnpm install
```
Create a folder `uploads`
```sh
mkdir uploads
```
Create a folder `certs` with `cert.pem` and `key.pem` files, if you want to use SSL

Launch
- In development mode
```sh
pnpm dev
```
- In standard mode
```sh
pnpm start
```
Build to folder `build`
```sh
pnpm build
```
