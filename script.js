const resultScreen = document.getElementById('result');
const historyScreen = document.getElementById('history');
const buttons = document.querySelectorAll('button');
const themeSwitch = document.getElementById('theme-switch');

let currentInput = "";
let history = "";

// Initialize Theme
if(localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
}

// Button Click Event
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        handleInput(btn.dataset.key);
    });
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    let key = e.key;

    // Map keyboard keys to calculator keys
    if (key === 'Enter') key = '=';
    if (key === 'Backspace') key = 'backspace';
    if (key === 'Escape') key = 'c';
    if (key === 'Delete') key = 'c';
    
    // Find the button with the corresponding data-key
    const button = document.querySelector(`button[data-key="${key}"]`);
    
    if (button) {
        button.click(); // Trigger click logic
        button.classList.add('pressed'); // Add animation class
        setTimeout(() => button.classList.remove('pressed'), 100); // Remove animation
    }
});

// Theme Switch Logic
themeSwitch.addEventListener('change', (e) => {
    if(e.target.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

function handleInput(value) {
    if (value === 'c') {
        currentInput = "";
        history = "";
        updateScreen();
        return;
    }

    if (value === 'backspace') {
        currentInput = currentInput.slice(0, -1);
        updateScreen();
        return;
    }

    if (value === '=') {
        try {
            // Replace visual operators with JS operators if needed
            // Note: eval is used here for simplicity. 
            // In production, write a custom parser for security.
            if (!currentInput) return;
            
            history = currentInput;
            // Catch division by zero or invalid math
            const result = eval(currentInput); 
            
            if (!isFinite(result)) throw new Error("Error");
            
            currentInput = result.toString();
        } catch (error) {
            currentInput = "Error";
            setTimeout(() => currentInput = "", 1500);
        }
        updateScreen(true);
        return;
    }

    // Prevent multiple operators in a row
    const operators = ['+', '-', '*', '/', '%'];
    const lastChar = currentInput.slice(-1);
    
    if (operators.includes(value) && operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + value;
    } else {
        currentInput += value;
    }
    
    updateScreen();
}

function updateScreen(isResult = false) {
    resultScreen.innerText = currentInput || "0";
    if(isResult) {
        historyScreen.innerText = history + " =";
    } else {
        historyScreen.innerText = "";
    }
}