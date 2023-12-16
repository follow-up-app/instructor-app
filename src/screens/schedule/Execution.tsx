import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Card, Avatar, Text, Chip, ActivityIndicator, ProgressBar, Icon } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { eventId, eventProducedures, skill } from '../../service/api-service';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IProcedure } from '../../interfaces/procedure.type';

export type RootStackParamList = {
    Procedure: { 
        schedule_id: string,
        procedure_id: string;
        tryNumber: number;
        tries: number;
        process: number;
        procedure: IProcedure
     } | undefined;
};

export const Execution = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [event, setEvent] = React.useState<any>('');
    const [procedures, setProcedures] = React.useState<any>([]);

    const route = useRoute();
    const { id } = route.params as { id: string };

    const getEventId = async () => {
        const evnt = await eventId(id);
        setEvent(evnt);
        if (evnt) {
            const skillList = await skill(evnt.skill.id);
            skillList.procedures.map(async (prc: any) => {
                const excProc = await eventProducedures(evnt.id, prc.id);
                prc.executions = excProc.length;
                if (prc.executions >= prc.tries) {
                    prc.active = false;
                    prc.status = 1.0;
                } else {
                    prc.active = true;
                    prc.try = prc.executions + 1;
                    prc.status = prc.executions / prc.tries;
                }
            })
            setProcedures(skillList.procedures);
        }
    }

    const renderItem = ({ item }: { item: any }) => (
        item.active === true ? (
            <List.Item
                style={styles.item}
                title={item.name}
                description={props => <ProgressBar  {...props} progress={item.status} color="#068798" />}
                onPress={() => navigation.navigate('Procedure', { schedule_id: id, procedure_id: item.id, tryNumber: item.try, tries: item.tries, process: item.status, procedure: item })}
                left={props => <List.Icon {...props} color="#D8727D" icon="play-outline" />}
                right={props => <Text  {...props}>{item.try + '/' + item.tries}</Text>}
            />
        ) : (
            <List.Item
                style={styles.item}
                title={item.name}
                description={props => <ProgressBar  {...props} progress={1.0} color="#068798" />}
                onPress={() => Alert.alert('Atenção', 'Procedimento finalizando com todas as tentativas')}
                left={props => <List.Icon {...props} color="#D8727D" icon="play-outline" />}
                right={props => <Icon {...props} source="check" size={30} color='green' />}
            />
        )
    );

    React.useEffect(() => {
        getEventId();
    }, []);

    return (
        <View style={styles.container}>
            {event ? (
                <View>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.avatar}>
                                <View style={styles.avatarContainer}>
                                    <Avatar.Icon size={80} icon="account-circle" />
                                </View>
                                <View >
                                    <Text>{event.student.fullname}</Text>
                                </View>
                            </View>
                            <View style={styles.skills}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.skillTitle}>Habilidade</Text>
                                    <Text>{event.skill.name}</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.skillTitle}>Objetivo</Text>
                                    <Text>{event.skill.objective}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                    <View style={styles.info}>
                        <Chip icon="information">Selecione o procedimento</Chip>
                    </View>
                    <View>
                        <View>
                            <FlatList
                                data={procedures}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </View>
                </View>
            ) : (
                <ActivityIndicator
                    animating={true}
                    color='#01878B' />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        marginTop: 15
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        marginLeft: 10,
    },
    skills: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    skillTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 50,
    },
    textContainer: {
        alignItems: 'flex-start',
        marginBottom: 16,
        margin: 10,
        marginLeft: 30,
        marginRight: 50,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 6,
    },
    info: {
        backgroundColor: 'white',
        margin: 5,
    },
    item: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: 'white',
        margin: 10,
        marginRight: 10,
        marginTop: 5
    },
});