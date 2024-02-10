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
import { Chat } from '../screens/chat/Chat';
import { Profile } from '../screens/profile/Profile';

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
                        header: (props) => <CustomHeader />,
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
                    name="Chat"
                    component={Chat}
                    options={{
                        header: (props) => <CustomHeader />,
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
                    component={Profile}
                    options={{
                        header: (props) => <CustomHeader />,
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
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
});
