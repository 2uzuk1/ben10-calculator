// --- VARIABLES ---
const display = document.querySelector('#display')

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
function calculate (a, b, operator) {
    if (operator === '+') return a + b
    
    if (operator === '-') return a - b
    
    if (operator === '*') return a * b
    
    if (operator === '/') {
        if (b === 0) throw new Error('Division by zero')
            return a / b
    }
}

// --- AUDIO ---
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