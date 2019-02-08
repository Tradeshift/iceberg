import styled from 'styled-components';

const StatsStyles = styled.div`
    background-color: var(--white);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    box-shadow: 0 5px 10px 0 var(--shadow-color);
    padding: var(--gap);

    div {
        grid-area: stats;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding: var(--gap-sm) 0;

        &:last-of-type {
            border-bottom: none;
        }

        h5, p {
            margin: 0;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
        }
    }
`;

export default StatsStyles;
