import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Card, Avatar, Text, Chip, ActivityIndicator, ProgressBar, Icon, Button } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { eventId, getUrl, updateArrivalStudent, updateSchedule } from '../../service/api-service';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IProcedure } from '../../interfaces/procedure.type';

type RootStackParamList = {
    Procedure: {
        schedule_id: string,
        procedure_id: string;
        tryNumber: number;
        tries: number;
        process: number;
        procedure: IProcedure
    } | undefined;
};

type RootHomeParamList = {
    Home: {} | undefined;
}

type RootExecutionkParamList = {
    Home: { refresh?: boolean };
};

type ExecutionScreenRouteProp = RouteProp<RootExecutionkParamList, 'Home'>;

type ExecutionProps = {
    onFinish: (eventId: string) => void;
};

export const Execution = () => {
    const route = useRoute<ExecutionScreenRouteProp>();
    const [key, setKey] = React.useState(0);

    React.useEffect(() => {
        if (route.params?.refresh) {
            reload();
            setKey((prevKey) => key + 1);
        }
    }, [route.params?.refresh]);

    const reload = () => {
        setKey((prevKey) => key + 1);
    }
    return <Container reload={reload} key={key} />;
}

type ReloadableComponentProps = {
    reload: () => void;
};


const Container: React.FC<ReloadableComponentProps> = ({ reload }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const homeNavigation = useNavigation<StackNavigationProp<RootHomeParamList>>();
    const [event, setEvent] = React.useState<any>('');
    const [procedures, setProcedures] = React.useState<any>([]);
    const [outhers, setOuthers] = React.useState<any>([]);
    const [loading, setLoading] = React.useState(true);

    const route = useRoute();
    const { id } = route.params as { id: string };
    const { skill_schedule_id } = route.params as { skill_schedule_id: string };

    const url = getUrl();

    const home = () => {
        homeNavigation.navigate('Home');
    }

    React.useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            getEventId();
        });
        return () => {
            focusListener();
        };
    }, [navigation]);

    React.useEffect(() => {
        getEventId();
    }, []);

    const getEventId = async () => {
        const evnt = await eventId(id, skill_schedule_id);
        setEvent(evnt);
        setProcedures(evnt.skill.procedures);
        setOuthers(evnt.outhers);
        setLoading(false);
    }

    const arrivalStudent = async () => {
        try {
            const call = await updateArrivalStudent(id);
            if (call.id) {
                homeNavigation.navigate('Home');
            }
        } catch (error) {
            console.error('Erro no envio do dados:', error);
            Alert.alert('Erro', 'Falha ao salvar. Por favor, tente novamente.');
        }
    }

    const didNotAttend = async () => {
        const data = {
            status: 'NÃO COMPARECEU'
        }
        try {
            const call = await updateSchedule(id, data);
            if (call.id) {
                homeNavigation.navigate('Home');
            }
        } catch (error) {
            console.error('Erro no envio do dados:', error);
            Alert.alert('Erro', 'Falha ao salvar. Por favor, tente novamente.');
        }
    }

    const finish = async () => {
        const data = {
            status: 'CONCLUÍDO'
        }
        try {
            const call = await updateSchedule(id, data);
            if (call.id) {
                homeNavigation.navigate('Home');
            }
        } catch (error) {
            console.error('Erro no envio do dados:', error);
            Alert.alert('Erro', 'Falha ao salvar. Por favor, tente novamente.');
        }
    }

    const isAllItemsInactive = procedures.every((item: any) => !item.app_active)
    const isOuthersItemsInactive = outhers.every((item: any) => !item.app_active)

    const renderItem = ({ item }: { item: any }) => (
        item.app_active === true ? (
            <List.Item
                style={styles.item}
                title={props => <Text  {...props} style={styles.itemText}>
                    {item.name}
                </Text>}
                description={props => <ProgressBar  {...props} progress={item.data_chart} color="#068798" />}
                onPress={() => navigation.navigate('Procedure', { schedule_id: id, procedure_id: item.id, tryNumber: item.total_exec + 1, tries: item.tries, process: item.status, procedure: item })}
                left={props => <List.Icon {...props} color="#D8727D" icon="play-outline" />}
                right={props => <Text   {...props}>{item.total_exec + '/' + item.tries}</Text>}
            />
        ) : (
            <List.Item
                style={styles.item}
                title={props => <Text  {...props} style={styles.itemText}>
                    {item.name}
                </Text>}
                description={props => <ProgressBar  {...props} progress={item.data_chart} color="#068798" />}
                onPress={() => navigation.navigate('Procedure', { schedule_id: id, procedure_id: item.id, tryNumber: item.total_exec + 1, tries: item.tries, process: item.status, procedure: item })}
                left={props => <List.Icon {...props} color="#D8727D" icon="play-outline" />}
                right={props => <Icon {...props} source="check" size={30} color='#06ca8f' />}
            />
        )
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        animating={true}
                        color='#01878B' />
                </View>
            ) : (
                <View>
                    <Card style={styles.card}>
                        <View style={styles.close}>
                            <TouchableOpacity onPress={home}>
                                <Icon source="close" size={30} color="#717180" />
                            </TouchableOpacity>
                        </View>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.avatar}>
                                <View style={styles.avatarContainer}>
                                    {event.student.avatar ? (
                                        <Avatar.Image
                                            size={80}
                                            source={{ uri: url + 'students/avatar/' + event.student.id }}
                                        />
                                    ) : (
                                        <Avatar.Icon
                                            size={80}
                                            icon="account-circle"
                                        />
                                    )}
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
                    {event.status === 'AGENDADO' && (
                        <><View style={styles.info}>
                            <Chip icon="information">Marcar chegada do cliente</Chip>
                        </View><View style={styles.buttonContainer}>
                                <Button
                                    mode="elevated"
                                    icon="cancel"
                                    buttonColor="white"
                                    textColor="#D8727D"
                                    onPress={didNotAttend}>
                                    Não compareceu
                                </Button>
                                {event.student_arrival === null && (
                                    <Button
                                        mode="elevated"
                                        icon="calendar-check-outline"
                                        buttonColor="white"
                                        textColor="#717180"
                                        onPress={arrivalStudent}>
                                        Chegada
                                    </Button>
                                )}
                            </View></>
                    )}
                    <View style={styles.info}>
                        <Chip icon="information">Selecione o procedimento</Chip>
                    </View>
                    <View>
                        <View>
                            <FlatList
                                data={procedures}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                extraData={procedures}
                            />
                        </View>
                    </View>
                    <View>
                        {isAllItemsInactive && isOuthersItemsInactive && (
                            <Button
                                mode="elevated"
                                icon="check-bold"
                                buttonColor="#06ca8f"
                                textColor="white"
                                onPress={finish}>
                                Finalizar
                            </Button>
                        )}
                    </View>
                </View>
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
    close: {
        alignItems: 'flex-end',
        marginRight: 10,
        margin: 10,
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
        marginBottom: 10,
        margin: 10,
        marginLeft: 40,
        marginRight: 5,
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
        marginTop: 5,
    },
    itemText: {
        padding: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4D4C59'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 10,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    loading: {
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'justify',
        display: 'none'
    },
});