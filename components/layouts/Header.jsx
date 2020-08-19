import React, { useContext } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Buscar from './../ui/Buscar';
import Navegacion from './Navegacion';
import Boton from './../ui/Boton';
import { FirebaseContext } from './../../firebase';

const HeaderTag = styled.header`
  border-bottom: 2px solid var(--gris3);
  padding: 1rem 0;
`;

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: 'Roboto Slab', serif;
  margin-right: 2rem;
  cursor: pointer;
  user-select: none;
`;

const DivLog = styled.div`
  display: flex;
  align-items: center;
`;

const ParrafoSaludo = styled.p`
  margin-right: 2rem;
`;


const Header = () => {

  const { usuario, firebase } = useContext(FirebaseContext);

  return (
    <HeaderTag>
      <ContenedorHeader>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          <Buscar />
          <Navegacion />
        </div>

        <DivLog>

          {usuario ?
            (
              <>
                <p style={{ marginRight: '2rem' }}>Hola: {usuario.displayName} </p>
                <Boton
                  bgColor="true"
                  onClick={() => firebase.cerrarSesion()}
                >Cerrar Sesión</Boton>
              </>
            ) :
            (
              <>
                <Link href="/login">
                  <Boton bgColor="true">Login</Boton>
                </Link>

                <Link href="/crear-cuenta">
                  <Boton>Crear Cuenta</Boton>
                </Link>
              </>
            )
          }
        </DivLog>
      </ContenedorHeader>
    </HeaderTag >
  );
}

export default Header;
