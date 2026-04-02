import { createGlobalStyle } from 'styled-components'


export const GlobalStyle = createGlobalStyle`
/* Customize the scrollbar in Firefox */
* {
  scrollbar-width: thin; /* "auto", "thin", or "none" */
  scrollbar-color: #888 inherit; /* thumb and track color */
}
:host {
  -webkit-text-size-adjust: 100%;
}
/* Customize the scrollbar */
::-webkit-scrollbar {
  width: 10px; /* Width of the scrollbar */
  background-color: #14263e; /* Background color of the scrollbar track */
}

/* Customize the scrollbar thumb (the draggable part) */
::-webkit-scrollbar-thumb {
  background-color: #14263e; /* Color of the scrollbar thumb */
  border-radius: 5px; /* Rounded corners */
}

/* Customize the scrollbar thumb on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #14263e; /* Color of the scrollbar thumb on hover */
}
:root {
  font-family: 'Montserrat', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  background: #14263e;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --muted: #a1a1aa;
  --text: #18181b;
  --blue: #2d4c70;
  --indigo: #5603ad;
  --light-blue: #c6d9f1;
  --purple: #8965e0;
  --pink: #d99694;
  --red: #ed5f74;
  --red-dark: #cd3d64;
  --light-red: #f02849;
  --orange: #fb6340;
  --yellow: #ffd600;
  --green: #33c27f;
  --green-dark: #1ea672;
  --light-green: #90ee90;
  --default-light: #f1f5f9;
  --default: #e2e9ef;
  --default-dark: #c1cad2;
  --teal: #11cdef;
  --cyan: #2bffc6;
  --white: #fff;
  --gray: #bababa;
  --gray-dark: #32325d;
  --lighter: #f0f2f5;
  --light: #e6e8eb;
  --primary: #14263e;
  --primary-dark: #0d1929;
  --secondary: #93cddd;
  --success: #2dce89;
  --info: #11cdef;
  --warning: #fb6340;
  --danger: #f5365c;
  --dark: #212529;
  --white: #fff;
  --neutral: #fff;
  --darker: black;
  --tw-shadow-color: inherit;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

.border-red {
  border: 1px solid red !important;
}

.bg-primary {
  background: #14263e;
}

.text-primary {
  color: #14263e;
}

.btn-primary {
  min-width: 120px;
  min-height: 30px;
  background: #14263e;
}

.h-40px {
  height: 40px;
}
.border-primary {
  border: 2px solid #14263e;
}
.border-pbottom {
  border-bottom: 1px solid #14263e;
}
.border-ptop {
  border-top: 1px solid #14263e;
}
.margin-top-60px {
  margin-top: -90px !important;
}
.custom-quill-editor .ql-editor {
  min-height: 200px;
  padding: 10px;
  font-size: 16px;
  border: none;
  /*background-color: #f1f6fa;*/
}
.custom-quill-editor .ql-toolbar {
  background-color: white; /* Set toolbar background to white */
  color: black; /* Optional: Set text color */
}

.border-left-primary {
  border-left: 5px solid #14263e;
}

.dotted-line {
  border-top: 1px dashed black;
  margin: 8px 0;
}

`
