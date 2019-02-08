import styled from 'styled-components';

const CostsInputsStyles = styled.div`
    grid-area: inputs;

    h5 {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 12px;
    }

    p {
        font-weight: normal;
        font-size: 14px;
    }

    button {
        display: block;
        margin: 0 auto;
    }

    .inputWrapper {
        span {
            display: block;
            font-weight: 600;
            font-size: 12px;
            margin-top: var(--gap);
            margin-bottom: calc(var(--gap-sm) /2);
        }
        input {
            width: 100%;
        }
    }

    .info {
        display: block;
        margin: var(--gap) 0;
        font-style: italic;
        font-size: 15px;
    }
`;

export default CostsInputsStyles;
