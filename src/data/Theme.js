import { createMuiTheme, colors, adaptV4Theme } from '@material-ui/core';

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
    mode: 'dark',
    primary: colors.amber,
    secondary: colors.grey,
    text: {
      secondary: colors.grey[500],
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 'calc(0.2em + 8px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderColor: 'black',
        },
        outlined: {
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          borderColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1d1d36',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23363659' fill-opacity='0.3'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        hover: {
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04) !important',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 13,
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiPopover: {
      paper: {
        background: '#000',
      },
    },
  },
});
