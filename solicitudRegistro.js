// Obtener el formulario y agregar un evento de envío
const registroForm = document.getElementById('registroForm');
registroForm.addEventListener('submit', handleSubmit);

// Función para manejar el evento de envío del formulario
function handleSubmit(event) {
  event.preventDefault();

  // Obtener los valores de los campos de correo electrónico y contraseña
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const resultadoValidacion = validarRegistro(email, password);

  if (resultadoValidacion !== "Registro exitoso") {
    console.error(resultadoValidacion);
    return; // Detener la ejecución de la función
  }

  const data = {
    email: email,
    password: password
  };

  fetch("http://localhost:3000/registro", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta del servidor:', data);
    if (data.success) {
      alert("Usuario Registrado correctamente");
    } else {
      alert("Error al registrar el usuario: " + data.message);
    }
  })
  .catch(error => {
    console.error('Error al hacer la solicitud:', error);
    alert("Error al comunicarse con el servidor");
  });
}

function validarRegistro(email, contraseña) {
  // Validar si es una dirección de correo electrónico válida y no contiene espacios
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email) || email.includes(" ")) {
    return "La dirección de correo electrónico no es válida o contiene espacios.";
  }

  // Validar si la contraseña tiene al menos 6 caracteres
  if (contraseña.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  return "Registro exitoso";
}
