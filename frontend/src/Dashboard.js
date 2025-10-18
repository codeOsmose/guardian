// frontend/src/Dashboard.js (CRUD COMPLETO)

import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    TouchableOpacity, 
    TextInput, 
    Modal, 
    Alert,
    ActivityIndicator 
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const API_BASE_URL = 'http://10.0.2.2:8080';

const Dashboard = ({ authToken, onLogout }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    
    // Estados para o novo formulário de assinatura (CRIAR)
    const [newTitle, setNewTitle] = useState('');
    const [newCost, setNewCost] = useState('');
    const [newDate, setNewDate] = useState('');
    
    // Estado para o item selecionado para edição
    const [editingItem, setEditingItem] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCost, setEditCost] = useState('');
    const [editDate, setEditDate] = useState('');

    // Função de validação de data
    const validateDate = (date) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date);
    };

    // -------------------------------------------------------------------
    // R (Read): BUSCAR ASSINATURAS
    // -------------------------------------------------------------------
    const fetchSubscriptions = React.useCallback(async () => {
        if (!authToken) {
            onLogout();
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSubscriptions(data);
            } else if (response.status === 401) {
                Alert.alert('Sessão Expirada', 'Faça login novamente.');
                onLogout();
            } else {
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Erro ao carregar.');
            }
        } catch (error) {
            console.error('Erro de conexão ao buscar:', error);
            Alert.alert('Erro de Rede', 'Verifique a conexão com o servidor Spring Boot.');
        } finally {
            setIsLoading(false);
        }
    }, [authToken, onLogout]);

    // -------------------------------------------------------------------
    // C (Create): ADICIONAR ASSINATURA (mantida e melhorada)
    // -------------------------------------------------------------------
    const handleAddSubscription = async () => {
        if (!newTitle || !newCost || !newDate) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }
        if (!validateDate(newDate)) {
             Alert.alert('Erro', 'Use o formato de data AAAA-MM-DD (Ex: 2025-05-20).');
             return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ 
                    title: newTitle, 
                    cost: parseFloat(newCost), 
                    dueDate: newDate,
                }),
            });

            if (response.ok) {
                Alert.alert('Sucesso!', 'Assinatura adicionada.');
                setIsAddModalVisible(false);
                setNewTitle('');
                setNewCost('');
                setNewDate('');
                fetchSubscriptions(); // Recarrega
            } else {
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Falha ao adicionar.');
            }
        } catch (error) {
            console.error('Erro de conexão ao adicionar:', error);
            Alert.alert('Erro de Rede', 'Verifique a conexão com o servidor Spring Boot.');
        }
    };

    // -------------------------------------------------------------------
    // U (Update): ATUALIZAR ASSINATURA
    // -------------------------------------------------------------------
    const handleUpdateSubscription = async () => {
        if (!editingItem || !editTitle || !editCost || !editDate) return;
        
        if (!validateDate(editDate)) {
             Alert.alert('Erro', 'Use o formato de data AAAA-MM-DD (Ex: 2025-05-20).');
             return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/subscriptions/${editingItem.id}`, {
                method: 'PUT', // Usando PUT para atualizar o recurso completo
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ 
                    id: editingItem.id,
                    title: editTitle, 
                    cost: parseFloat(editCost), 
                    dueDate: editDate,
                }),
            });

            if (response.ok) {
                Alert.alert('Sucesso!', 'Assinatura atualizada.');
                setIsEditModalVisible(false);
                setEditingItem(null);
                fetchSubscriptions(); // Recarrega
            } else {
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Falha ao atualizar.');
            }
        } catch (error) {
            console.error('Erro de conexão ao atualizar:', error);
            Alert.alert('Erro de Rede', 'Verifique a conexão com o servidor Spring Boot.');
        }
    };
    
    // -------------------------------------------------------------------
    // D (Delete): DELETAR ASSINATURA
    // -------------------------------------------------------------------
    const handleDeleteSubscription = (itemId) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja deletar esta assinatura?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Deletar", style: "destructive", onPress: () => confirmDelete(itemId) }
            ]
        );
    };

    const confirmDelete = async (itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/subscriptions/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                Alert.alert('Sucesso!', 'Assinatura deletada.');
                fetchSubscriptions(); // Recarrega
            } else {
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Falha ao deletar.');
            }
        } catch (error) {
            console.error('Erro de conexão ao deletar:', error);
            Alert.alert('Erro de Rede', 'Verifique a conexão com o servidor Spring Boot.');
        }
    };
    
    // -------------------------------------------------------------------
    // SETUP DE EDIÇÃO
    // -------------------------------------------------------------------
    const openEditModal = (item) => {
        setEditingItem(item);
        setEditTitle(item.title);
        setEditCost(item.cost.toString());
        setEditDate(item.dueDate || '');
        setIsEditModalVisible(true);
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [authToken, fetchSubscriptions]);

    // -------------------------------------------------------------------
    // UI RENDERING
    // -------------------------------------------------------------------

    const renderSubscriptionItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCost}>R$ {item.cost ? parseFloat(item.cost).toFixed(2) : '0.00'}</Text>
            </View>
            <Text style={styles.cardDate}>Vencimento: {item.dueDate || 'Não especificado'}</Text>
            
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                    <Feather name="edit" size={18} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteSubscription(item.id)} style={styles.actionButton}>
                    <Feather name="trash-2" size={18} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Minhas Assinaturas</Text>
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Feather name="log-out" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0056b3" />
                    <Text style={styles.loadingText}>Carregando dados da API...</Text>
                </View>
            ) : (
                <FlatList
                    data={subscriptions}
                    keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()} 
                    renderItem={renderSubscriptionItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={EmptyListComponent}
                />
            )}

            {/* Botão Flutuante para Adicionar */}
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Feather name="plus" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal para Adicionar Assinatura (CREATE) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                 {/* ... Conteúdo do Modal de Adicionar (CREATE) ... */}
                 <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar Assinatura</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Título (Ex: Netflix)"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Custo (Ex: 45.90)"
                            value={newCost}
                            onChangeText={setNewCost}
                            keyboardType="numeric"
                        />
                         <TextInput
                            style={styles.input}
                            placeholder="Data de Vencimento (AAAA-MM-DD)"
                            value={newDate}
                            onChangeText={setNewDate}
                            keyboardType="numbers-and-punctuation"
                        />

                        <TouchableOpacity style={styles.modalButton} onPress={handleAddSubscription}>
                            <Text style={styles.buttonText}>Salvar Assinatura</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsAddModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* Modal para Editar Assinatura (UPDATE) */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Assinatura</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Título"
                            value={editTitle}
                            onChangeText={setEditTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Custo"
                            value={editCost}
                            onChangeText={setEditCost}
                            keyboardType="numeric"
                        />
                         <TextInput
                            style={styles.input}
                            placeholder="Data de Vencimento (AAAA-MM-DD)"
                            value={editDate}
                            onChangeText={setEditDate}
                            keyboardType="numbers-and-punctuation"
                        />

                        <TouchableOpacity style={[styles.modalButton, styles.editButton]} onPress={handleUpdateSubscription}>
                            <Text style={styles.buttonText}>Salvar Alterações</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsEditModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#0056b3', paddingTop: 40 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    logoutButton: { padding: 5 },
    listContent: { padding: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    cardCost: { fontSize: 18, fontWeight: 'bold', color: '#28a745' },
    cardDate: { fontSize: 14, color: '#777', marginBottom: 10 },
    cardActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    actionButton: { marginLeft: 15 },
    emptyListText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
    addButton: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 30, bottom: 30, backgroundColor: '#ffc107', borderRadius: 30, elevation: 8 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10 },
    // Estilos do Modal
    modalView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { margin: 20, backgroundColor: "white", borderRadius: 10, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    input: { width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 },
    modalButton: { padding: 10, borderRadius: 5, marginTop: 15, width: '100%', alignItems: 'center' },
    cancelButton: { backgroundColor: '#6c757d', marginTop: 10 },
    editButton: { backgroundColor: '#007bff' }, // Azul para salvar edição
    buttonText: { color: '#fff', fontWeight: 'bold' }
});

const EmptyListComponent = () => (
    <Text style={styles.emptyListText}>Nenhuma assinatura encontrada. Adicione uma nova!</Text>
);

export default Dashboard;