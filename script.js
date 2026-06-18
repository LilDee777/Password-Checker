const passwordInput = document.getElementById('password-input');
const strengthLabel = document.getElementById('strength-label');
const bars = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'),
    document.getElementById('bar-3')
];
const toggleBtn = document.getElementById('toggle-password');
const visibilityIcon = document.getElementById('visibility-icon');

const rules = {
    length: document.getElementById('rule-length'),
    upper: document.getElementById('rule-upper'),
    number: document.getElementById('rule-number'),
    special: document.getElementById('rule-special')
};
const lengthSelect = document.getElementById('length-select');
const generateBtn = document.getElementById('generate-password');

// Password Visibility Toggle Logic
toggleBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    visibilityIcon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
});

// Password Generator Logic
generateBtn.addEventListener('click', () => {
    const length = parseInt(lengthSelect.value, 10);
    const selectedCharset = document.querySelector('input[name="charset"]:checked');
    const includeSymbols = selectedCharset?.value === 'symbols';
    passwordInput.value = generatePassword(length, includeSymbols);
    passwordInput.dispatchEvent(new Event('input'));
});

function generatePassword(length, includeSymbols) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase + uppercase + numbers + (includeSymbols ? symbols : '');
    let password = [];

    // Ensure at least one of each required type
    password.push(uppercase.charAt(Math.floor(Math.random() * uppercase.length)));
    password.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)));
    password.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));

    if (includeSymbols) {
        password.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
    }

    // Fill remaining length with random chars from the full set
    for (let i = password.length; i < length; i++) {
        password.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }

    // Shuffle to randomize positions
    return password.sort(() => Math.random() - 0.5).join('');
}

// Dynamic Evaluation Logic
passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = 0;

    // Validate Rules using Regular Expressions
    const hasLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val) && /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);

    // Update UI Status Checkmarks
    updateRuleIcon(rules.length, hasLength);
    updateRuleIcon(rules.upper, hasUpper);
    updateRuleIcon(rules.number, hasNumber);
    updateRuleIcon(rules.special, hasSpecial);

    // Score Calculations
    if (val.length > 0) strength++;
    if (hasLength && hasUpper) strength++;
    if (hasNumber && hasSpecial && hasLength) strength++;

    // Adjust Strength Meter Visuals Accordingly
    if (val.length === 0) {
        strengthLabel.textContent = "Enter a password...";
        strengthLabel.className = "font-label-md text-label-md text-outline-variant";
        resetBars();
    } else if (strength === 1) {
        strengthLabel.textContent = "Weak (Vulnerable)";
        strengthLabel.className = "font-label-md text-label-md text-error";
        setBars(['#ffb4ab', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']);
    } else if (strength === 2) {
        strengthLabel.textContent = "Medium (Adequate)";
        strengthLabel.className = "font-label-md text-label-md text-tertiary";
        setBars(['#e7bf99', '#e7bf99', 'rgba(255, 255, 255, 0.1)']);
    } else if (strength === 3) {
        strengthLabel.textContent = "Strong (Encrypted)";
        strengthLabel.className = "font-label-md text-label-md text-primary";
        setBars(['#b9c7e4', '#b9c7e4', '#b9c7e4']);
    }
});

// Helper function to update checkmark indicators
function updateRuleIcon(element, isValid) {
    if (isValid) {
        element.textContent = 'check_circle';
        element.classList.add('text-primary');
        element.classList.remove('text-on-surface-variant');
        element.style.fontVariationSettings = "'FILL' 1";
    } else {
        element.textContent = 'circle';
        element.classList.remove('text-primary');
        element.classList.add('text-on-surface-variant');
        element.style.fontVariationSettings = "'FILL' 0";
    }
}

// Helper function to clear status bar graphics
function resetBars() {
    bars.forEach(bar => {
        bar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        bar.style.boxShadow = 'none';
    });
}

// Helper function to set tracking indicators and shadows
function setBars(colors) {
    bars.forEach((bar, i) => {
        bar.style.backgroundColor = colors[i];
        if (colors[i] !== 'rgba(255, 255, 255, 0.1)') {
            bar.style.boxShadow = `0 0 12px ${colors[i]}44`;
        } else {
            bar.style.boxShadow = 'none';
        }
    });
}