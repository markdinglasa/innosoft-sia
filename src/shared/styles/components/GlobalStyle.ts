import { createGlobalStyle } from 'styled-components'

import { colors, fonts } from '../'

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%; /* 1rem = 10px */
  }
  * {
    scrollbar-width: thin; /* "auto", "thin", or "none" */
    scrollbar-color: #888 inherit; /* thumb and track color */
    overflow:none;
  }
  :host {
    -webkit-text-size-adjust: 100%;
  }
  /* Customize the scrollbar */
  ::-webkit-scrollbar {
    width: 1rem; /* Width of the scrollbar */
    background-color: #FFF; /* Background color of the scrollbar track */
  }

  /* Customize the scrollbar thumb (the draggable part) */
  ::-webkit-scrollbar-thumb {
    background-color: #14263e; /* Color of the scrollbar thumb */
    border-radius: 0.5rem; /* Rounded corners */
  }

  /* Customize the scrollbar thumb on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #14263e; /* Color of the scrollbar thumb on hover */
  }

  * {
    box-sizing: border-box;
  }

  body {
    background: ${colors.palette.neutral['075']};
    color: ${colors.primary};
    font-family: ${fonts.family.default};
    font-size: 1.4rem;
    font-weight: ${fonts.weight.regular};
    margin: 0;
  }

  a {
    color: ${colors.palette.blue['500']};
  }

  b,
  strong {
    font-weight: ${fonts.weight.bold};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: ${fonts.lineHeight.default};
    margin: 0;
  }

  .mb-1{
    margin-bottom: 5px;
  }
  .mb-2{
    margin-bottom: 10px;
  }
  .mb-3{
    margin-bottom: 15px;
  }
  .mb-4{
    margin-bottom: 20px;
  }


  h1 {
    font-size: 2.4rem;
  }

  h2 {
    font-size: 2.0rem;
  }

  h3 {
    font-size: 1.6rem;
  }

  h4 {
    font-size: 1.4rem;
  }

  p {
    margin: 0 0 20px 0;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  .TablePagination {
    display: flex;
    justify-content: end;
    align-items: center;
    height: 3rem;
    text-align: center;
    overflow: hidden; 

    &::-webkit-scrollbar: {
        display: none;
    };

    & .MuiTablePagination-toolbar: {
        justify-content: center;
    };
    & .MuiTablePagination-actions: {
        margin-left: auto; 
    };
    & .MuiTablePagination-spacer: {
        flex: none;
    };
    & .MuiTablePagination-selectLabel; & .MuiTablePagination-displayedRows: {
        margin-bottom:-0rem;
    };
  }
`
