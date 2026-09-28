// ------- VARIABLES ---------
const display = document.querySelector('#display')
display.value = '0'

let firstNumber = null
let operator = null
let waitingSecond = false
let finishCalc = false


const LIMIT = 15

// ------- NUMBERS -------
function digit(number) {
    if(display.value === 'Error' || finishCalc === true) {
        clearDisplay()
    }
    
    if (waitingSecond === true) {
        display.value = number
        waitingSecond = false
        return
    }

    if (display.value.length >= LIMIT) {
        return
    }

    if (display.value === '0') {
        display.value = number
    } else {
        display.value += number
    }
}

function floatNumber () {
    if (display.value === 'Error' || finishCalc === true) {
        clearDisplay()
    }

    if (waitingSecond === true) {
        display.value = '0.'
        waitingSecond = false
        return
    }

    if (display.value.includes('.') === false) {
        display.value += '.'
    }
}

// ------- OPERATORS -------
function chooseOp (op) {
    if (display.value === 'Error') {
        return
    }

    finishCalc = false

    if(operator !== null && waitingSecond === true) {
        operator = op
        return
    }

    let displayNumber = parseFloat(display.value)

    if (operator === null) {
        firstNumber = displayNumber
    } else {
        let result = calculate(firstNumber, displayNumber, operator)

        if (result === 'Error') {
            showError()
            return
        }

        firstNumber = result
        display.value = roundResult(result)
    }

    if (operator === '-') {
        display.value = '-' + display.value
    }

    operator = op
    waitingSecond = true
}

function calculate (a, b, op) {
    if (op === '+') {
        return a + b
    }

    if (op === '-') {
        return a - b
    }

    if (op === '*') {
        return a * b
    }

    if (op === '/') {
        if (b === 0) {
            return 'Error'
        }
        return a / b
    }
}

function roundResult(number) {
    let rounded = Number(number.toFixed(8))
    return String(rounded) 
}

// ------- RESULTS -------
function equal() {
    if (display.value === 'Error' || operator === null) {
        return
    }

    let secondNumber 
    if (waitingSecond === true) {
        secondNumber = firstNumber
    } else {
        secondNumber = parseFloat(display.value)
    }

    let result = calculate (firstNumber, secondNumber, operator) 

    if (result === 'Error') {
        showError()
        return
    }

    display.value = roundResult(result)
    firstNumber = result
    operator = null
    waitingSecond = false
    finishCalc = true
}

function showError () {
    clearDisplay()
    display.value = 'Error'
}

// ------- OTHERS -------
function invertSign() {
    if (display.value === 'Error' || display.value === '0' || waitingSecond === true) {
        return
    }

    if (display.value.startsWith('-')) {
        display.value = display.value.slice(1)
    } else {
        display.value = '-' + display.value
    }
}

function percent() {
    if (display.value === 'Error' || waitingSecond === true) {
        return
    }
    let number = parseFloat(display.value)
    display.value = roundResult(number / 100)
}

function backspace() {
    if (display.value === 'Error' || finishCalc === true || waitingSecond === true) {
        clearDisplay()
        return
    }

    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1)
    } else {
        display.value = '0'
    }
}

function clearDisplay() {
    display.value = '0'
    firstNumber = null
    operator = null
    waitingSecond = false
    finishCalc = false
}

// ------- KEYBOARD -------
document.addEventListener('keydown', function(event) {
    let pressedKey = event.key

    if (pressedKey >= '0' && pressedKey <= '9'){
        digit(pressedKey)
    } else if (pressedKey === '.') {
        floatNumber()
    } else if (pressedKey === '+' || pressedKey === '-' || pressedKey === '*') {
        chooseOp(pressedKey)
    } else if (pressedKey === '/') {
        event.preventDefault()
        chooseOp(pressedKey)
    } else if (pressedKey === 'Enter' || pressedKey === '=') {
        event.preventDefault()
        equal()
    } else if (pressedKey === 'Backspace') {
        backspace()
    } else if (pressedKey === '%') {
        percent()
    } else if (pressedKey === 'Escape') {
        clearDisplay()
    }
})

// ------- AUDIO --------
function toggleAudio() {
    let audio = document.querySelector('audio')
    let btnAudio = document.querySelector('.btn-audio')

    if (audio.paused) {
        audio.play()
        btnAudio.textContent = '⏸'
    } else {
        audio.pause()
        btnAudio.textContent = '▶'
    }
}