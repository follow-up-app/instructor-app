import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUp } from '../screens/auth/SignUp';
import { Home } from './home.routes';
import { Execution } from '../screens/schedule/Execution';
import { Procedure } from '../screens/schedule/Procedure';
import { CustomHeader } from '../components/CustomHeader';
import IUser from '../interfaces/user.type';
import { getCurrentUser } from '../service/api-service';
import { ListExecutions } from '../screens/schedule/ListExecutions';

const Stack = createNativeStackNavigator();

export const StackRoutes = () => {
  // const [currentUser, setCurrentUser] = React.useState<IUser | null>();

  // const fetchUser = async () => {
  //   const user = await getCurrentUser();
  //   setCurrentUser(user);
  // }

  React.useEffect(() => {
    // fetchUser();
  }, []);

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
        name="Event"
        component={Execution}
        options={{
          header: (props) => <CustomHeader />,
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
      <Stack.Screen
        name="ListExecutions"
        component={ListExecutions}
        options={{
          headerShown: true,
          headerTitle: 'Lista de  execuções'
        }}
      />
    </Stack.Navigator>
  );
}