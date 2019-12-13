import styled from 'styled-components';

const CardStyles = styled.div`
    background-color: var(--white);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    box-shadow: 0 5px 10px 0 var(--shadow-color);
    padding: var(--gap);
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;

    h5 {
        font-weight: 600;
        font-size: var(--font-lg);
    }

    ${props => props.withLegend && `
        .title--with-legend {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: var(--gap) var(--gap-sm);
            padding-top: 0;

            h3 {
                font-weight: 600;
                font-size: var(--font-xs);
                margin: 0;
            }

            @media screen and (max-width: 600px) {
                flex-wrap: wrap;
            }
        }
        
    `}
`;

export default CardStyles;
