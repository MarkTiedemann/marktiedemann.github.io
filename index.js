document.addEventListener('DOMContentLoaded', function () {

  var body = document.querySelector('body')
  var mode = document.querySelector('.mode')
  var anchors = document.querySelectorAll('a')
  var accent = document.querySelector('.accent')

  var moonAdjust = 'top: 1px; right: 0px; font-size: 32px;'
  var sunAdjust = 'top: 3px; right: 0px; font-size: 27px;'

  var moon = "<i class='fa fa-moon-o' style='" + moonAdjust + "'></i>" 
  var sun = "<i class='fa fa-sun-o' style='" + sunAdjust + "'></i>"

  mode.addEventListener('click', function () {
    if (body.classList.contains('dark')) {
      body.classList.remove('dark')
      mode.classList.remove('dark')
      anchors.forEach(function (a) { a.classList.remove('dark') })
      accent.style.fontWeight = 500;
      mode.innerHTML = moon
    } else {
      body.classList.add('dark')
      mode.classList.add('dark')
      anchors.forEach(function (a) { a.classList.add('dark') })
      accent.style.fontWeight = 400;
      mode.innerHTML = sun
    }
  })

})