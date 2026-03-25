// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    initStars();
});

// Professional Animated Star Background
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 200;
let animationId;
let time = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createStar(layer = 0) {
    const layerDepth = layer === 0 ? 1 : layer === 1 ? 0.7 : 0.4;
    
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: (Math.random() * 1.2 + 0.3) * layerDepth,
        alpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        layer: layer
    };
}

function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        const layer = i < numStars * 0.3 ? 2 : i < numStars * 0.6 ? 1 : 0;
        stars.push(createStar(layer));
    }
}

function drawStars() {
    const isLight = html.getAttribute('data-theme') === 'light';
    time += 0.001;
    
    const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
    );
    
    if (isLight) {
        gradient.addColorStop(0, '#f0f2f5');
        gradient.addColorStop(0.5, '#e8ebf0');
        gradient.addColorStop(1, '#d8dde5');
    } else {
        gradient.addColorStop(0, '#0f0f1a');
        gradient.addColorStop(0.3, '#0a0a12');
        gradient.addColorStop(0.6, '#080810');
        gradient.addColorStop(1, '#050508');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!isLight) {
        const nebulaGradient = ctx.createRadialGradient(
            canvas.width * 0.7, canvas.height * 0.2, 0,
            canvas.width * 0.7, canvas.height * 0.2, canvas.width * 0.5
        );
        nebulaGradient.addColorStop(0, 'rgba(100, 50, 150, 0.08)');
        nebulaGradient.addColorStop(0.5, 'rgba(50, 100, 150, 0.04)');
        nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    stars.forEach(star => {
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 0.9) star.alpha = 0.9;
        if (star.alpha <= 0.2) star.alpha = 0.2;
        
        star.x += Math.sin(time + star.y * 0.01) * 0.02 * (star.layer + 1);
        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
        
        const alpha = isLight ? star.alpha * 0.6 : star.alpha;
        
        const glowGradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * (4 - star.layer * 1.5)
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (4 - star.layer * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
    });
    
    animationId = requestAnimationFrame(drawStars);
}

resizeCanvas();
initStars();
drawStars();

window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});

// Terminal
const terminal = document.getElementById('terminal');
let userInput = '';
let commandHistory = [];
let historyIndex = -1;

const demoCommands = [
    { 
        cmd: './check-username NSX', 
        output: `Checking availability for "NSX"...

✓ GitHub: TAKEN
✓ Twitter: TAKEN
✓ Instagram: AVAILABLE
✓ Reddit: AVAILABLE`
    },
    { 
        cmd: 'ls -la projects/', 
        output: `total 3
drwxr-xr-x  2 nsx nsx 4096 Mar 25 10:00 .
drwxr-xr-x 15 nsx nsx 4096 Mar 25 10:00 ..
-rwxr-xr-x  1 nsx nsx 2048 Mar 25 09:00 username_checker.py
-rwxr-xr-x  1 nsx nsx 1536 Mar 25 09:30 api_wrapper.py
-rwxr-xr-x  1 nsx nsx 3072 Mar 25 10:00 bulk_checker.py`
    },
    { 
        cmd: 'python username_checker.py --stats', 
        output: `╔══════════════════════════════════════╗
║ Username Checker Statistics          ║
╠══════════════════════════════════════╣
║ Total Checks:       15,847           ║
║ Found Available:    8,234            ║
║ Success Rate:       51.96%           ║
║ Platforms Supported: 12              ║
╚══════════════════════════════════════╝`
    },
    { 
        cmd: 'echo "Contact: github.com/honda-nsx"', 
        output: 'Contact: github.com/honda-nsx'
    }
];

const userCommands = {
    'help': 'Available commands: help, about, contact, skills, clear, whoami, ls',
    'about': 'NSX - Agentic Engineer specializing in autonomous username availability checking scripts via APIs.',
    'contact': 'GitHub: github.com/honda-nsx | github.com/PopeLeoXIV',
    'skills': `• Python
• API Integration
• Automation
• Username Enumeration`,
    'whoami': 'nsx\nuid=1000(nsx) gid=1000(nsx)\nAgentic Engineer | Automation Enthusiast',
    'ls': `skills.txt  projects/  contact.txt
username_checker.py  bulk_checker.py`
};

function createOutputElement(text) {
    const div = document.createElement('div');
    div.className = 'terminal-output';
    div.style.whiteSpace = 'pre';
    div.style.fontFamily = "'Courier New', 'Fira Code', monospace";
    div.textContent = text;
    return div;
}

function createCommandElement(text) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = `<span class="prompt">nsx@portfolio:~$</span><span class="command">${text}</span>`;
    return div;
}

async function typeText(element, text, speed = 20) {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

async function runDemo() {
    for (const { cmd, output } of demoCommands) {
        await new Promise(r => setTimeout(r, 600));
        
        const cmdLine = createCommandElement('');
        const activeLine = terminal.querySelector('.terminal-line.active');
        terminal.insertBefore(cmdLine, activeLine);
        
        const cmdSpan = cmdLine.querySelector('.command');
        await typeText(cmdSpan, cmd, 40);
        
        const outputDiv = createOutputElement('');
        terminal.insertBefore(outputDiv, activeLine);
        await typeText(outputDiv, output, 15);
    }
    
    setTimeout(() => {
        const lines = terminal.querySelectorAll('.terminal-line:not(.active), .terminal-output');
        lines.forEach(el => el.remove());
        runDemo();
    }, 10000);
}

setTimeout(runDemo, 1500);

// Keyboard input
const activeLine = terminal.querySelector('.terminal-line.active');

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const cmd = userInput.trim();
        
        if (cmd) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
            
            const cmdLine = createCommandElement(userInput);
            const activeLineEl = terminal.querySelector('.terminal-line.active');
            terminal.insertBefore(cmdLine, activeLineEl);
            
            const outputDiv = createOutputElement('');
            terminal.insertBefore(outputDiv, activeLineEl);
            
            const cmdLower = cmd.toLowerCase().split(' ')[0];
            const response = userCommands[cmdLower] || `Command not found: ${cmd}\nType 'help' for available commands.`;
            
            typeText(outputDiv, response, 10);
        }
        
        userInput = '';
        activeLine.querySelector('.command').textContent = '';
        terminal.scrollTop = terminal.scrollHeight;
        
    } else if (e.key === 'Backspace') {
        userInput = userInput.slice(0, -1);
        activeLine.querySelector('.command').textContent = userInput;
        
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            userInput = commandHistory[historyIndex];
            activeLine.querySelector('.command').textContent = userInput;
        }
        
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            userInput = commandHistory[historyIndex];
            activeLine.querySelector('.command').textContent = userInput;
        } else {
            historyIndex = commandHistory.length;
            userInput = '';
            activeLine.querySelector('.command').textContent = '';
        }
        
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const matches = Object.keys(userCommands).filter(k => k.startsWith(userInput.toLowerCase()));
        if (matches.length === 1) {
            userInput = matches[0];
            activeLine.querySelector('.command').textContent = userInput;
        }
        
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        userInput += e.key;
        activeLine.querySelector('.command').textContent = userInput;
    }
});
