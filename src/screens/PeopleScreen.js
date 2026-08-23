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
import { COLORS, SPACING, RADIUS, FONT, SHADOW } from '../constants/theme';

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
    if (balance > 0) return { text: `owes you Rs ${balance.toLocaleString('en-PK')}`, color: COLORS.success };
    if (balance < 0) return { text: `you owe Rs ${Math.abs(balance).toLocaleString('en-PK')}`, color: COLORS.danger };
    return { text: 'settled up', color: COLORS.textMuted };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Owed to you</Text>
          <Text style={[styles.summaryAmount, { color: COLORS.success }]} numberOfLines={1}>
            Rs {iouSummary.owedToYou.toLocaleString('en-PK')}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>You owe</Text>
          <Text style={[styles.summaryAmount, { color: COLORS.danger }]} numberOfLines={1}>
            Rs {iouSummary.youOwe.toLocaleString('en-PK')}
          </Text>
        </View>
      </View>

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
                <Text style={styles.personName} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.personBalance, { color }]} numberOfLines={1}>{text}</Text>
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

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add" size={26} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              placeholderTextColor={COLORS.textFaint}
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
              <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={handleAddPerson}>
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
    backgroundColor: COLORS.background,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  summaryBlock: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
    marginBottom: SPACING.xs + 2,
  },
  summaryAmount: {
    fontSize: FONT.xxl,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  listTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.xl,
    fontWeight: '600',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg - 2,
    marginBottom: SPACING.md - 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
  },
  personInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  personName: {
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    fontWeight: '600',
  },
  personBalance: {
    fontSize: FONT.base,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT.xl,
    marginTop: SPACING.md,
    fontWeight: '500',
  },
  emptySubtext: {
    color: COLORS.textFaint,
    fontSize: FONT.base,
    marginTop: SPACING.xs,
  },
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
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    width: '85%',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg - 2,
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    marginBottom: SPACING.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  modalButton: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.sm,
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: COLORS.primary,
  },
  modalSaveText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});