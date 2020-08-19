import styled from '@emotion/styled';

const Boton = styled.a`
  display: block;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  padding: .8rem 2rem;
  margin: 2rem auto;
  text-align: center;
  background-color: ${ props => props.bgColor ? '#DA552F' : 'white'};
  color: ${props => props.bgColor ? 'white' : '#000'};
  cursor: pointer;


  &:last-of-type {
    margin-right: 0;
  }

  

`;

export default Boton;