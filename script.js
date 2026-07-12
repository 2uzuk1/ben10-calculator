function insertToDisplay(data) {
    const display = document.querySelector('#display')
    if (display.value === 'Error') return 
    if (display.value === '' && data === '.') return

    const op = ['+', '-', '*', '/']
    const lastOp = display.value.slice(-1)

    if (op.includes(data) && (op.includes(lastOp) || lastOp === '.')) return
    if (data === '.' && (lastOp === '.' || op.includes(lastOp) || display.value.split(/[+\-*/]/).pop().includes('.'))) return
    
    display.value += data
}

function clean(){
    document.querySelector('#display').value = ""
}

function backspace(){
    let display = document.querySelector('#display')

    if (display.value === 'Error') return
    display.value = display.value.slice(0, -1)
}

function result() {
    let display = document.querySelector('#display')

    if (display.value === 'Error') return
    if (display.value === '') return

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