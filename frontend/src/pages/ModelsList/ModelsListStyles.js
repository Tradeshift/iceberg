import styled from 'styled-components';

const ModelsListStyles = styled.div`
    padding: var(--gap-sm) var(--gap-lg);

    @media screen and (max-width: 600px) {
        padding: var(--gap-sm) var(--gap-md);
    }

    /* Override table styling */
    .ReactTable {
        background-color: var(--white);
        border-radius: var(--radius);
        .rt-thead.-header {
            display: none;
        }

        .rt-th, .rt-td {
            padding: 10px;
        }

        .rt-td {
            font-size: var(--font-md);
        }

        .rt-th {
            background: none;
            border-bottom: 1px solid #F1F4F6;
            text-align: left;
            font-size: var(--font-md);

            .table-search input::placeholder {
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                text-align: left;
                opacity: 1;
                color: var(--text-color);
            }
        }

        .-pagination {
            background-color: #F1F4F6;
            box-shadow: none;
            border: 0;
            padding: var(--gap-sm);
            border-radius: 0 0 var(--radius) var(--radius);

            .-pageInfo {
                font-size: var(--font-sm);
                font-weight: 600;
                text-transform: uppercase;
            }
    
            .-pageSizeOptions {
                position: absolute;
                right: var(--gap);
                margin: 0!important;
            }

            .-center {
                flex: 0;
            }
        
            .-previous, .-next {
                .-btn, .-btn:not([disabled]):hover {
                    background: none;
                    color: var(--blue);
                }
            
                .-btn:hover {
                    text-decoration: underline;
                }
            
                .-btn[disabled]{
                    color: var(--text-color-disabled);
                    opacity: 1;
                    font-weight: 600;
                    pointer-events: none;
                }
            }
        
            .-previous {
                padding-right: var(--gap);
                .-btn {
                    text-align: right;
                }
            }
        
            .-next {
                padding-left: var(--gap);
                .-btn {
                    text-align: left;
                }
            }
        }
    }
`;

export default ModelsListStyles;
