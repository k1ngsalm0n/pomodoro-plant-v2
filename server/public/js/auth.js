
const loginUsername = document.getElementById('login-username')
const loginPassword = document.getElementById('login-password')
const loginBtn = document.getElementById('login-btn')

const registerUsername = document.getElementById('register-username')
const registerPassword = document.getElementById('register-password')
const registerBtn = document.getElementById('register-btn')

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