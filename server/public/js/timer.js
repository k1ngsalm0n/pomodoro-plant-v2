// Session lengths in seconds. These were 5 / 2 / 3 while the cycle logic was
// being written, so a whole four-session round could be watched in under a
// minute; they are the real pomodoro lengths now.
const STUDY_SECONDS = 25 * 60
const SHORT_BREAK_SECONDS = 5 * 60
const LONG_BREAK_SECONDS = 15 * 60

let timerInterval = null
let secondsLeft = STUDY_SECONDS
let isRunning = false
let sessionCount = 0
let isBreak = false

const startBtn = document.getElementById('start-btn')

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
            if ( isBreak ) {
                isBreak = false
                secondsLeft = STUDY_SECONDS
                document.getElementById('session-label').textContent = 'Study Session ' + sessionCount
                document.getElementById('timer-display').textContent = formatTime(secondsLeft)
                startTimer()
                completeSession()
            } else {
                sessionCount++
                if ( sessionCount % 4 === 0 ) {
                    secondsLeft = LONG_BREAK_SECONDS
                    document.getElementById('session-label').textContent = 'Long Break'
                } else {
                    secondsLeft = SHORT_BREAK_SECONDS
                    document.getElementById('session-label').textContent = 'Short Break'
                }

                isBreak = true
                document.getElementById('timer-display').textContent = formatTime(secondsLeft)
                startBtn.textContent = 'Pause'
                startTimer()
            }
        }
    }, 1000)
}

function loadPlant() {
    fetch('/api/plant', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('plant-image').textContent = getPlantEmoji(data.stage)

        if ( data.session_count > 0 ) {
            const continueSession = confirm(`You were on plant growth ${data.stage + 1} of 4. \nContinue?`)
            if ( continueSession ) {
                sessionCount = data.session_count
            } else {
                sessionCount = 0
                resetSession()
            }
        }
    })
}

function resetSession() {
    fetch('/api/plant/reset', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    .then(res => res.json())
    .then(data => {
        document.getElementById('plant-image').textContent = getPlantEmoji(data.stage)
    })
}

function completeSession() {
    fetch('/api/plant/complete', {
        method: 'POST',
        body: JSON.stringify({ sessionCount }),
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
                loadPlant()
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
