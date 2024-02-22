import * as React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getListExecutables, updateExecution } from '../../service/api-service';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Button, Chip, Icon, List, Modal, Portal, Text } from 'react-native-paper';
import { Formik } from 'formik';
import { StackNavigationProp } from '@react-navigation/stack';
import SelectDropdown from 'react-native-select-dropdown';

export type RootStackParamList = {
    Event: {
        id: string,
        skill_schedule_id: string,
    } | undefined;
};

export const ListExecutions: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [executions, setExecutions] = React.useState<any>([]);
    const [loading, setLoading] = React.useState(true);
    const [selecteExecution, setSelectedExecution] = React.useState<IExecution | null>(null);
    const [visible, setVisible] = React.useState(false);

    const route = useRoute();
    const { schedule_id } = route.params as { schedule_id: string };
    const { procedure_id } = route.params as { procedure_id: string };
    const { skill_schedule_id } = route.params as { skill_schedule_id: string };

    const containerStyle = { backgroundColor: 'white', padding: 80, };
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const getExecutios = async () => {
        const list = await getListExecutables(schedule_id, procedure_id);
        setExecutions(list);
        setLoading(false);
    }

    const handleSubimit = async (execution: any) => {
        try {
            const call = await updateExecution(execution.id, execution);
            if (call.id) {
                navigation.navigate('Event', { id: schedule_id, skill_schedule_id: skill_schedule_id })
            }

        } catch (error) {
            console.error('Erro no envio do dados:', error);
            Alert.alert('Erro', 'Falha ao salvar. Por favor, tente novamente.');
        }

    }

    const renderItem = ({ item }: { item: any }) => (
        <List.Item
            style={styles.item}
            title={props => <Text  {...props} style={styles.itemText}>
                {item.trie + ' - ' + item.help_type}
            </Text>}
            onPress={() => {
                setSelectedExecution(item);
                showModal();
            }}
            left={props => <List.Icon {...props} color="#D8727D" icon="play-outline" />}
            right={props => <List.Icon {...props} color="#717180" icon="application-edit-outline" />}
        />
    );

    const typeHelp = [
        'INDEPENDENTE',
        'POSICIONAL',
        'GESTUAL',
        'VERBAL',
        'FÍSICA',
        'VISUAL',
    ];

    React.useEffect(() => {
        getExecutios();
    }, []);


    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        animating={true}
                        color='#01878B' />
                </View>
            ) : (
                <>
                    <View style={styles.info}>
                        <Chip icon="information">Para editar, selecione a execução</Chip>
                    </View>
                    <View>
                        <FlatList
                            data={executions}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            extraData={executions}
                        />
                    </View>
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                            <Formik
                                initialValues={{ help_type: selecteExecution?.help_type }}
                                onSubmit={(values, { resetForm }) => {
                                    handleSubimit({ ...selecteExecution!, ...values });
                                    resetForm();
                                }}>
                                {({ values, handleChange, handleSubmit }) => (
                                    <View>
                                        <View style={styles.formContainer}>
                                            <Text>Tipo de Ajuda:</Text>
                                        </View>
                                        <View>
                                            <SelectDropdown
                                                data={typeHelp}
                                                onSelect={(selectedItem) => {
                                                    handleChange('help_type')(selectedItem)
                                                }}
                                                defaultValue={selecteExecution?.help_type}
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
                </>
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
    loading: {
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'justify',
        display: 'none'
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