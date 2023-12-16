// theme.ts
import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F2F2F2', // Cor primária
    accent: '#5c5c5c', // Cor de destaque
    background: '#ffffff', // Cor de fundo
    text: '#333333', // Cor do texto
  },
};

export default theme;