import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
	const [valores, guardarValores] = useState(stateInicial);
	const [errores, guardarErrores] = useState({});
	const [submitform, guardarSubmitForm] = useState(false);

	useEffect(() => {
		if (submitform) {
			const noErrores = Object.keys(errores).length === 0;
			if (noErrores) {
				fn(); // fn = Funcion que se ejecuta en el componente
			}
			guardarSubmitForm(false);
		}
	}, [errores]);

	// Funcion que se ejecuta cuando el usuario escribe algo
	const handleChange = (e) => {
		guardarValores({
			...valores,
			[e.target.name]: e.target.value,
		});
	};

	//Funcion que se ejecuta cuando el usuario hace submit
	const handleSubmit = (e) => {
		e.preventDefault();
		const erroresValidacion = validar(valores);
		guardarErrores(erroresValidacion);
		guardarSubmitForm(true);
	};

	// cuando se realiza el evento blur (Cuando el user esta escribiendo)
	// un input y se sale del input se ejecuta

	const handleBlur = () => {
		const erroresValidacion = validar(valores);
		guardarErrores(erroresValidacion);
	};

	return {
		valores,
		errores,
		submitform,
		handleChange,
		handleSubmit,
		handleBlur,
	};
};

export default useValidacion;
