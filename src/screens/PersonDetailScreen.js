import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useIous } from '../context/IouContext';
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from '../constants/theme';
import { hapticLight, hapticSuccess } from '../utils/haptics';

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

    hapticLight();
    setAmount('');
    setNote('');
    setModalVisible(false);
    loadIous();
  };

  const handleSettle = (id) => {
    hapticSuccess();
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
      ? { text: `Owes you Rs ${balance.toLocaleString('en-PK')}`, color: COLORS.success }
      : balance < 0
      ? { text: `You owe Rs ${Math.abs(balance).toLocaleString('en-PK')}`, color: COLORS.danger }
      : { text: 'All settled up', color: COLORS.textMuted };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance with {personName}</Text>
        <Text style={[styles.balanceAmount, { color: balanceText.color }]} numberOfLines={1}>
          {balanceText.text}
        </Text>
      </View>

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
              activeOpacity={0.7}
            >
              <View style={[styles.iouIcon, { backgroundColor: (isLent ? COLORS.success : COLORS.danger) + '22' }]}>
                <Ionicons
                  name={isLent ? 'arrow-up-outline' : 'arrow-down-outline'}
                  size={18}
                  color={isLent ? COLORS.success : COLORS.danger}
                />
              </View>
              <View style={styles.iouInfo}>
                <Text style={styles.iouText} numberOfLines={1}>
                  {isLent ? 'You lent' : 'You borrowed'} Rs {item.amount.toLocaleString('en-PK')}
                </Text>
                <Text style={styles.iouDate} numberOfLines={1}>
                  {formattedDate} · {isSettled ? 'Settled' : 'Pending'}
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

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color={COLORS.textPrimary} />
      </TouchableOpacity>

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
              placeholderTextColor={COLORS.textFaint}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Note (optional)"
              placeholderTextColor={COLORS.textFaint}
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
  container: { flex: 1, backgroundColor: COLORS.background },
  balanceCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  balanceLabel: { color: COLORS.textSecondary, fontSize: FONT.base, marginBottom: SPACING.sm },
  balanceAmount: { fontSize: FONT.title, fontWeight: '700' },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  listTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.xl,
    fontWeight: '600',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  iouRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg - 2,
    marginBottom: SPACING.md - 2,
  },
  iouRowSettled: { opacity: 0.5 },
  iouIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iouInfo: { flex: 1, marginRight: SPACING.sm },
  iouText: { color: COLORS.textPrimary, fontSize: FONT.md, fontWeight: '600' },
  iouDate: { color: COLORS.textMuted, fontSize: FONT.sm, marginTop: 2 },
  settleButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  settleButtonText: { color: COLORS.textPrimary, fontSize: FONT.sm, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: COLORS.textMuted, fontSize: FONT.md },
  deletePersonButton: {
    marginTop: SPACING.xxl + 6,
    alignItems: 'center',
    padding: SPACING.lg - 2,
  },
  deletePersonText: { color: COLORS.danger, fontSize: FONT.md, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: SPACING.xxl,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.fab,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xxl, width: '85%' },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONT.xxl, fontWeight: '700', marginBottom: SPACING.lg },
  directionToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  directionButton: { flex: 1, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.sm - 1, alignItems: 'center' },
  directionButtonActiveLent: { backgroundColor: COLORS.success },
  directionButtonActiveBorrowed: { backgroundColor: COLORS.danger },
  directionText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: FONT.base },
  directionTextActive: { color: COLORS.textPrimary },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg - 2,
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    marginBottom: SPACING.md,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md, marginTop: SPACING.sm },
  modalButton: { paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.sm },
  modalCancelButton: { backgroundColor: 'transparent' },
  modalCancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  modalSaveButton: { backgroundColor: COLORS.primary },
  modalSaveText: { color: COLORS.textPrimary, fontWeight: '700' },
});