let token = null
let currentUser = null

const beginBtn = document.getElementById('begin-btn')
const studyBtn = document.getElementById('study-btn')
const collectionBtn = document.getElementById('collection-btn')

const previousScreen = {
    register: 'login',
    welcome: 'login',
    menu: 'welcome',
    timer: 'menu',
    collection: 'menu'
}

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
    localStorage.setItem('currentScreen', screenName)
}

function goBack( currentScreen ) {
    showScreen(previousScreen[currentScreen])
}

const savedToken = localStorage.getItem('token')
if (savedToken) {
    token = savedToken
    currentUser = JSON.parse(atob(token.split('.')[1]))
    document.getElementById('welcome-username').textContent = currentUser.username
    
    const savedScreen = localStorage.getItem('currentScreen') || 'welcome'
    if( savedScreen === 'timer') {
        loadPlant()
    } else if (savedScreen === 'collection') {
        loadCollection()
    }
    showScreen(savedScreen)
}

document.querySelectorAll('.back-btn-nav').forEach(btn => {
    btn.addEventListener('click', () => {
        goBack(btn.dataset.screen)
    })
})

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
    document.getElementById('timer-display').textContent = formatTime(secondsLeft)
    loadPlant()
})

collectionBtn.addEventListener('click', () => {
    showScreen('collection')
    loadCollection()
})

if ( window.electronAPI ) {
    document.getElementById('close-btn').addEventListener('click', () => {
        window.electronAPI.closeWindow()
    })

    document.getElementById('minimize-btn').addEventListener('click', () => {
        window.electronAPI.minimizeWindow()
    })
}

function getPlantEmoji(stage) {
    const emojis = ['🌱', '🌿', '☘️', '🌺', '🌸']
    return emojis[stage]
}