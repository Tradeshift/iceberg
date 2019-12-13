import styled from 'styled-components';

const ChartLegendStyles = styled.div`
    margin-bottom: var(--gap-sm);

    .legend-wrapper {
        display: flex;
	    justify-content: flex-end;
    }
    
    .note {
        display: block;
        text-align: right;
        margin: 0;
        margin-top: var(--gap-xs);
        font-size: var(--font-xs);
        color: var(--text-legend);
        font-style: italic;
    }
`;

export default ChartLegendStyles;