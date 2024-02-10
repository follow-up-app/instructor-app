import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { getEvents } from '../../service/api-service';
import { CustomSchedule } from '../../components/CustomSchedule';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const Schedule = () => {
    const navigation = useNavigation();
    const [events, setEvents] = React.useState<any>([]);
    const [loading, setLoading] = React.useState(true);
    const fetchData = async () => {
        const listEvents = await getEvents();
        setEvents(listEvents);
        setLoading(false);
    }

    React.useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            fetchData();
        });
        return () => {
            focusListener();
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        animating={true}
                        color='#01878B' />
                </View>
            ) : (
                <CustomSchedule items={events} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15
    },
    loading: {
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
});