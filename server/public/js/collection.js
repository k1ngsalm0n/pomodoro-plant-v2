function loadCollection() {
    authFetch('/api/collection')
    .then(data => {
        console.log('collection data:', data)
        if(data.error) {
            alert(data.error)
        } else {
            const container = document.getElementById('flowers-container')
            container.innerHTML = '' 

            data.forEach(flower => {
                const card = document.createElement('div')
                card.className = 'flower-card'
                card.innerHTML = `
                <div class="flower-emoji">${getPlantEmoji(flower.flower_id)}</div>
                <div class="flower-count">x${flower.count}</div>
                `
                container.appendChild(card)
            })
        }
    })
}