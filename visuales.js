// Efecto de escritura automática
var text = "CONSULTORA LYTHEM";

function typeWriter() {
    var typingEffect = document.getElementById('typingEffect'); // Mover la obtención del elemento aquí
    if (typingEffect) { // Asegurarse de que el elemento exista
        var firstLetter = text.charAt(0); // Obtener la primera letra
        typingEffect.textContent = firstLetter; // Mostrar la primera letra
        var index = 1; // Comenzar desde la segunda letra
        var interval = setInterval(function() {
            if (index < text.length) {
                typingEffect.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(interval); // Detener el intervalo cuando se haya escrito todo el texto
                setTimeout(typeWriter, 2000); // Iniciar nuevamente después de 10 segundos
            }
        }, 200); // Ajusta el tiempo para cambiar la velocidad de escritura
    }
}

// Utiliza el evento DOMContentLoaded para ejecutar el efecto cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    typeWriter();
});
