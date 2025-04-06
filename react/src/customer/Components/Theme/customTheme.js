
import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    primary: { main: '#004e64' },
    secondary: { main: '#ff6b6b' },
    background: { default: '#f4f4f4' },
  },
  typography: {
    fontFamily: 'Rubik, sans-serif'
  }
});

export default customTheme;
