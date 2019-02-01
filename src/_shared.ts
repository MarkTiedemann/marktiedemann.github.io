let $body = document.body

function ajax(
  url: string,
  async: boolean,
  callback: (text: string) => void
): void {
  let request = new XMLHttpRequest()
  request.addEventListener('load', () => {
    if (request.status === 200) {
      callback(request.responseText)
    }
  })
  request.open('GET', url, async)
  request.send()
}

function documentGetElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T
}

function getItemLocalStorage(key: string): string | null {
  return localStorage.getItem(key)
}

function setItemLocalStorage(key: string, value: string): void {
  localStorage.setItem(key, value)
}

function setTextContent(element: Element, text: string): void {
  element.textContent = text
}

function classListAdd(element: Element, className: string): void {
  element.classList.add(className)
}

function classListRemove(element: Element, className: string): void {
  element.classList.remove(className)
}
