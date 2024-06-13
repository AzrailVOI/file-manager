lucide.createIcons()

async function newFolder() {
  const input = document.createElement('input')
  input.type = 'text'
  input.dataset.type = 'new_folder'
  input.value = 'New folder' // Устанавливаем значение

  const li = document.createElement('li')
  const span = document.createElement('span')
  span.classList.add('fileLink')
  span.classList.add('newFolderRename')

  span.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="folder" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>
  `
  span.appendChild(input) // Добавляем input внутрь span
  li.appendChild(span) // Добавляем span внутрь li
  document.querySelector('ul').appendChild(li) // Добавляем li внутрь ul

  // Добавляем задержку для фокусировки и выделения текста
  setTimeout(() => {
    input.focus()
    input.select()
  }, 0)

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      newFolderReq(input, span)
    }
  })
  document.addEventListener('click', function (event) {
    const isClickInside =
      input.contains(event.target) ||
      span.contains(event.target) ||
      document.getElementById('new_folder').contains(event.target)
    if (!isClickInside) {
      console.log('new folder')
      input.classList.add('opacity-0')
      input.style.top = 0 + 'px'
      input.style.left = 0 + 'px'
      // clicked_btn.parentNode.parentNode.innerHTML = orig_btn.outerHTML
      newFolderReq(input, span)
    }
  })
}

document.getElementById('new_folder').addEventListener('click', newFolder)

let clicked_btn = ''
document.querySelectorAll('.fileLink').forEach((link) => {
  link.addEventListener('contextmenu', function (event) {
    event.preventDefault()
    let menu = document.getElementById('contextmenu')
    menu.style.top = event.clientY + 'px'
    menu.style.left = event.clientX + 'px'
    menu.classList.remove('opacity-0')
    console.log('menu')
    clicked_btn = event.target.tagName === 'svg' ? event.target.parentNode : event.target
    console.log(clicked_btn)

    document.addEventListener('click', function (event) {
      const isClickInside = menu.contains(event.target)
      if (!isClickInside) {
        menu.classList.add('opacity-0')
        menu.style.top = 0 + 'px'
        menu.style.left = 0 + 'px'
        // clicked_btn.parentNode.parentNode.innerHTML = orig_btn.outerHTML
      }
    })
  })
})

document.querySelectorAll('.contextmenuoption').forEach((option) => {
  option.addEventListener('click', async function (message) {
    option.parentElement.classList.add('opacity-0')
    option.parentElement.style.top = 0 + 'px'
    option.parentElement.style.left = 0 + 'px'
    const selectedLang = await getLang()

    switch (option.dataset.opt) {
      case 'open':
        location.href = clicked_btn.getAttribute('href')
        break

      case 'rename':
        const input = document.createElement('input')
        input.type = 'text'
        input.dataset.type = 'rename'
        input.value = clicked_btn.innerText
        console.log(clicked_btn.parentNode)
        const span = clicked_btn.parentNode
        span.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="folder" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>
            `
        span.appendChild(input)
        span.classList.add('newFolderRename')
        input.focus()
        input.select()

        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            renameFile(input, span)
          }
        })

        document.addEventListener('click', function (event) {
          const isClickInside = span.contains(event.target) || option.contains(event.target)
          if (!isClickInside) {
            console.log('clicked outside')
            span.classList.add('opacity-0')
            span.style.top = 0 + 'px'
            span.style.left = 0 + 'px'
            renameFile(input, span)
            // clicked_btn.parentNode.parentNode.innerHTML = orig_btn.outerHTML
          }
        })

        break

      case 'delete':
        try {
          let currentDir = location.pathname
          const res = await axios.delete('/delete', {
            data: { fileName: clicked_btn.innerText, currentDir },
          })
          if (res.status === 201) {
            location.reload()
          }
        } catch (e) {
          if (e.response.status === 400) {
            vanillaToast.error(e.response.data.message) // Вывод текста ошибки
          }
        }
        break
      case 'copy':
        //copy link
        const relativeLink = clicked_btn.getAttribute('href')
        if (relativeLink) {
          const fullLink = decodeURI(new URL(relativeLink, window.location.href).href);
          try {
            await navigator.clipboard.writeText(fullLink)

            console.log('lang', selectedLang)
            switch (selectedLang) {
              case 'en':
                vanillaToast.success('Link copied')
                break
              case 'ru':
                vanillaToast.success('Ссылка скопирована')
                break
              case 'uk':
                vanillaToast.success('Посилання скопійовано')
                break
              case 'sk':
                vanillaToast.success('Odkaz skópirován')
                break
              default:
                vanillaToast.success('Link copied')
            }
          } catch (err) {
            vanillaToast.error('Не вдалося скопіювати\n' + err)
          }
        } else {
          vanillaToast.error('Посилання не знайдено')
        }
        break
    }
  })
})

async function renameFile(input, span) {
  try {
    const res = await axios.put('/rename', {
      oldName: clicked_btn.innerText,
      newName: input.value,
      currentDir: location.pathname,
    })
    if (res.status === 201) {
      span.classList.remove('newFolderRename')
      input.blur()
      location.reload()
    }
  } catch (error) {
    if (error.response.status === 400) {
      vanillaToast.error(error.response.data.message + ' Try another name') // Вывод текста ошибки
      setTimeout(() => location.reload(), 2000)
    } else {
      console.error(error) // Вывод других ошибок в консоль
    }
  }
}
async function newFolderReq(input, span) {
  try {
    const res = await axios.post('/newFolder', { folderName: input.value })
    console.log(res)
    if (res.status === 201) {
      span.classList.remove('newFolderRename')
      input.blur()
      location.reload()
    }
  } catch (error) {
    if (error.response.status === 400) {
      vanillaToast.error(error.response.data.message + ' Try another name') // Вывод текста ошибки
      setTimeout(() => location.reload(), 2000)
    } else {
      console.error(error) // Вывод других ошибок в консоль
    }
  }
}

const langOptions = document.querySelectorAll('.lang_option')

langOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const selectedLang = option.getAttribute('data-lang')
    const isChoosed = option.getAttribute('data-choosed')
    console.log(selectedLang, isChoosed)

    localStorage.setItem('lang', selectedLang)
    // location.reload()
    if (isChoosed == null) {
      console.log('req')
      langReq()
    }
  })
})

async function getLang() {
  return localStorage.getItem('lang')
}
async function langReq() {
  try {
    const res = await axios.put('/lang', {
      lang: await getLang(),
    })
    console.log(res)
    if (res.status === 201) {
      console.log(res.data.message)
      location.reload()
    }
  } catch (e) {
    if (e.response.status !== 201) {
      vanillaToast.error(e.response.data.message) // Вывод текста ошибки
    }
  }
}
