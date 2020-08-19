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
import validarIniciarSesion from "./../validacion/validarIniciarSesion";

const STATE_INICIAL = {
	email: "",
	password: "",
};

const Login = () => {
	const [error, guardarError] = useState(false);

	const {
		valores,
		errores,
		submitform,
		handleChange,
		handleSubmit,
		handleBlur,
	} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

	const { email, password } = valores;

	async function iniciarSesion() {
		try {
			const usurio = await firebase.login(email, password);
			console.log(usurio);
			Router.push("/");
		} catch (error) {
			console.error("Hubo un error al autenticar el usuario", error);
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
					Iniciar Sesión
				</h1>
				<Formulario onSubmit={handleSubmit} noValidate>
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

					<InputSubmit type="submit" value="Iniciar Sesión" />

					{error && <Error>{error}</Error>}
				</Formulario>
			</>
		</Layout>
	);
};

export default Login;
