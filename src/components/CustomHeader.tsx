import * as React from 'react';
import { Avatar, Menu, Appbar, Text, Icon, ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getCurrentUser, getUserAvatarId, logout } from '../service/api-service';
import followUp from './../../assets/img/follow_up.png'
import IUser from '../interfaces/user.type';

export const CustomHeader = () => {
    const [currentUser, setCurrentUser] = React.useState<IUser | null>();
    const [loadAvatar, setLoadAvatar] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const fetchUser = async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);
        if (user.image_path !== null) {
            const avatar = await getUserAvatarId(user.id);
            setLoadAvatar(avatar);
        }
        setLoading(false);
    }

    React.useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Appbar.Header>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        animating={true}
                        color='#01878B' />
                </View>

            ) : (
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Image source={followUp} style={styles.logo} />
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={openMenu}>
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    loadAvatar ? (
                                        <Avatar.Image
                                            size={50}
                                            source={{ uri: loadAvatar }}
                                        />
                                    ) : (
                                        <Avatar.Icon
                                            icon="account-circle"
                                            size={50}
                                        />
                                    )
                                }
                            >
                                <Menu.Item onPress={() => { signOut }} title="Sair" />
                            </Menu>
                        </TouchableOpacity>
                    </View>
                </View>
            )}





        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 100,
        width: 400,
        marginTop: 10,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    logo: {
        width: 150,
        height: 30,
    },
    avatarContainer: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loading: {
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
