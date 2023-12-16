import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';
import theme from './src/theme/theme';
import { Routes } from './src/routes/routes';

export default function App() {
  return (
    <PaperProvider theme={theme}>      
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </PaperProvider>
  );
}