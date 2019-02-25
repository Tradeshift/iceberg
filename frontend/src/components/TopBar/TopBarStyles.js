import styled from 'styled-components';

const TopBarStyles = styled.div`
    grid-area: topbar;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--nav-height);
    background-color: var(--white);
    padding: var(--gap) var(--gap-lg);
    margin-bottom: var(--gap);
    border-bottom: 1px solid var(--border-color);

    @media screen and (max-width: 600px) {
        padding: var(--gap-sm) var(--gap-md);
    }

    h1 {
        font-weight: 600;
        font-size: var(--font-xl);
        margin: 0;
    }

    .timePicker {
        span {
            font-weight: 600;
            font-size: var(--font-xs);
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

        button {
            width: auto;
            margin-left: var(--gap);
        }
    }
`;

export default TopBarStyles;
