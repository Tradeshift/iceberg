import styled from 'styled-components';

const ModelStyles = styled.div`
    padding: var(--gap) var(--gap-lg);
    padding-top: 0;

    display: flex;
    width: 100%;
    height: calc(100vh - var(--nav-height) - var(--gap));
    flex-flow: column wrap;
    margin-left: - var(--gap);

    @media screen and (max-width: 600px) {
        padding: var(--gap-sm) var(--gap-md);
    }
`;

export default ModelStyles;
