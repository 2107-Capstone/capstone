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
            // //splitwise red
            // main: '#AD2134'

            //pink
            // main: '#f50057',
            
            //turquoise
            // main: '#00bcd4',

            //light pink
            // main: '#FEAADD',

            //dark park
            // main: '#9F234C'
            //lighter maroon
            // main: 'rgb(156,84,112,.8)'
            //darker light blue
            main: '#1868A2',

        },
        text: {
            light: {
                primary: "#FFFFFF",
<<<<<<< HEAD
                secondary: '#CECECE'
            },
            dark: {
                primary: '#000000',
                secondary: '#908D8D'
=======
                secondary: '#C1BEBE'
            },
            dark: {
                primary: '#000000',
                secondary: '#565454'
>>>>>>> main
            }
        }
    },
    typography: {
        fontFamily: 'Chakra Petch',
        h2: {
            fontFamily: 'Lobster',
        },
        h3: {
            fontFamily: 'Tangerine',
        },
        
    },
})

export default theme