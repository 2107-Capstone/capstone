import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        // mode: 'light',
        mode: 'dark',
        primary: {
            //purple-blue
            // main: '#3f51b5', 
            //splitwise green
            main: '#00897b'

            //darker light blue
            // main: '#006089'
        },
        secondary: {

            //pink
            // main: '#f50057',

            //light pink
            // main: '#FEAADD',

            //grey
            // main: '#C2C2C2'

            //darker light blue
            main: '#1868A2',

        },
        text: {
            light: {
                primary: "#FFFFFF",
                secondary: '#C1BEBE'
            },
            dark: {
                primary: '#000000',
                secondary: '#565454'
            }
        }
    },
    typography: {
        fontFamily: 'Chakra Petch',
        h2: {
            fontFamily: 'Lobster',
        },
        h3: {
            // fontFamily: 'Tangerine',
        },

    },
})

export default theme