import * as React from 'react';
import IUser from '../interfaces/user.type';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar, Menu, Appbar, Text, Icon } from 'react-native-paper';
import followUp from './../../assets/img/follow_up.png'
import { getCurrentUser, getUserAvatarId } from '../service/api-service';
import { Schedule } from '../screens/schedule/Schedule';
import { CustomHeader } from '../components/CustomHeader';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { Execution } from '../screens/schedule/Execution';

const Tab = createBottomTabNavigator();

export const Home: React.FC = () => {
    const [currentUser, setCurrentUser] = React.useState<IUser | null>();

    const fetchUser = async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);
    }

    React.useEffect(() => {
        fetchUser();
    }, []);

    return (
        currentUser ? (
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#068798',
                    tabBarInactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen
                    name="Programs"
                    component={Schedule}
                    options={{
                        header: (props) => <CustomHeader {...props} user={currentUser} />,
                        tabBarLabel: "",
                        tabBarIcon: () => (
                            <Icon
                                source="calendar-range-outline"
                                size={24}
                                color="#BCC1CD"
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Execution"
                    component={Execution}
                    options={{
                        header: (props) => <CustomHeader {...props} user={currentUser} />,
                        tabBarLabel: "",
                        tabBarIcon: () => (
                            <Icon
                                source="play-outline"
                                size={24}
                                color="#BCC1CD"
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Chat"
                    component={Schedule}
                    options={{
                        headerShown: false,
                        tabBarLabel: "",
                        tabBarIcon: () => (
                            <Icon
                                source="chat-processing-outline"
                                size={24}
                                color="#BCC1CD"

                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={Schedule}
                    options={{
                        headerShown: false,
                        tabBarLabel: "",
                        tabBarIcon: () => (
                            <Icon
                                source="account-outline"
                                size={24}
                                color="#BCC1CD"
                            />
                        )
                    }}
                />
            </Tab.Navigator>
        ) : (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color='#01878B' />
            </View>
        )
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
});
