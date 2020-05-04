import { createMuiTheme, colors } from '@material-ui/core';

export default createMuiTheme({
  typography: {
    fontFamily: 'Poppins',
    fontSize: 18,
    htmlFontSize: 18,
    allVariants: {
      lineHeight: 24 / 18,
    },
  },
  palette: {
    type: 'dark',
    background: '',
    primary: colors.amber,
    secondary: colors.grey,
  },
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary',
    },
  },
  overrides: {
    MuiTypography: {
      gutterBottom: {
        marginBottom: 'calc(0.2em + 8px)',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
      root: {
        background: 'rgba(0, 0, 0, 0.6)',
        borderColor: 'black',
      },
    },
  },
});
