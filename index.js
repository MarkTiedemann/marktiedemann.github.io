document.addEventListener('DOMContentLoaded', function() {
  var body = document.querySelector('body')
  var mode = document.querySelector('.mode')
  var anchors = document.querySelectorAll('a')
  var accent = document.querySelector('.accent')

  var moonAdjust = 'top: 1px; right: 0px; font-size: 32px;'
  var sunAdjust = 'top: 3px; right: 0px; font-size: 27px;'

  var moon = "<i class='fa fa-moon-o' style='" + moonAdjust + "'></i>"
  var sun = "<i class='fa fa-sun-o' style='" + sunAdjust + "'></i>"

  function toggleDarkMode() {
    body.classList.add('dark')
    mode.classList.add('dark')
    anchors.forEach(function(a) {
      a.classList.add('dark')
    })
    accent.style.fontWeight = 400
    mode.innerHTML = sun
    try {
      window.localStorage.setItem('mode', 'dark')
    } catch (e) {}
  }

  function toggleLightMode() {
    body.classList.remove('dark')
    mode.classList.remove('dark')
    anchors.forEach(function(a) {
      a.classList.remove('dark')
    })
    accent.style.fontWeight = 500
    mode.innerHTML = moon
    try {
      window.localStorage.setItem('mode', 'light')
    } catch (e) {}
  }

  try {
    if (window.localStorage.getItem('mode') === 'dark') toggleDarkMode()
  } catch (e) {}

  mode.addEventListener('click', function() {
    if (body.classList.contains('dark')) toggleLightMode()
    else toggleDarkMode()
  })
})
