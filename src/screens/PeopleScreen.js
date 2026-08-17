import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIous } from '../context/IouContext';

const PeopleScreen = ({ navigation }) => {
  const { people, iouSummary, createPerson } = useIous();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddPerson = () => {
    if (!newName.trim()) {
      Alert.alert('Missing name', 'Please enter a name.');
      return;
    }
    createPerson({ name: newName.trim(), note: '' });
    setNewName('');
    setModalVisible(false);
  };

  const renderBalanceText = (balance) => {
    if (balance > 0) return { text: `owes you Rs ${balance.toLocaleString('en-PK')}`, color: '#00B894' };
    if (balance < 0) return { text: `you owe Rs ${Math.abs(balance).toLocaleString('en-PK')}`, color: '#FF6B6B' };
    return { text: 'settled up', color: '#888888' };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Owed to you</Text>
          <Text style={[styles.summaryAmount, { color: '#00B894' }]}>
            Rs {iouSummary.owedToYou.toLocaleString('en-PK')}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>You owe</Text>
          <Text style={[styles.summaryAmount, { color: '#FF6B6B' }]}>
            Rs {iouSummary.youOwe.toLocaleString('en-PK')}
          </Text>
        </View>
      </View>

      {/* People List */}
      <FlatList
        data={people}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.listTitle}>People</Text>}
        renderItem={({ item }) => {
          const { text, color } = renderBalanceText(item.balance);
          return (
            <TouchableOpacity
              style={styles.personRow}
              onPress={() => navigation.navigate('PersonDetail', { personId: item.id, personName: item.name })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={[styles.personBalance, { color }]}>{text}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#555" />
            <Text style={styles.emptyText}>No people added yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add a friend</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Person Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              placeholderTextColor="#666"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => { setModalVisible(false); setNewName(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleAddPerson}
              >
                <Text style={styles.modalSaveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PeopleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A3C',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
  },
  summaryBlock: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#3A3A4C',
    marginHorizontal: 12,
  },
  summaryLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  personBalance: {
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 13,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#2A2A3C',
    borderRadius: 20,
    padding: 24,
    width: '85%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
  },
  modalCancelText: {
    color: '#AAAAAA',
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: '#6C5CE7',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});