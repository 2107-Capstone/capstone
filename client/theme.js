import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3f51b5',
            // main: '#00897b',
        },
        secondary: {
            main: '#f50057',
            // main: '#00bcd4',
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