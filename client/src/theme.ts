import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0047AB', // Cobalt Blue (Classic Banking)
      light: '#336BBF',
      dark: '#003380',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2E7D32', // Trust Green
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#F1F5F9',
      contrastText: '#1E293B',
    },
    background: {
      default: '#F1F5F9', // Light Gray-Blue background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: { fontWeight: 700, color: '#0F172A' },
    h2: { fontWeight: 700, color: '#0F172A' },
    h3: { fontWeight: 600, color: '#0F172A' },
    h4: { fontWeight: 600, color: '#1E293B' },
    h5: { fontWeight: 600, color: '#1E293B' },
    h6: { fontWeight: 600, color: '#1E293B' },
    subtitle1: { fontWeight: 500, color: '#475569' },
    subtitle2: { fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F1F5F9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          borderRight: '1px solid #E2E8F0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 12px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 71, 171, 0.08)',
            color: '#0047AB',
            '& .MuiListItemIcon-root': {
              color: '#0047AB',
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 71, 171, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: '#F8FAFC',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#64748B',
          minWidth: 40,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#CBD5E1',
            },
            '&:hover fieldset': {
              borderColor: '#94A3B8',
            },
          },
        },
      },
    },
  },
});

export default theme;
