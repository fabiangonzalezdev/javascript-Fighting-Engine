const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Fighter {
    constructor(x, y, width, height, color, controls) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.originalColor = color; // Guardar el color original
        this.health = 100;
        this.speed = 5;
        this.controls = controls;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.punchEffectDuration = 0; // Duración del efecto de puño
    }

    draw() {
        // Dibujar el luchador
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Dibujar barra de salud
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 20, this.width * (this.health / 100), 10);

        // Dibujar efecto de puño si está activo
        if (this.punchEffectDuration > 0) {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 30, 0, 2 * Math.PI);
            ctx.fillStyle = 'orange';
            ctx.fill();
            this.punchEffectDuration--;
        }
    }

    move() {
        if (this.controls.left && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.controls.right && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
        if (this.controls.jump && this.y > 200) {
            this.y -= this.speed;
        }
        if (this.controls.down && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }

        // Resetear ataque tras el cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            if (this.attackCooldown === 0) {
                this.isAttacking = false;
                this.color = this.originalColor; // Volver al color original
            }
        }
    }

    attack(opponent) {
        if (!this.isAttacking && this.attackCooldown === 0) {
            this.isAttacking = true;
            this.attackCooldown = 30; // Tiempo de cooldown antes del próximo ataque
            this.color = 'yellow'; // Cambiar color del personaje cuando golpea

            // Verificar si el ataque conecta con el oponente
            if (
                this.x + this.width >= opponent.x &&
                this.x <= opponent.x + opponent.width &&
                this.y === opponent.y
            ) {
                opponent.health -= 10; // Reducir la salud del oponente
                this.punchEffectDuration = 10; // Mostrar efecto de puño por un breve período
            }
        }
    }
}

// Controles de los jugadores
const player1Controls = { left: false, right: false, jump: false, down: false, attack: false };
const player2Controls = { left: false, right: false, jump: false, down: false, attack: false };

// Inicializar luchadores
const player1 = new Fighter(50, 300, 50, 100, 'blue', player1Controls);
const player2 = new Fighter(700, 300, 50, 100, 'green', player2Controls);

// Event listeners para los controles
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player1Controls.left = true;
            break;
        case 'd':
            player1Controls.right = true;
            break;
        case 'w':
            player1Controls.jump = true;
            break;
        case 's':
            player1Controls.down = true;
            break;
        case ' ':
            player1.attack(player2);
            break;
        case 'ArrowLeft':
            player2Controls.left = true;
            break;
        case 'ArrowRight':
            player2Controls.right = true;
            break;
        case 'ArrowUp':
            player2Controls.jump = true;
            break;
        case 'ArrowDown':
            player2Controls.down = true;
            break;
        case 'Enter':
            player2.attack(player1);
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'a':
            player1Controls.left = false;
            break;
        case 'd':
            player1Controls.right = false;
            break;
        case 'w':
            player1Controls.jump = false;
            break;
        case 's':
            player1Controls.down = false;
            break;
        case 'ArrowLeft':
            player2Controls.left = false;
            break;
        case 'ArrowRight':
            player2Controls.right = false;
            break;
        case 'ArrowUp':
            player2Controls.jump = false;
            break;
        case 'ArrowDown':
            player2Controls.down = false;
            break;
    }
});

function update() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mover luchadores
    player1.move();
    player2.move();

    // Dibujar luchadores
    player1.draw();
    player2.draw();

    // Verificar si uno de los jugadores perdió toda la salud
    if (player1.health <= 0 || player2.health <= 0) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    // Loop de actualización
    requestAnimationFrame(update);
}

// Iniciar el juego
update();
