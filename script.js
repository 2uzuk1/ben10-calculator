function insertToDisplay(data) {
    document.querySelector('#display').value += data
}

function clean(){
    document.querySelector('#display').value = ""
}

function backspace(){
    let display = document.querySelector('#display')
    display.value = display.value.slice(0, -1)
}

function result() {
    let display = document.querySelector('#display')
    try {
        display.value = eval(display.value)
    } catch {
        display.value = 'Error'
    }
}

const audio = document.querySelector('audio')

function toggleAudio() {
    const btnAudio = document.querySelector('.btn-audio')
    if (audio.paused) {
        audio.play()
        btnAudio.textContent = '⏸'
    } else {
        audio.pause()
        btnAudio.textContent = '▶'
    }
}