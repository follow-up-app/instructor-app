import * as React from 'react';
import { Avatar, Menu, Appbar, Text, Icon } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getUserAvatarId } from '../service/api-service';
import followUp from './../../assets/img/follow_up.png'

const loadAvatar = (id: any) => {
    return getUserAvatarId(id);
}

export const CustomHeader = ({ user }: any) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Appbar.Header>
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
                                <Avatar.Icon
                                    icon="account-circle"
                                    size={50}
                                    source={loadAvatar(user.id)}
                                />
                            }
                        >
                            <Menu.Item onPress={() => { }} title="Sair" />
                        </Menu>
                    </TouchableOpacity>
                </View>
            </View>
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
});
