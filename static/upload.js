// Получаем корневой элемент документа
// const rootElement = document.documentElement;
// const dragBg = document.querySelector('.dragBg');
const dragUpload = document.querySelector('.dragUpload');
const fileListElement = document.getElementById('file-list')

// Получаем элемент input, куда хотим добавить файлы
const fileInput = document.getElementById('upload-file'); // Измените ID на нужный
// Предотвращаем действие по умолчанию для событий dragover и dragenter
dragUpload.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dragUpload.addEventListener('dragenter', (event) => {
  event.preventDefault();
  // dragBg.classList.remove('none');
  dragUpload.classList.add('bg-primary');
  console.log('Drag enter event:', event);

});

dragUpload.addEventListener('dragleave', (event) => {
  console.log('Drag leave event:', event);
  if (!dragUpload.contains(event.relatedTarget)) {
    console.log('Leaving the drag area');
      console.log('Adding "none" class');
      // dragBg.classList.add('none');
    dragUpload.classList.remove('bg-primary');
  }
});
dragUpload.addEventListener('drop', (event) => {
  event.preventDefault();
  // dragBg.classList.add('none');
  dragUpload.classList.remove('bg-primary');

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    // Устанавливаем выбранные файлы в элемент input
    let filteredFileDataTransfer = new DataTransfer()
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 100 * 1024 * 1024) {
        filteredFileDataTransfer.items.add(files[i]);
      }
    }

    fileInput.files = filteredFileDataTransfer.files;

    // Обновляем список файлов на странице
    updateFileList(files);

    // Обработка перетащенных файлов
    console.log('Перетащенные файлы:', files);
  }
});

document.getElementById('upload-file').addEventListener('change', function () {
  let files = this.files;
  updateFileList(files)
});
// Функция для обновления списка файлов на странице
function updateFileList(files) {
  let output = '';
  for (let i = 0; i < files.length; i++) {
    output += files[i].name + '<br>';
  }
  fileListElement.setAttribute('data-none', 'false');
  fileListElement.innerHTML = `Chosen files: <br/> ${output}`;
}
