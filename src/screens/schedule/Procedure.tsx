import * as React from 'react';
import { IProcedure } from '../../interfaces/procedure.type';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Avatar, Title, Caption, IconButton, Text, ProgressBar, Portal, Modal, Button, RadioButton, Icon } from 'react-native-paper';
import { Formik } from 'formik';
import { useRoute } from '@react-navigation/native';

interface formData {
    help: string;
    execution: string;
}

export const Procedure: React.FC = () => {
    const route = useRoute();
    const { schedule_id } = route.params as { schedule_id: string };
    const { procedure_id } = route.params as { procedure_id: string };
    const { tryNumber } = route.params as { tryNumber: number };
    const { tries } = route.params as { tries: number };
    const { progress } = route.params as { progress: number };
    const { procedure } = route.params as { procedure: IProcedure };

    const [visible, setVisible] = React.useState(false);
    const [running, setRunning] = React.useState(false);
    const [time, setTime] = React.useState(0);
    const timerRef = React.useRef<number | undefined>();

    const containerStyle = { backgroundColor: 'white', padding: 80, };
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const payload = (data: formData, time: number) => {
        return {
            schedule_id: schedule_id,
            procedure_id: procedure_id,
            trie: tryNumber,
            time: new Date(time * 1000).toISOString().slice(11, 19),
            help: data.help,
            success: data.execution === 'yes' ? true : false
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

    const handleSubmit = (values: any) => {
        const data = payload(values, time)
        console.log(data);
    };

    return (
        <View style={styles.container}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Formik
                        initialValues={{ help: 'DEPENDENTE', execution: 'yes' }}
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
                                <View style={styles.buttonContainer}>
                                    <Button
                                        mode="outlined"
                                        rippleColor="#D8727D"
                                        textColor={values.help === 'DEPENDENTE' ? 'white' : '#D8727D'}
                                        onPress={() => handleChange('help')('DEPENDENTE')}
                                        buttonColor={values.help === 'DEPENDENTE' ? '#D8727D' : 'white'}
                                    >
                                        Dependente
                                    </Button>
                                    <Button
                                        mode="outlined"
                                        rippleColor="#D8727D"
                                        textColor={values.help === 'INDEPENDENTE' ? 'white' : '#D8727D'}
                                        onPress={() => handleChange('help')('INDEPENDENTE')}
                                        buttonColor={values.help === 'INDEPENDENTE' ? '#D8727D' : 'white'}
                                    >
                                        Independente
                                    </Button>
                                </View>
                                <View style={styles.formContainer}>
                                    <Text>Executado:</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleChange('execution')('no')}
                                        buttonColor={values.execution === 'no' ? '#9cb39a' : 'white'}
                                        textColor={values.execution === 'no' ? 'white' : '#9cb39a'}
                                        icon="close-circle-outline"
                                    >
                                        Não
                                    </Button>
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleChange('execution')('yes')}
                                        buttonColor={values.execution === 'yes' ? '#9cb39a' : 'white'}
                                        textColor={values.execution === 'yes' ? 'white' : '#9cb39a'}
                                        icon="check-circle-outline"
                                    >
                                        Sim
                                    </Button>
                                </View>
                                <View>
                                    <Text>Após finalizar, selecione o tipo de ajuda e execução.</Text>
                                </View>
                                <View style={styles.buttons}>
                                    <Button icon="content-save" mode="contained" onPress={handleSubmit} buttonColor='#46913d'>
                                        Salvar
                                    </Button>
                                </View>
                                <View style={styles.buttons}>
                                    <Button icon="close" mode="contained" onPress={hideModal} buttonColor='#dfdfeb'>
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
                    <View style={styles.userInfo}>
                        <Caption style={styles.caption}>{'Meta'}</Caption>
                        <Text>{procedure.goal} %</Text>

                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.userInfo}>
                        <ProgressBar progress={progress} color="#068798" />
                        <Caption style={styles.caption}>{`Tentativa:` + tryNumber + '/' + tries}</Caption>
                    </View>
                    <Button
                        icon="play-outline"
                        mode="outlined"
                        textColor="#D8727D"
                        onPress={showModal}
                        buttonColor="white"
                    >
                        Iniciar
                    </Button>
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
    caption : {
        color: '#717180'
    },


});

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};