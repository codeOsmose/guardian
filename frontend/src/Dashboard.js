
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Exemplo de ícone, você precisará instalar

const Dashboard = ({ onLogout }) => {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Netflix', price: 45.90, renewalDate: '2025-11-15', category: 'Streaming' },
    { id: '2', name: 'Spotify', price: 21.90, renewalDate: '2025-11-10', category: 'Música' },
    { id: '3', name: 'Amazon Prime', price: 14.90, renewalDate: '2025-11-20', category: 'Streaming' },
  ]);

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta assinatura?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => setSubscriptions(subscriptions.filter(sub => sub.id !== id)), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Icon name="shield" size={24} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>GuardianApp</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Icon name="log-out" size={16} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollViewContent}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.card, styles.primaryCard]}>
            <Text style={styles.cardDescription}>Total Mensal</Text>
            <Text style={styles.cardTitle}>R$ {totalMonthly.toFixed(2)}</Text>
            <View style={styles.cardDetail}>
              <Icon name="dollar-sign" size={14} color="#fff" />
              <Text style={styles.cardDetailText}>{subscriptions.length} assinaturas ativas</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardDescription}>Total Anual</Text>
            <Text style={styles.cardTitleDark}>R$ {(totalMonthly * 12).toFixed(2)}</Text>
            <View style={styles.cardDetailDark}>
              <Icon name="calendar" size={14} color="#666" />
              <Text style={styles.cardDetailTextDark}>Projeção de 12 meses</Text>
            </View>
          </View>

          <View style={[styles.card, styles.secondaryCard]}>
            <Text style={styles.cardDescription}>Economia Potencial</Text>
            <Text style={styles.cardTitle}>R$ {(totalMonthly * 0.2).toFixed(2)}</Text>
            <Text style={styles.cardDetailText}>Cancele serviços não utilizados</Text>
          </View>
        </View>

        {/* Subscriptions List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Minhas Assinaturas</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Assinatura</Text>
          </TouchableOpacity>
        </View>

        {subscriptions.map((sub) => (
          <View key={sub.id} style={styles.subscriptionItem}>
            <View style={styles.subscriptionInfo}>
              <View style={styles.subscriptionNameCategory}>
                <Text style={styles.subscriptionName}>{sub.name}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{sub.category}</Text>
                </View>
              </View>
              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Icon name="dollar-sign" size={14} color="#666" />
                  <Text style={styles.detailText}>R$ {sub.price.toFixed(2)}/mês</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="calendar" size={14} color="#666" />
                  <Text style={styles.detailText}>Renovação: {new Date(sub.renewalDate).toLocaleDateString('pt-BR')}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(sub.id)}>
              <Icon name="trash-2" size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        ))}

        {subscriptions.length === 0 && (
          <View style={styles.emptyStateCard}>
            <Icon name="shield" size={60} color="#ccc" style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>Nenhuma assinatura cadastrada</Text>
            <Text style={styles.emptyStateText}>Comece adicionando suas primeiras assinaturas para gerenciá-las</Text>
            <TouchableOpacity style={styles.emptyStateButton}>
              <Icon name="plus" size={16} color="#fff" />
              <Text style={styles.emptyStateButtonText}>Adicionar Primeira Assinatura</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#6a5acd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  logoutButtonText: {
    color: '#dc2626',
    marginLeft: 5,
    fontWeight: '600',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap', // Permite que os cards quebrem a linha em telas menores
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '31%', // Ajuste para 3 cards por linha, com algum espaçamento
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#6a5acd',
  },
  secondaryCard: {
    backgroundColor: '#8b5cf6',
  },
  cardDescription: {
    fontSize: 13,
    color: '#eee',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardTitleDark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.9,
  },
  cardDetailDark: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.9,
  },
  cardDetailText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  cardDetailTextDark: {
    color: '#666',
    fontSize: 12,
    marginLeft: 5,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a5acd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  subscriptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionNameCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: '#4f46e5',
    fontSize: 11,
    fontWeight: '600',
  },
  subscriptionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  emptyStateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a5acd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default Dashboard;

