import styled from 'styled-components';

const TopBarStyles = styled.div`
    grid-area: topbar;
    display: flex;
    justify-content: space-between;
    background-color: var(--white);
    padding: var(--gap) var(--gap-lg);
    margin-bottom: var(--gap);
    border-bottom: 1px solid var(--border-color);

    h1 {
        font-weight: 600;
        font-size: 20px;
        text-transform: capitalize;
        margin: 0;
    }

    .timePicker {
        span {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            margin: 0 var(--gap-sm);

            &:last-of-type {
                margin-left: var(--gap);
            }
        }

        input {
            display: inline;
            max-width: 160px;
        }
    }
`;

export default TopBarStyles;
