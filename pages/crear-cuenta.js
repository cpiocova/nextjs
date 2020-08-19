import React, { useState } from "react";
import Router from "next/router";
import Layout from "./../components/layouts/Layout";
import {
	Formulario,
	Campo,
	InputSubmit,
	Error,
} from "./../components/ui/Formulario";

import firebase from "./../firebase";

//validaciones
import useValidacion from "./../hooks/useValidacion";
import validarCrearCuenta from "./../validacion/validarCrearCuenta";

const STATE_INICIAL = {
	nombre: "",
	email: "",
	password: "",
};

const CrearCuenta = () => {
	const [error, guardarError] = useState(false);

	const {
		valores,
		errores,
		submitform,
		handleChange,
		handleSubmit,
		handleBlur,
	} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

	const { nombre, email, password } = valores;

	async function crearCuenta() {
		try {
			await firebase.registrar(nombre, email, password);
			Router.push("/");
		} catch (error) {
			console.error("Hubo un error al crear el usuario", error);
			guardarError(error.message);
		}
	}

	return (
		<Layout>
			<>
				<h1
					style={{
						textAlign: "center",
						marginTop: "5rem",
					}}
				>
					CrearCuenta
				</h1>
				<Formulario onSubmit={handleSubmit} noValidate>
					<Campo>
						<label htmlFor="nombre">Nombre</label>
						<input
							type="text"
							id="nombre"
							placeholder="Tu Nombre"
							name="nombre"
							value={nombre}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Campo>
					{errores.nombre && <Error>{errores.nombre}</Error>}

					<Campo>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							placeholder="Tu Email"
							name="email"
							value={email}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Campo>
					{errores.email && <Error>{errores.email}</Error>}

					<Campo>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							placeholder="Tu Password"
							name="password"
							value={password}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Campo>
					{errores.password && <Error>{errores.password}</Error>}

					<InputSubmit type="submit" value="Crear Cuenta" />

					{error && <Error>{error}</Error>}
				</Formulario>
			</>
		</Layout>
	);
};

export default CrearCuenta;
