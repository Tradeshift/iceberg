import styled from 'styled-components';

const SingleModelStyles = styled.div`
    display: grid;
    grid-template-columns: 400px auto;
    grid-template-areas: 
        "stats charts"
        "inputs charts";
    grid-gap: var(--gap);
    padding: var(--gap-lg);
    padding-top: 0;
`;

export default SingleModelStyles;