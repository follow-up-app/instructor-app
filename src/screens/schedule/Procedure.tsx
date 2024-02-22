import * as React from 'react';
import { IProcedure } from '../../interfaces/procedure.type';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Card, Caption, Text, ProgressBar, Portal, Modal, Button, Icon } from 'react-native-paper';
import { Formik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { execute } from '../../service/api-service';
import { StackNavigationProp } from '@react-navigation/stack';
import SelectDropdown from 'react-native-select-dropdown';

interface formData {
    help: string;
    execution: string;
}

type RootStackParamExecList = {
    ListExecutions: {
        schedule_id: string,
        procedure_id: string,
    } | undefined;
};

export type RootStackParamList = {
    Event: {
        id: string,
        skill_schedule_id: string,
    } | undefined;
};

export const Procedure: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const execNavigation = useNavigation<StackNavigationProp<RootStackParamExecList>>();

    const route = useRoute();
    const { schedule_id } = route.params as { schedule_id: string };
    const { procedure_id } = route.params as { procedure_id: string };
    const { tryNumber } = route.params as { tryNumber: number };
    const { tries } = route.params as { tries: number };
    const { procedure } = route.params as { procedure: IProcedure };
    const { skill_schedule_id } = route.params as { skill_schedule_id: string };

    const [visible, setVisible] = React.useState(false);
    const [running, setRunning] = React.useState(false);
    const [time, setTime] = React.useState(0);
    const timerRef = React.useRef<number | undefined>();

    const containerStyle = { backgroundColor: 'white', padding: 80, };
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const typeHelp = [
        'INDEPENDENTE',
        'POSICIONAL',
        'GESTUAL',
        'VERBAL',
        'FÍSICA',
        'VISUAL',
    ];

    const payload = (data: formData, time: number) => {
        return {
            schedule_id: schedule_id,
            procedure_id: procedure_id,
            trie: tryNumber,
            time: new Date(time * 1000).toISOString().slice(11, 19),
            help_type: data.help,
        }
    }

    const startTimer = () => {
        setRunning(true);
        timerRef.current = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
    };

    const pauseTimer = () => {
        setRunning(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const resetTimer = () => {
        setRunning(false);
        setTime(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const handleSubmit = async (values: any) => {
        const data = payload(values, time)
        try {
            const call = await execute(data);
            if (call.id) {
                navigation.navigate('Event', { id: schedule_id, skill_schedule_id: skill_schedule_id })
            }

        } catch (error) {
            console.error('Erro no envio do dados:', error);
            Alert.alert('Erro', 'Falha ao salvar. Por favor, tente novamente.');
        }
    };

    return (
        <View style={styles.container}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Formik
                        initialValues={{ help: 'INDEPENDENTE', execution: 'yes' }}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleSubmit }) => (
                            <View>
                                <View>
                                    <Text> Inicie a contagem do tempo, assim que atividade começar. Sempre que necessário,
                                        você pode pausar e reiniciar a contagem.
                                    </Text>
                                </View>
                                <View style={styles.modalContent}>
                                    <Text style={styles.timerText}>{formatTime(time)}</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={startTimer} disabled={running}>
                                        <Icon source="play" size={30} color={running ? 'gray' : 'green'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={pauseTimer} disabled={!running}>
                                        <Icon source="pause" size={30} color={running ? 'red' : 'gray'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={resetTimer}>
                                        <Icon source="replay" size={30} color="blue" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.formContainer}>
                                    <Text>Tipo de Ajuda:</Text>
                                </View>
                                <View>
                                    <SelectDropdown
                                        data={typeHelp}
                                        onSelect={(selectedItem) => {
                                            handleChange('help')(selectedItem)
                                        }}
                                        defaultValue={'INDEPENDENTE'}
                                        defaultButtonText={'Selecione...'}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return selectedItem;
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return item;
                                        }}
                                        buttonStyle={styles.dropdown1BtnStyle}
                                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                        renderDropdownIcon={isOpened => {
                                            return <Icon source={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                                        }}
                                        dropdownIconPosition={'right'}
                                        dropdownStyle={styles.dropdown1DropdownStyle}
                                        rowStyle={styles.dropdown1RowStyle}
                                        rowTextStyle={styles.dropdown1RowTxtStyle}>
                                    </SelectDropdown>
                                </View>
                                <View style={styles.formContainer}>
                                    <Text>Após finalizar, selecione o tipo de ajuda.</Text>
                                </View>
                                <View style={styles.buttons}>
                                    <Button icon="content-save" mode="contained" onPress={handleSubmit} buttonColor='#06ca8f'>
                                        Salvar
                                    </Button>
                                </View>
                                <View style={styles.buttons}>
                                    <Button icon="close" mode="contained" onPress={hideModal} buttonColor='#cecbcb'>
                                        Cancelar
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Formik>
                </Modal>
            </Portal>

            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.userInfo}>
                        <Caption style={styles.caption}>{'Procedimento'}</Caption>
                        <Text>{procedure.name}</Text>
                    </View>
                    <View style={styles.goalInfo}>
                        <Caption style={styles.caption}>{'Meta'}</Caption>
                        <Text>{procedure.goal} %</Text>
                    </View>
                    {
                        tryNumber > 1 && (
                            <View style={styles.listInfo}>
                                <TouchableOpacity onPress={() => execNavigation.navigate('ListExecutions', { schedule_id: schedule_id, procedure_id: procedure_id })}>
                                    <Icon
                                        source="format-list-bulleted"
                                        size={30}
                                        color="#717180" />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </Card.Content>
            </Card>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.userInfo}>
                        <ProgressBar progress={procedure.data_chart} color="#068798" />
                        {
                            tryNumber > tries ? (
                                <Caption style={styles.caption}>Completo</Caption>
                            ) : (
                                <Caption style={styles.caption}>{`Tentativa:` + tryNumber + '/' + tries}</Caption>
                            )
                        }
                    </View>
                    {tries >= tryNumber && (
                        <Button
                            icon="play-outline"
                            mode="elevated"
                            textColor="#D8727D"
                            onPress={showModal}
                            buttonColor="white"
                        >
                            Iniciar
                        </Button>
                    )}
                </Card.Content>
            </Card>
            <ScrollView>
                <Card style={styles.cardDetails}>
                    <Card.Content style={styles.details}>
                        <Text style={styles.descTitle}>Objetivo</Text>
                        <Text>{procedure.objective}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.cardDetails}>
                    <Card.Content style={styles.details}>
                        <Text style={styles.descTitle}>Estímulo</Text>
                        <Text>{procedure.stimulus}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.cardDetails}>
                    <Card.Content style={styles.details}>
                        <Text style={styles.descTitle}>Resposta</Text>
                        <Text>{procedure.answer}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.cardDetails}>
                    <Card.Content style={styles.details}>
                        <Text style={styles.descTitle}>Consequência</Text>
                        <Text>{procedure.consequence}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.cardDetails}>
                    <Card.Content style={styles.details}>
                        <Text style={styles.descTitle}>Materiais</Text>
                        <Text>{procedure.materials}</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.cardDetails}>
                    <Card.Content style={styles.details}>
                        <Text style={styles.descTitle}>Tipo de ajuda</Text>
                        <Text>{procedure.help}</Text>
                    </Card.Content>
                </Card>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
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
        marginRight: 10,
    },
    goalInfo: {
        justifyContent: 'flex-end',
        marginLeft: 80,
        marginRight: 10,
    },
    listInfo: {
        marginLeft: 10,
        marginRight: 10,
    },
    cardDetails: {
        backgroundColor: '#F2F2F2',
        margin: 10,
    },
    details: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
    },
    descTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    buttons: {
        margin: 5,
        padding: 5,
        justifyContent: 'space-between',
    },
    modalContent: {
        backgroundColor: 'white',
        // padding: 20,
        margin: 20,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 5,
        margin: 5,
        padding: 5,
        justifyContent: 'space-between',
    },
    caption: {
        color: '#717180'
    },
    dropdown1BtnStyle: {
        width: '80%',
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 16 },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
});

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};