import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { getEvents } from '../../service/api-service';
import { CustomSchedule } from '../../components/CustomSchedule';
import { ActivityIndicator } from 'react-native-paper';
import { isEmptyArray } from 'formik';

export const Schedule = () => {
    const [events, setEvents] = React.useState<any>([]);
    const fetchData = async () => {
        const listEvents = await getEvents();
        setEvents(listEvents);
    }
    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {events ? (
                <CustomSchedule items={events} />
            ) : (
                <ActivityIndicator
                    animating={true}
                    color='#01878B' />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15
    },
});