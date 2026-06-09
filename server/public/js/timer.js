
let timerInterval = null
let secondsLeft = 1500
let isRunning = false

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