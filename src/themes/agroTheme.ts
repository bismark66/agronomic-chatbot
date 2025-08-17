import { createTheme } from '@mantine/core';

export const agroTheme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  colors: {
    green: [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#14532d',
    ],
    'agro-secondary': [
      '#f7fee7',
      '#ecfccb',
      '#d9f99d',
      '#bef264',
      '#a3e635',
      '#84cc16',
      '#65a30d',
      '#4d7c0f',
      '#365314',
      '#1a2e05',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
        centered: true,
      },
    },
  },
});