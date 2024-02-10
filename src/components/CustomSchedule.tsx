import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule, LocaleConfig } from 'react-native-calendars';
import { format } from 'date-fns';
import { Avatar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUrl } from '../service/api-service';

LocaleConfig.locales['br'] = {
    monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ],

    monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
    dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
    today: "Hoje"
};

LocaleConfig.defaultLocale = 'br';

interface SchedulerProps {
    items?: AgendaSchedule;
}

export type RootStackParamList = {
    Event: {
        id: string,
        refresh: boolean,
    } | undefined;
};

export const CustomSchedule: React.FC<SchedulerProps> = ({ items }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const url = getUrl();

    const loadItems = (day: DateData) => {
        const itms = items || {};
    }

    const renderItem = (reservation: any) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Event', { id: reservation.id, refresh: true })}
            >
                <View>
                    <Text>{reservation.hour_start}:00 - {reservation.hour_end}:00</Text>
                </View>
                <View style={styles.lineSpacing} />
                <View style={styles.rowContainer}>
                    {
                        reservation.avatar ? (
                            <Avatar.Image
                                size={40}
                                source={{ uri: url + 'students/avatar/' + reservation.student }}
                                style={styles.avatar}
                            />

                        ) : (
                            <Avatar.Icon
                                icon="account-circle"
                                size={40}
                                style={styles.avatar}
                                color="#5c5c5c"
                            />
                        )
                    }
                    <Text style={styles.nameText}>{reservation.name} </Text>
                </View>
            </TouchableOpacity>
        );
    }

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name;
    }

    return (
        <Agenda
            items={items}
            loadItemsForMonth={loadItems}
            selected={format(new Date(), 'yyyy-MM-dd')}
            renderItem={renderItem}
            renderEmptyData={() => {
                return (
                    <View style={styles.emptyDate}>
                        <Text>Sem agenda nesta data!</Text>
                    </View>)
            }}
            rowHasChanged={rowHasChanged}
            showClosingKnob={true}
            theme={styles.scheduleTheme}
        />
    );


}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        margin: 10,
        padding: 5,
        marginRight: 10,
        marginTop: 5
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green'
    },
    dayItem: {
        marginLeft: 34
    },

    // -----------
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lineSpacing: {
        height: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    nameText: {
        fontSize: 16,
    },
    theme: {
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#D8727D',
        selectedDayBackgroundColor: '#D8727D',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#D8727D',
        dayTextColor: '#D8727D',
    },
    scheduleTheme: {
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#D8727D',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#D8727D',
        dayTextColor: '#2d4150',
        textDisabledColor: '#BCC1CD',
    }
});