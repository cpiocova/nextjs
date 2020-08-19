import React, { useState } from 'react';
import styled from '@emotion/styled';
import Router from 'next/router';

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;

const ButtonSubmit = styled.button`
  position: absolute;
  right: 1rem;
  top: 1px;
  display: block;
  height: 3rem;
  width: 3rem;
  background-color: white;
  background-image: url('/static/img/buscar.png');
  background-size: 4rem;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  text-indent: -9999px;
`;

const Buscar = () => {

  const [busqueda, guardarBusqueda] = useState('');

  const buscarProducto = e => {
    e.preventDefault();

    if (busqueda.trim() === '') return;

    // redireccionar a /buscar
    Router.push({
      pathname: '/buscar',
      query: { q: busqueda }
    })
  }

  return (
    <form
      style={{ position: 'relative' }}
      onSubmit={buscarProducto}
    >
      <InputText
        type="text"
        placeholder="Buscar Producto"
        onChange={e => guardarBusqueda(e.target.value)}
      />
      <ButtonSubmit type="submit">Buscar</ButtonSubmit>
    </form>
  );
}

export default Buscar;
