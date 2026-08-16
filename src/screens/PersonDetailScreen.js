import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useIous } from '../context/IouContext';

const PersonDetailScreen = ({ route, navigation }) => {
  const { personId, personName } = route.params;
  const { fetchIousForPerson, createIou, markIouSettled, removeIou, removePerson, people } = useIous();

  const [ious, setIous] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [direction, setDirection] = useState('lent');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const currentPerson = people.find((p) => p.id === personId);
  const balance = currentPerson ? currentPerson.balance : 0;

  const loadIous = useCallback(() => {
    setIous(fetchIousForPerson(personId));
  }, [fetchIousForPerson, personId]);

  // Reload every time this screen comes into focus (e.g. after adding an IOU)
  useFocusEffect(
    useCallback(() => {
      loadIous();
    }, [loadIous])
  );

  const handleAddIou = () => {
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    createIou({
      person_id: personId,
      amount: numericAmount,
      direction,
      date: new Date().toISOString(),
      due_date: null,
      note: note.trim(),
    });

    setAmount('');
    setNote('');
    setModalVisible(false);
    loadIous();
  };

  const handleSettle = (id) => {
    markIouSettled(id);
    loadIous();
  };

  const handleDeleteIou = (id) => {
    Alert.alert('Delete Entry', 'Remove this record permanently?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { removeIou(id); loadIous(); } },
    ]);
  };

  const handleDeletePerson = () => {
    Alert.alert(
      'Delete Friend',
      `Remove ${personName} and all their records? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removePerson(personId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const balanceText =
    balance > 0
      ? { text: `Owes you Rs ${balance.toLocaleString('en-PK')}`, color: '#00B894' }
      : balance < 0
      ? { text: `You owe Rs ${Math.abs(balance).toLocaleString('en-PK')}`, color: '#FF6B6B' }
      : { text: 'All settled up', color: '#888888' };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance with {personName}</Text>
        <Text style={[styles.balanceAmount, { color: balanceText.color }]}>{balanceText.text}</Text>
      </View>

      {/* IOU history */}
      <FlatList
        data={ious}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.listTitle}>History</Text>}
        renderItem={({ item }) => {
          const isLent = item.direction === 'lent';
          const isSettled = item.status === 'settled';
          const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          });

          return (
            <TouchableOpacity
              style={[styles.iouRow, isSettled && styles.iouRowSettled]}
              onLongPress={() => handleDeleteIou(item.id)}
            >
              <View style={[styles.iouIcon, { backgroundColor: (isLent ? '#00B894' : '#FF6B6B') + '22' }]}>
                <Ionicons
                  name={isLent ? 'arrow-up-outline' : 'arrow-down-outline'}
                  size={18}
                  color={isLent ? '#00B894' : '#FF6B6B'}
                />
              </View>
              <View style={styles.iouInfo}>
                <Text style={styles.iouText}>
                  {isLent ? 'You lent' : 'You borrowed'} Rs {item.amount.toLocaleString('en-PK')}
                </Text>
                <Text style={styles.iouDate}>
                  {formattedDate} {isSettled ? '· Settled' : '· Pending'}
                  {item.note ? ` · ${item.note}` : ''}
                </Text>
              </View>
              {!isSettled && (
                <TouchableOpacity style={styles.settleButton} onPress={() => handleSettle(item.id)}>
                  <Text style={styles.settleButtonText}>Settle</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No records yet</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.deletePersonButton} onPress={handleDeletePerson}>
            <Text style={styles.deletePersonText}>Delete Friend</Text>
          </TouchableOpacity>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add IOU Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Record</Text>

            <View style={styles.directionToggle}>
              <TouchableOpacity
                style={[styles.directionButton, direction === 'lent' && styles.directionButtonActiveLent]}
                onPress={() => setDirection('lent')}
              >
                <Text style={[styles.directionText, direction === 'lent' && styles.directionTextActive]}>
                  I Lent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.directionButton, direction === 'borrowed' && styles.directionButtonActiveBorrowed]}
                onPress={() => setDirection('borrowed')}
              >
                <Text style={[styles.directionText, direction === 'borrowed' && styles.directionTextActive]}>
                  I Borrowed
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Amount (Rs)"
              placeholderTextColor="#666"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Note (optional)"
              placeholderTextColor="#666"
              value={note}
              onChangeText={setNote}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => { setModalVisible(false); setAmount(''); setNote(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={handleAddIou}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PersonDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E2E' },
  balanceCard: {
    backgroundColor: '#2A2A3C',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  balanceLabel: { color: '#AAAAAA', fontSize: 13, marginBottom: 8 },
  balanceAmount: { fontSize: 22, fontWeight: '700' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  listTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  iouRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  iouRowSettled: { opacity: 0.5 },
  iouIcon: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  iouInfo: { flex: 1 },
  iouText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  iouDate: { color: '#888888', fontSize: 12, marginTop: 2 },
  settleButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  settleButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#777777', fontSize: 14 },
  deletePersonButton: {
    marginTop: 30,
    alignItems: 'center',
    padding: 14,
  },
  deletePersonText: { color: '#FF6B6B', fontSize: 14, fontWeight: '600' },
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
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalCard: { backgroundColor: '#2A2A3C', borderRadius: 20, padding: 24, width: '85%' },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  directionToggle: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  directionButton: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  directionButtonActiveLent: { backgroundColor: '#00B894' },
  directionButtonActiveBorrowed: { backgroundColor: '#FF6B6B' },
  directionText: { color: '#AAAAAA', fontWeight: '600', fontSize: 13 },
  directionTextActive: { color: '#FFFFFF' },
  modalInput: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 12,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  modalCancelButton: { backgroundColor: 'transparent' },
  modalCancelText: { color: '#AAAAAA', fontWeight: '600' },
  modalSaveButton: { backgroundColor: '#6C5CE7' },
  modalSaveText: { color: '#FFFFFF', fontWeight: '700' },
});