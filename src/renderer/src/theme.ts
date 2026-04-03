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
    fontSize: 24,
    fontFamily: fonts.family.default,
    h1: { fontSize: '2.5rem', fontWeight: fonts.weight.bold },
    h2: { fontSize: '2rem', fontWeight: fonts.weight.bold },
    h3: { fontSize: '1.75rem', fontWeight: fonts.weight.bold },
    h4: { fontSize: '1.5rem', fontWeight: fonts.weight.bold },
    h5: { fontSize: '1.25rem', fontWeight: fonts.weight.semiBold },
    h6: { 
      fontSize: '1rem',
      fontWeight: fonts.weight.semiBold 
    },
    body1: {
      fontSize: '1.25rem'
    },
    body2: {
      fontSize: '1rem'
    },
    caption: {
      fontSize: '0.9rem'
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
          width:'fit-content',
          height:'5rem'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium'
      },
      styleOverrides: {
        root: {
          //fontSize: '1.25rem'
        }
      }
    },
    MuiTab:{
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiChip:{
       defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          //fontSize: '1.3rem',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          //fontSize: '1.25rem'
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          //fontSize: '1.25rem'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          fontSize: '1.5rem'
        },
      }
    },
    // MuiChip: {
    //   styleOverrides: {
    //     root: {
    //       //fontSize: '1.1rem',
    //       height: '2.5rem'
    //     }
    //   }
    // },
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
