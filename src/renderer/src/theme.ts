import { createTheme } from '@mui/material/styles'
import { colors } from '@shared/styles/colors'
import fonts from '@shared/styles/fonts'

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.white
    },
    secondary: {
      main: colors.secondary
    },
    error: {
      main: colors.red
    },
    warning: {
      main: colors.warning
    },
    background: {
      default: colors.background,
      paper: colors.white
    }
  },
  typography: {
    fontFamily: fonts.family.default,
    h1: { fontWeight: fonts.weight.bold },
    h2: { fontWeight: fonts.weight.bold },
    h3: { fontWeight: fonts.weight.bold },
    h4: { fontWeight: fonts.weight.bold },
    h5: { fontWeight: fonts.weight.semiBold },
    h6: { 
      fontSize: '1.4rem',
      fontWeight: fonts.weight.semiBold 
    },
    body1: {
      fontSize: '1.2rem'
    },
    body2: {
      fontSize: '1.1rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: fonts.weight.semiBold,
      width:'fit-content'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
          fontSize: '1.5rem',
          width:'fit-content'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium'
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem'
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          height: '2.5rem'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
})

export default theme
