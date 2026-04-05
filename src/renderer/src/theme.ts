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
  // MuiIcons:{
  //   defaultProps: {
  //     fontSize: 'small'
  //   }
  // },
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
      width: 'fit-content'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //padding: '8px 12px',
          fontSize: '0.9rem',
          width: 'fit-content',
          height: '2.5rem'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small'
      },
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiChip: {
      defaultProps: {
        variant: 'outlined',
        size: 'small'
      },
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          height: '3rem',
          fontSize: '0.9rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: colors.red,
          '&.Mui-error': {
            color: colors.red
          }
        }
      }
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        },
        ul: {
          fontSize: '0.9rem'
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem'
        },
        selectLabel: {
          fontSize: '0.9rem'
        },
        displayedRows: {
          fontSize: '0.9rem'
        },

        actions: {
          '& .MuiSvgIcon-root': {
            fontSize: 30
          }
        }
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

