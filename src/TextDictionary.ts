const TextDictionary:ITextDictionary = {
    en: {
        lang: 'English',
        title: 'File manager',
        upload: {
            title: 'Upload new file',
            choose: 'Choose file',
            upload: 'Upload',
        },
        files: {
            title: 'Your files',
            newFolder: 'Create new folder',
            noFiles:'No files here'
        },
        contextmenu:{
            open: 'Open',
            rename: 'Rename',
            delete: 'Delete',
        }
    },
    uk: {
        lang: 'Українська',
        title: 'Файловий провідник',
        upload: {
            title: 'Завантажити новий файл',
            choose: 'Вибрати файл',
            upload: 'Завантажити',
        },
        files: {
            title: 'Ваші файли',
            newFolder: 'Створити нову папку',
            noFiles:'Тут немає файлів'
        },
        contextmenu:{
            open: 'Відкрити',
            rename: 'Перейменувати',
            delete: 'Видалити',
        }
    },
    ru: {
        lang: 'Русский',
        title: 'Проводник файлов',
        upload: {
            title: 'Загрузить новый файл',
            choose: 'Выбрать файл',
            upload: 'Загрузить',
        },
        files: {
            title: 'Ваши файлы',
            newFolder: 'Создать новую папку',
            noFiles:'Здесь нет файлов'
        },
        contextmenu:{
            open: 'Открыть',
            rename: 'Переименовать',
            delete: 'Удалить',
        }
    },
    sk: {
        lang: 'Slovenčina',
        title: 'Správca súborov',
        upload: {
            title: 'Nahrať nový súbor',
            choose: 'Vybrať súbor',
            upload: 'Nahrať',
        },
        files: {
            title: 'Vaše súbory',
            newFolder: 'Vytvoriť novú zložku',
            noFiles:'Žiadne súbory tu'
        },
        contextmenu:{
            open: 'Otvoriť',
            rename: 'Premenovať',
            delete: 'Vymazať',
        }
    }
}
interface ITextDictionary {
    en: ITDItem
    ru: ITDItem
    uk: ITDItem
    sk: ITDItem
}

interface IUpload {
    title: string
    choose:string
    upload: string
}
interface IFiles {
    title: string
    newFolder: string
    noFiles:string
}
interface IContextMenu{
    open: string
    rename: string
    delete: string
}
interface ITDItem {
    lang: string
    title:string
    upload: IUpload
    files: IFiles
    contextmenu: IContextMenu
}
export default TextDictionary
