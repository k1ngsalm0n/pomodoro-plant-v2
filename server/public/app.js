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

let token = null
let currentUser = null
const loginUsername = document.getElementById('login-username')
const loginPassword = document.getElementById('login-password')
const loginBtn = document.getElementById('login-btn')

const registerUsername = document.getElementById('register-username')
const registerPassword = document.getElementById('register-password')
const registerBtn = document.getElementById('register-btn')

const beginBtn = document.getElementById('begin-btn')
const studyBtn = document.getElementById('study-btn')
const collectionBtn = document.getElementById('collection-btn')
const backBtn = document.getElementById('back-btn')

const startBtn = document.getElementById('start-btn')

document.getElementById('go-register').addEventListener('click', () => {
    showScreen('register')
})
document.getElementById('go-login').addEventListener('click', () => {
    showScreen('login')
})

registerBtn.addEventListener('click', () => {
    const username = registerUsername.value
    const password = registerPassword.value

    if ( !username || !password ) {
        alert('Please enter both username and password')
        return
    }

    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error)
        } else {
            alert('Registered successfully, please login')
        }
    })
})

loginBtn.addEventListener('click', () => {
    const username = loginUsername.value
    const password = loginPassword.value

    if ( !username || !password ) {
        alert('Please enter both username and password')
        return
    }

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })

    .then(res => res.json())
    .then(data => {
        if( data.error ) {
            alert(data.error)
        } else {
            token = data.token
            currentUser = JSON.parse(atob(token.split('.')[1]))
            document.getElementById('welcome-username').textContent = currentUser.username
            alert('Login successfully!')
            showScreen('welcome')
        }
    })
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

let timerInterval = null
let secondsLeft = 1500
let isRunning = false

function formatTime(seconds) {
    const minutes = Math.floor(seconds/60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function startTimer() {
    isRunning = true
    timerInterval = setInterval(() => {
        secondsLeft--
        document.getElementById('timer-display').textContent = formatTime(secondsLeft)
        if ( secondsLeft === 0 ) {
            clearInterval(timerInterval)
            isRunning = false
            completeSession()
        }
    }, 1000)
}

function getPlantEmoji(stage) {
    const emojis = ['🌱', '🌿', '☘️', '🌺', '🌸']
    return emojis[stage]
}

function completeSession() {
    fetch('/api/plant/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    .then(res => res.json())
    .then(data => {
        if ( data.error ) {
            alert(data.error)
        } else {
            if (data.message === 'Plant completed') {
                alert('Plant fully grown! Added to the collection!')
            } else {
                document.getElementById('plant-image').textContent = getPlantEmoji(data.stage)
            }
        }
    })
}

startBtn.addEventListener('click', () => {
    if ( !isRunning ) {
        startTimer()
        startBtn.textContent = 'Pause'
    } else {
        clearInterval(timerInterval)
        isRunning = false
        startBtn.textContent = 'Start'
    }
})

