let token = null
let currentUser = null

const beginBtn = document.getElementById('begin-btn')
const studyBtn = document.getElementById('study-btn')
const collectionBtn = document.getElementById('collection-btn')
const backBtn = document.getElementById('back-btn')

const screens = {
    login: document.getElementById('login-screen'),
    register: document.getElementById('register-screen'),
    welcome: document.getElementById('welcome-screen'),
    menu: document.getElementById('menu-screen'),
    timer: document.getElementById('timer-screen'),
    collection: document.getElementById('collection-screen')
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'))
    screens[screenName].classList.remove('hidden')
}

document.getElementById('go-register').addEventListener('click', () => {
    showScreen('register')
})
document.getElementById('go-login').addEventListener('click', () => {
    showScreen('login')
})

beginBtn.addEventListener('click', () => {
    showScreen('menu')
})

studyBtn.addEventListener('click', () => {
    showScreen('timer')
})

collectionBtn.addEventListener('click', () => {
    showScreen('collection')
})

backBtn.addEventListener('click', () => {
    showScreen('menu')
})