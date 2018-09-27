"use strict";
var body = document.body;
var modeToggle = document.querySelector('#mode_toggle');
var moon = document.querySelector('#moon');
var sun = document.querySelector('#sun');
initModeToggle();
function initModeToggle() {
    switch (getMode()) {
        case null:
            toggleMode('dark');
            break;
        case 'dark':
            toggleMode('dark');
            break;
        case 'light':
            toggleMode('light');
            break;
    }
    modeToggle.addEventListener('click', function () {
        toggleMode(oppositeMode(getMode()));
    });
}
function toggleMode(mode) {
    var newMode = mode;
    var oldMode = oppositeMode(newMode);
    modeToggle.classList.add(newMode);
    modeToggle.classList.remove(oldMode);
    modeToggle.setAttribute('title', 'Toggle ' + oldMode + ' mode');
    moon.style.display = newMode === 'dark' ? 'none' : 'inline';
    sun.style.display = newMode === 'dark' ? 'inline' : 'none';
    body.classList.add(newMode);
    body.classList.remove(oldMode);
    setMode(newMode);
}
function getMode() {
    var item = localStorage.getItem('mode');
    switch (item) {
        case 'light':
            return 'light';
        default:
            return 'dark';
    }
}
function setMode(mode) {
    localStorage.setItem('mode', mode);
}
function oppositeMode(mode) {
    return mode === 'light' ? 'dark' : 'light';
}
