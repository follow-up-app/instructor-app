import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Card, Avatar, Chip, ActivityIndicator, ProgressBar, Icon, Button } from 'react-native-paper';


export const Chat = () => {
    return (
        <View style={styles.container}>
            <Chip icon="chat">Em breve essa funcionalidade...</Chip>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        marginTop: 50
    },
});