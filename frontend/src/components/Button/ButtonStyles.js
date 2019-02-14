import styled from 'styled-components';

const ButtonStyles = styled.button`
    background-color: var(--blue);
    color: var(--white);
    padding: var(--gap-sm) var(--gap);
    border: none;
    border-radius: var(--gap);
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.4px;
    width: 340px;
    cursor: pointer;
    &:hover {
        background-color: #0084cc;
    }
    &:focus {
        outline: none;
    }
`;

export default ButtonStyles;
