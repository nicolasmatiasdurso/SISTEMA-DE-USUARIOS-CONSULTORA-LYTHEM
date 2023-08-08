// Obtener el formulario y agregar un evento de envío
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleSubmit);

// Función para manejar el evento de envío del formulario
function handleSubmit(event) {
    event.preventDefault();

    // Obtener los valores de los campos de correo electrónico y contraseña
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        email: email,
        password: password
    };

    localStorage.setItem('user', email);

    fetch("http://localhost:3000/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
      
        // Verificar si hay un error y el registro no fue encontrado
        if (data.message && data.message === 'Usuario no encontrado') {
            console.log('Registro no encontrado en la base de datos.');
            // Mostrar un mensaje en el DOM
            const mensajeError = document.getElementById('mensajeError');
            mensajeError.innerHTML = 'Error:  Usuario no encontrado en la base de datos!';
        } else {

          const accessToken = data.accessToken;
        const storedEmail = localStorage.getItem('user'); // Obtener el correo electrónico del Local Storage

        // Almacenar el token en el almacenamiento local para luego dejar entrar a la url si sale todo bien
        localStorage.setItem('accessToken', accessToken);
        solicitudSeccionUsuarios(accessToken, data.message);

            // Limpiar el mensaje de error si no se encontró un error
            const mensajeError = document.getElementById('mensajeError');
            mensajeError.innerHTML = '';
        }
    })
    .catch(error => {
        console.error('Error al hacer la solicitud:', error);
    });
}

// ESTA FUNCION LO QUE HACE ES GENERAR UN TOKEN DE REFRESCO PARA QUE CADA VEZ QUE SE VENCE EL TOKEN DE ACCESO, SE GENERE UNO DE RESPALDO QUE DURA MAS TIEMPO

function refreshAccessToken(refreshToken) {
  fetch("http://localhost:3000/refresh-token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken: refreshToken })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al refrescar el token');
    }
    return response.json();
  })
  .then(data => {
    const newAccessToken = data.accessToken;
    // Actualizar el token de acceso en el almacenamiento local
    localStorage.setItem('accessToken', newAccessToken);
  })
  .catch(error => {
    console.error('Error al refrescar el token:', error);
  });
}



// ACA HACEMOS UNA SOLICITUD A LA SECCION DE USUARIOS DEL PERMISO PARA INGRESAR, DONDE SE RECIBE EL TOKEN DEL LOGIN 
// Y SE LO COMPARA CON EL TOKEN GUARDADO PARA DAR PERMISO A INGRESAR, SI ESTA TODO OK, ENTRAMOS A USUARIOS.HTML 
function solicitudSeccionUsuarios(accessToken, message) {
  const tokenRecibido = accessToken;

  fetch("http://localhost:3000/usuarios", {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${tokenRecibido}`
      }
  })
  .then(response => {
      if (response.status === 401) {
          // Token de acceso expirado, borrar token y redirigir a la página de inicio de sesión
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          window.location.href = 'http://127.0.0.1:5501/login.html';
          return Promise.reject('Token expirado'); // Rechazar la promesa para salir del flujo
      }

      return response.json();
  })
  .then(data => {
      if (data.message && data.message === 'Acceso a recurso protegido exitoso') {
          // Acceso exitoso, redirigir a la sección de usuarios
          window.location.href = 'http://127.0.0.1:5501/usuarios.html';
      } else {
          console.log('Acceso denegado.');
          // Redirigir a la página de inicio de sesión
          window.location.href = 'http://127.0.0.1:5501/login.html';
      }
  })
  .catch(error => {
      console.error('Error al hacer la solicitud:', error);
      // Redirigir a la página de inicio de sesión
      window.location.href = 'http://127.0.0.1:5501/login.html';
  });
}
