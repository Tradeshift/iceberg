import styled from 'styled-components';

const DataNotFoundStyles = styled.div`
    width: calc(75% - var(--gap));
    height: calc(50% - var(--gap)/2);
    margin: 0 0 var(--gap) var(--gap);

    &:nth-of-type(2n){
        margin: 0;
        margin-left: var(--gap);
    }

    > div {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    h4 {
        font-weight: 600;
        text-transform: uppercase;
        font-size: var(--font-xs);
        margin-top: var(--gap-md);
    }

    p {
        text-align: center;
        font-size: var(--font-sm);
        line-height: 20px;
        color: #506C78;
    }
`;

export default DataNotFoundStyles;
