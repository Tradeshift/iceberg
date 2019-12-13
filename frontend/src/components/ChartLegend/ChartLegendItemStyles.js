import styled from 'styled-components';

const ChartLegendItemStyles = styled.div`
    display: flex;
    align-items: center;

    .square {
        width: var(--gap);
        height: var(--gap);
        margin-right: var(--gap-xs);
        margin-left: var(--gap-sm);
        border-radius: var(--radius);
        ${props => props.color && `
            background-color: ${props.color};
        `};
    }
    
    p {
        font-weight: 600;
        font-size: var(--font-xxs);
        color: var(--text-legend);
        margin: 0;
        padding: 0;
	}
`;

export default ChartLegendItemStyles;
