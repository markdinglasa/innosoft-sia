## Profile
Software Developer : Mark Dinglasa

## 2024-03-09 4:40PM
*   Problem
    -  On production build the database configuration and licensing page, should be rendered first before the app, I tried using the 

*   Provider
    -   issue on production build the Provider cannot recognized, and the display would just be a blank
*   State Management as conditional
    -   cannot render on production build, blank display
*   Multiple windowForm in electron main
    -   cannot build the other component which is the connection.html, licensing.html which is in the same directory of the index.html


## OTHER SOLUTION TO TRY
* Create another app which its purpose is to set database connection and licensing //for Trial Clients