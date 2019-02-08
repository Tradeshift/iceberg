import styled from 'styled-components';

const CardStyles = styled.div`
    background-color: var(--white);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    box-shadow: 0 5px 10px 0 var(--shadow-color);
    padding: var(--gap);

    h5 {
        font-weight: 600;
        font-size: 17px;
    }
`;

export default CardStyles;
