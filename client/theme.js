import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'light',
        // mode: 'dark',
        primary: {
            // main: '#3f51b5',
            main: '#00897b',
        },
        secondary: {
            // main: '#f50057',
            // main: '#00bcd4',
            // main: '#FEAADD',
            main: '#006089'
        },
    },
    typography: {
        fontFamily: 'Chakra Petch',
        h2: {
            fontFamily: 'Lobster',
        },
        h3: {
            fontFamily: 'Tangerine',
        }
    },
})

export default theme