const [...draggables] = document.querySelectorAll('.draggable')
console.log(draggables)
let currentDraggable = null;
draggables.forEach(draggable => {
    // Обработчики для перетаскивания дивов
    draggable.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', 'draggable'); // Устанавливаем данные о перетаскивании
        event.dataTransfer.setData('id', event.target.id); // Записываем ID перетаскиваемого дива
        currentDraggable = draggable;
        console.log('dragstart', currentDraggable);
    });

    draggable.addEventListener('dragend', () => {
        currentDraggable = null;
    });

// Обработчики для определения перетащенного дива
    draggable.addEventListener('dragover', (event) => {
        event.preventDefault(); // Предотвращаем действие по умолчанию
    });
    draggable.addEventListener('drop', async (event) => {
        event.preventDefault(); // Предотвращаем действие по умолчанию
        const targetItem = event.target; // Получаем целевой элемент
        // Логика обработки перетаскиваемого дива и целевого элемента
        // console.log("DND", currentDraggable, targetItem);

        const currentTagLink = currentDraggable.querySelector('a')
        const targetFolder = targetItem.getAttribute('data-type') === 'folder' ? targetItem.getAttribute('href').replace('uploads/', '') : null

        const currentLink = currentTagLink.getAttribute('data-type') === 'file' ? currentTagLink.getAttribute('href') : null

        const currentFile = currentLink ? await getFile(currentLink) : null

        if (targetFolder && currentFile){
            console.log('Move', currentLink, 'in folder', targetFolder)
            console.log('File', currentFile)
            moveFileToFolder(currentFile, currentLink.replace('uploads/', ''), targetFolder)
        }

    });
})

async function moveFileToFolder(file, fileName, folder) {
    try {
        const newFile = new File([file.data], fileName, { type: 'text/plain' });
        const formData = new FormData()
        formData.append('current_file', newFile)
        const uploadInFolder = await axios.post('/move/'+location.pathname.replace('/uploads/', '')+folder, formData, {
            params: {
                fileName
            }
        })
        if (uploadInFolder.status === 201) {
            console.log('File moved')
            location.reload()
        }
    }catch (e) {

    }

}

async function getFile(link){
    return await axios.get(link)
}
