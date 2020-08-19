export default function validarCrearCuenta(valores) {
	let errores = {};

	//Validar el nombre
	if (!valores.nombre) {
		errores.nombre = "El Nombre es obligatorio";
	}

	if (!valores.email) {
		errores.email = "El Email es Obligatorio";
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
		errores.email = "Email no válido";
	}

	// validar el password
	if (!valores.password) {
		errores.password = "El Password es obligatorio";
	} else if (valores.password.length < 6) {
		errores.password = "El Password debe ser de al menos 6 caracteres";
	}

	return errores;
}
