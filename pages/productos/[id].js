import React, { useEffect, useContext, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FirebaseContext } from "./../../firebase";
import Error404 from "./../../components/layouts/404";
import Layout from "./../../components/layouts/Layout";
import { Campo, InputSubmit } from "./../../components/ui/Formulario";
import Boton from "./../../components/ui/Boton";

const ContenedorProducto = styled.div`
	@media (min-width: 768px) {
		display: grid;
		grid-template-columns: 2fr 1fr;
		column-gap: 2rem;
	}
`;

const CreadorProducto = styled.p`
	display: inline-block;
	padding: 0.5rem 2rem;
	background-color: #da552f;
	color: #fff;
	text-transform: uppercase;
	font-weight: bold;
	text-align: center;
`;

const Producto = () => {
	const [producto, guardarProducto] = useState({});
	const [error, guardarError] = useState(false);
	const [comentario, guardarComentario] = useState({});
	const [consultarDB, guardarConsultarDB] = useState(true);

	//Routing para obtener id actual
	const router = useRouter();
	const {
		query: { id },
	} = router;

	const { firebase, usuario } = useContext(FirebaseContext);

	useEffect(() => {
		if (id && consultarDB) {
			const obtenerProducto = async () => {
				const productoQuery = await firebase.db.collection("productos").doc(id);
				const producto = await productoQuery.get();
				if (producto.exists) {
					guardarProducto(producto.data());
					guardarConsultarDB(false);
				} else {
					guardarError(true);
					guardarConsultarDB(false);
				}
			};
			obtenerProducto();
		}
	}, [id]);

	if (Object.keys(producto).length === 0 && !error) return "Cargando ...";

	const {
		// id,
		comentarios,
		creado,
		descripcion,
		empresa,
		nombre,
		url,
		urlimagen,
		votos,
		creador,
		haVotado,
	} = producto;

	const votarProducto = () => {
		if (!usuario) {
			router.push("/login");
		}
		//obtener y sumar un nuevo voto
		const nuevoTotal = votos + 1;

		if (haVotado.includes(usuario.uid)) return;

		// Guardar el id del usuario que ha votado
		const nuevoHaVotado = [...haVotado, usuario.uid];

		//Actualizar en la BD
		firebase.db
			.collection("productos")
			.doc(id)
			.update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

		//Actualizar el state
		guardarProducto({
			...producto,
			votos: nuevoTotal,
		});

		guardarConsultarDB(true);
	};

	// Funciones para crear comentario
	const comentarioChange = (e) => {
		guardarComentario({
			...comentario,
			[e.target.name]: e.target.value,
		});
	};

	//  Identifica si el comentario es del creador del producto
	const esCreador = (id) => {
		if (creador.id === id) {
			return true;
		}
	};

	const agregarComentario = (e) => {
		e.preventDefault();

		if (!usuario) {
			router.push("/login");
		}

		//informacion extra al comentario
		comentario.usuarioId = usuario.uid;
		comentario.nombre = usuario.displayName;

		//Tomar copia de comentarios y agregarlos al arreglo

		const nuevosComentarios = [...comentarios, comentario];

		//Actualizar la BD
		firebase.db.collection("productos").doc(id).update({
			comentarios: nuevosComentarios,
		});

		//Actualizar el State
		guardarProducto({
			...producto,
			comentarios: nuevosComentarios,
		});

		guardarConsultarDB(true);
	};

	// funcion que revisa que el creador del producto sea el mismo qque esta autenticado

	const puedeBorrar = () => {
		if (!usuario) return false;
		if (creador.id === usuario.uid) return true;
	};

	//elimina un producto de la bd
	const eliminarProducto = async () => {
		if (!usuario) {
			return router.push("/login");
		}
		if (creador.id !== usuario.uid) {
			return router.push("/");
		}
		try {
			await firebase.db.collection("productos").doc(id).delete();
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Layout>
			<>
				{error ? (
					<Error404 />
				) : (
					<div className="contenedor">
						<h1
							style={{
								textAlign: "center",
								marginTop: "5rem",
							}}
						>
							{nombre}
						</h1>
						<ContenedorProducto>
							<div>
								<p>
									Publicado hace:{" "}
									{formatDistanceToNow(new Date(creado), { locale: es })}.
								</p>
								<p>
									Por: {creador.nombre} de {empresa}
								</p>
								<img src={urlimagen} />
								<p>{descripcion}</p>

								{usuario && (
									<>
										<h2>Agrega tu comentario</h2>
										<form onSubmit={agregarComentario}>
											<Campo>
												<input
													type="text"
													name="mensaje"
													onChange={comentarioChange}
												/>
											</Campo>
											<InputSubmit type="submit" value="Agregar Comentario" />
										</form>
									</>
								)}

								<h2 style={{ margin: "2rem 0" }}>Comentarios</h2>
								{comentarios.length === 0 ? (
									"Aún no hay comentarios"
								) : (
									<ul>
										{comentarios.map((comentario, i) => (
											<li
												key={`${comentario.usuarioId}-${i}`}
												style={{
													border: "1px solid #e1e1e1",
													padding: "2rem",
												}}
											>
												<p>{comentario.mensaje}</p>
												<p>
													Escrito por:{" "}
													<span style={{ fontWeight: "bold" }}>
														{comentario.nombre}
													</span>
												</p>
												{esCreador(comentario.usuarioId) && (
													<CreadorProducto>Es Creador</CreadorProducto>
												)}
											</li>
										))}
									</ul>
								)}
							</div>
							<aside>
								<Boton target="_blank" bgColor="true" href={url}>
									Visitar URL
								</Boton>

								<div style={{ marginTop: "5rem" }}>
									<p style={{ textAlign: "center" }}>{votos} Votos</p>

									{usuario && <Boton onClick={votarProducto}>Votar</Boton>}
								</div>
							</aside>
						</ContenedorProducto>

						{puedeBorrar() && (
							<Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
						)}
					</div>
				)}
			</>
		</Layout>
	);
};

export default Producto;
