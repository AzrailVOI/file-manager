// Получаем корневой элемент документа
const rootElement = document.documentElement;
const dragBg = document.querySelector('.dragBg');
const fileListElement = document.getElementById('file-list')

// Получаем элемент input, куда хотим добавить файлы
const fileInput = document.getElementById('upload-file'); // Измените ID на нужный
// Предотвращаем действие по умолчанию для событий dragover и dragenter
rootElement.addEventListener('dragover', (event) => {
  event.preventDefault();
});

rootElement.addEventListener('dragenter', (event) => {
  event.preventDefault();
    dragBg.classList.remove('none');
});

rootElement.addEventListener('dragleave', (event) => {
  console.log('Drag leave event:', event);
  if (!rootElement.contains(event.relatedTarget)) {
    console.log('Leaving the drag area');
      console.log('Adding "none" class');
      dragBg.classList.add('none');
  }
});
rootElement.addEventListener('drop', (event) => {
  event.preventDefault();
  dragBg.classList.add('none');
  rootElement.style.backgroundColor = 'transparent';

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    // Устанавливаем выбранные файлы в элемент input
    fileInput.files = files;

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
