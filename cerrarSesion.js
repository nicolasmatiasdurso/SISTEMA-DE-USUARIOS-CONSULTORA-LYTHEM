// Verificar si el usuario tiene un token válido antes de cargar el contenido
const token = localStorage.getItem('accessToken'); // Obtener el token del almacenamiento local

if (!token) {
  // Si no hay token, redirigir al usuario a otra página o mostrar un mensaje de error
  window.location.href = 'http://127.0.0.1:5501/error.html';
}

function cerrarSesion() {
  localStorage.removeItem('accessToken');
  window.location.href = 'http://127.0.0.1:5501/login.html'; // Redirigir a la página de inicio de sesión
}
