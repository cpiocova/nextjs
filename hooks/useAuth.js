import React, { useState, useEffect } from "react";
import firebase from "./../firebase";

function useAuth() {
	const [usuarioauth, guardarUsuarioAuth] = useState(null);

	useEffect(() => {
		const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
			if (usuario) {
				guardarUsuarioAuth(usuario);
			} else {
				guardarUsuarioAuth(null);
			}
		});
		return () => unsuscribe();
	}, []);

	return usuarioauth;
}

export default useAuth;
