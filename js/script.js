// --- VARIABLES ---
const display = document.querySelector('#display')
display.value = ''

let finishCalc = false
let openCount = 0 // How many '(' are open whithot closing
let tokens = []
let pos = 0

const LIMIT = 23

const operators = ['+', '-', '*', '/']

function lastChar() {
    return display.value.slice(-1)
}

// --- TOKENIZER ---

// Reads a number, a negated factor, or the value of an expression in parentheses.
// It is the basic unit used by parseTerm.
function parseFactor() {
    if (tokens[pos] === '-') {
        pos++
        return -parseFactor()
    }
    
    if (tokens[pos] === '(') {
        pos++
        const value = parseExpression()
        if (tokens[pos] !== ')') throw new Error ('Missing )')
        pos++
        return value
}

    const value = parseFloat(tokens[pos])
    pos++
    return value
}

// Reads factors joined by multiplication or division.
// Calls parseFactor to read each value.
function parseTerm() { // Returns the value of 
    let value = parseFactor()
    
    while (tokens[pos] === '*' || tokens[pos] === '/') {
        const op = tokens[pos]
        pos++
        const right = parseFactor()
        
        value = calculate(value, right, op)
    }
    
    return value
}

// Reads terms joined by addition or subtraction.
// Calls parseTerm to preserve the precedence of * and /.
function parseExpression() {
    let value = parseTerm()
    
    while (tokens[pos] === '+' || tokens[pos] === '-') {
        const op = tokens[pos]
        pos++
        const right = parseTerm()
        
        value = calculate(value, right, op)
    }
    
    return value
}

// Splits the input expression into tokens for evaluation.
function tokenize(text) {
    let tokens = []
    let actualNum = ''

    for (let i = 0; i < text.length ;i++) {
        let char = text[i]

        if (char >= '0' && char <= '9' || char === '.') {
            actualNum += char
        } else {
            if (actualNum !== '') {
                tokens.push(actualNum)
                actualNum = ''
            }
            tokens.push(char)   
        }
    }

    if (actualNum !== '') {
        tokens.push(actualNum)
    }

    return tokens
}

// Evaluates an arithmetic expression and returns its result.
function evaluate(text) {
    tokens = tokenize(text)
    pos = 0
    const result = parseExpression()
    if (pos < tokens.length) throw new Error('Invalid')
    return result
}

// --- EXPRESSION ---
function digit(number) {
    if (finishCalc || display.value === 'Error') clearDisplay()
    
    if (display.value.length >= LIMIT || lastChar() === ')') return

    display.value += number
}

function floatNumber() {
    if (finishCalc || display.value === 'Error') clearDisplay()
    
    if (display.value.length >= LIMIT || lastChar() === '.' || lastChar() === ')') return
    
    const match = display.value.match(/[0-9.]*$/)[0]

    if (match.includes('.')) return
    
    if (match === '') {
        display.value += '0.'
    } else {
        display.value += '.'
    }
}

function chooseOp(op) {
    if (display.value === 'Error' || lastChar() === '.') return
    finishCalc = false

    const last = lastChar()

    if (last === '') {
        if (op === '-') display.value += op
        return
    }

    if (operators.includes(last)) {
        const beforeLast = display.value.slice(-2,-1)

        if (last === '-' && (beforeLast === '*' || beforeLast === '/')) {
            if (op === '-') return

            display.value = display.value.slice(0, -2) + op
            return
        }

        if (op === '-' && (last === '*' || last === '/')) {
            display.value += op
        } else {
            display.value = display.value.slice(0, -1) + op
        }
        return
    }

    display.value += op
}

function calculate (a, b, operator) {
    if (operator === '+') return a + b
    
    if (operator === '-') return a - b
    
    if (operator === '*') return a * b
    
    if (operator === '/') {
        if (b === 0) throw new Error('Division by zero')
            return a / b
    }
}

function openParen() {
    if (display.value === 'Error' || finishCalc === true) {
        clearDisplay()
    } 

    if (display.value.length >= LIMIT) return

    let last = lastChar()

    if (last === '' || operators.includes(last) || last === '(') {
        openCount++
        display.value += '('
    }
}

function closeParen() {
    let last = lastChar()

    if (display.value.length >= LIMIT) return

    if (openCount === 0) return
    if (operators.includes(last) || last === '(' || last === '.') return

    openCount--
    display.value += ')'
}


function equal() {
    if (display.value === '' || openCount > 0 || display.value === 'Error') return

    try {
        const result = evaluate(display.value)
        display.value = roundResult(result)
        finishCalc = true
        openCount = 0
    } catch {
        showError()
    }
}

// --- OTHER ---
function clearDisplay() {
    display.value = ''
    finishCalc = false
    openCount = 0
}

function backspace() {
    if (display.value === 'Error' || finishCalc === true) {
        clearDisplay()
        return
    }

    if (lastChar() === '(') openCount--
    if (lastChar() === ')') openCount++

    display.value = display.value.slice(0, -1)
}

function showError() {
    clearDisplay()
    display.value = 'Error'
}

function roundResult(number) {
    let rounded = Number(number.toFixed(8))
    return String(rounded)
}

// --- AUDIO ---
function toggleAudio() {
    const audio = document.querySelector('audio')
    const btnAudio = document.querySelector('.btn-audio')

    if (audio.paused) {
        audio.play()
        btnAudio.textContent = '⏸'
    } else {
        audio.pause()
        btnAudio.textContent = '▶'
    }
}