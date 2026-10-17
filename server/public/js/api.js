// Every protected route answers 401 when the token is missing, edited or past
// its 30 days — and moving the signing secret out of the source made every
// token issued before that 401 as well. The callers read the body as data, so
// a dead token painted an undefined plant and an empty collection instead of
// asking the reader to log in again. One place sends the token now, and one
// place reacts to losing it.
function authFetch(path, options = {}) {
    return fetch(path, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 401) {
            signOut()
            // Never settles on purpose: the screen is back at the login form,
            // so every caller's .then here would be drawing into a screen the
            // reader can no longer see.
            return new Promise(() => {})
        }
        return res.json()
    })
}

function signOut() {
    token = null
    currentUser = null
    localStorage.removeItem('token')
    showScreen('login')
    alert('Your session has ended, please login again')
}
