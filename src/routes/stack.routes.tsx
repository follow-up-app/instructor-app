import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUp } from '../screens/auth/SignUp';
import { Home } from './home.routes';
import { Execution } from '../screens/schedule/Execution';
import { Procedure } from '../screens/schedule/Procedure';

const Stack = createNativeStackNavigator();

export const StackRoutes = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              title: 'Login',
              headerShown: false,
              headerStyle: {
                backgroundColor: '#FFFF',
              },
              headerTintColor: '#068798',
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Procedure"
            component={Procedure}
            options={{
              headerShown: true,
              headerTitle: 'Executar procedimento'
            }}
          />
        </Stack.Navigator>
      );
}