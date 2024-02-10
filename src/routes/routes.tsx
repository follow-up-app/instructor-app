import * as React from 'react';
import IUser from '../interfaces/user.type';
import { getCurrentUser, logout } from '../service/api-service';
import { useNavigation } from '@react-navigation/native';
import { Home } from './home.routes';
import { StackRoutes } from './stack.routes';

export const Routes = () => {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = React.useState<IUser | null>();

    const fetchUser = async () => {
        const user = await getCurrentUser();
        // if (!user.email) {
        //     // navigation.navigate('SignUp');
        // }
        // setCurrentUser(user);
    }

    const signOut = async () => {
        await logout();
        setCurrentUser(null);
    }

    React.useEffect(() => {
        // signOut();

        // fetchUser();
    }, []);

    return (
        currentUser ? (
            <><Home/></>
        ) : (
            <StackRoutes />
        )
    );
}