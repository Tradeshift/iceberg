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
    width: calc(100% - var(--gap)*2);
    min-height: 40px;
    cursor: pointer;

    ${props => props.secondary && `
        background-color: var(--white);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        width: auto;
    `};

    ${props => props.disabled && `
        background-color: var(--bg-color-disabled);
        border: 1px solid var(--border-color-disabled);
        color: var(--text-color-disabled);
        pointer-events: none;
    `};

    &:hover {
        background-color: #0084cc;
        ${props => props.secondary && 'background-color: rgba(203, 215, 220, 0.5);'};
    }
    &:focus {
        outline: none;
    }
`;

export default ButtonStyles;
