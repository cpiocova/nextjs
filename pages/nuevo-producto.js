import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import Layout from "./../components/layouts/Layout";
import FileUploader from "react-firebase-file-uploader";
import Error404 from "./../components/layouts/404";

import {
	Formulario,
	Campo,
	InputSubmit,
	Error,
} from "./../components/ui/Formulario";

import { FirebaseContext } from "./../firebase";

//validaciones
import useValidacion from "./../hooks/useValidacion";
import validarCrearProducto from "./../validacion/validarCrearProducto";
import { firestore } from "firebase";

const STATE_INICIAL = {
	nombre: "",
	empresa: "",
	imagen: "",
	url: "",
	descripcion: "",
};
const NuevoProducto = () => {
	//state de las imagenes
	const [nombreimagen, guardarNombreImagen] = useState("");
	const [subiendo, guardarSubiendo] = useState(false);
	const [progreso, guardarProgreso] = useState(0);
	const [urlimagen, guardarUrlImagen] = useState("");

	const [error, guardarError] = useState(false);

	const {
		valores,
		errores,
		submitform,
		handleChange,
		handleSubmit,
		handleBlur,
	} = useValidacion(STATE_INICIAL, validarCrearProducto, crearCuenta);

	const { nombre, empresa, imagen, url, descripcion } = valores;

	//hook de routing para redireccionar
	const router = useRouter();

	//context con las operaciones crud de firebase
	const { firebase, usuario } = useContext(FirebaseContext);

	console.log(usuario);

	async function crearCuenta() {
		//si el usuario no esta autenticado llevar al login
		if (!usuario) {
			return router.push("/login");
		}

		// crear el objeto con el nuevo producto
		const producto = {
			nombre,
			empresa,
			url,
			urlimagen,
			descripcion,
			votos: 0,
			comentarios: [],
			creado: Date.now(),
			creador: {
				id: usuario.uid,
				nombre: usuario.displayName,
			},
			haVotado: [],
		};

		// insertarlo en la base e datos
		firebase.db.collection("productos").add(producto);
		return router.push("/");
	}

	const handleUploadStart = () => {
		guardarProgreso(0);
		guardarSubiendo(true);
	};

	const handleProgress = (progreso) => guardarProgreso({ progreso });

	const handleUploadError = (error) => {
		guardarSubiendo(error);
		console.error(error);
	};

	const handleUploadSuccess = (nombre) => {
		guardarProgreso(100);
		guardarSubiendo(false);
		guardarNombreImagen(nombre);
		firebase.storage
			.ref("productos")
			.child(nombre)
			.getDownloadURL()
			.then((url) => {
				guardarUrlImagen(url);
				console.log(url);
			});
	};

	return (
		<Layout>
			{!usuario ? (
				<Error404 />
			) : (
				<>
					<h1
						style={{
							textAlign: "center",
							marginTop: "5rem",
						}}
					>
						Nuevo Producto
					</h1>
					<Formulario onSubmit={handleSubmit} noValidate>
						<fieldset>
							<legend>Información General</legend>
							<Campo>
								<label htmlFor="nombre">Nombre</label>
								<input
									type="text"
									id="nombre"
									placeholder="Nombre del Producto"
									name="nombre"
									value={nombre}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</Campo>
							{errores.nombre && <Error>{errores.nombre}</Error>}

							<Campo>
								<label htmlFor="empresa">Empresa</label>
								<input
									type="text"
									id="empresa"
									placeholder="Tu Empresa o Compañía"
									name="empresa"
									value={empresa}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</Campo>
							{errores.empresa && <Error>{errores.empresa}</Error>}

							<Campo>
								<label htmlFor="imagen">Imagen</label>
								<FileUploader
									accept="image/*"
									id="imagen"
									name="imagen"
									style={{ fontSize: "1.8rem" }}
									randomizeFilename
									storageRef={firebase.storage.ref("productos")}
									onUploadStart={handleUploadStart}
									onUploadError={handleUploadError}
									onUploadSuccess={handleUploadSuccess}
									onProgress={handleProgress}
								/>
							</Campo>

							<Campo>
								<label htmlFor="url">URL</label>
								<input
									type="url"
									id="url"
									name="url"
									placeholder="URL de tu producto"
									value={url}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</Campo>
							{errores.url && <Error>{errores.url}</Error>}
						</fieldset>

						<fieldset>
							<legend>Sobre tu Producto</legend>
							<Campo>
								<label htmlFor="descripcion">Descripción</label>
								<textarea
									id="descripcion"
									name="descripcion"
									value={descripcion}
									onChange={handleChange}
									onBlur={handleBlur}
								></textarea>
							</Campo>
							{errores.descripcion && <Error>{errores.descripcion}</Error>}
						</fieldset>

						<InputSubmit type="submit" value="Crear Producto" />

						{error && <Error>{error}</Error>}
					</Formulario>
				</>
			)}
		</Layout>
	);
};

export default NuevoProducto;
