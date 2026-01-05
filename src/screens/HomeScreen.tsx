import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
}

interface LoanType {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

const LOAN_TYPES: LoanType[] = [
  {
    id: 'personal',
    title: 'Personal',
    subtitle: 'Fast approval',
    icon: 'document-outline',
    color: '#1FA29C',
  },
  {
    id: 'business',
    title: 'Business',
    subtitle: 'Fast approval',
    icon: 'people-outline',
    color: '#1B2B5C',
  },
  {
    id: 'auto',
    title: 'Auto',
    subtitle: 'Fast approval',
    icon: 'car-outline',
    color: '#1B2B5C',
  },
  {
    id: 'mortgage',
    title: 'Mortgage',
    subtitle: 'Fast approval',
    icon: 'home-outline',
    color: '#1FA29C',
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchText, setSearchText] = useState('');

  const handleLoanTypeSelect = (loanType: LoanType) => {
    navigation.navigate('LoanApplication', { loanType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={styles.spacer} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Choose a loan</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search loans"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Loan Types Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            {LOAN_TYPES.slice(0, 2).map((loanType) => (
              <TouchableOpacity
                key={loanType.id}
                style={[styles.loanCard, { backgroundColor: loanType.color }]}
                onPress={() => handleLoanTypeSelect(loanType)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={loanType.icon as any}
                  size={32}
                  color="#fff"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{loanType.title}</Text>
                <Text style={styles.cardSubtitle}>{loanType.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {LOAN_TYPES.slice(2, 4).map((loanType) => (
              <TouchableOpacity
                key={loanType.id}
                style={[styles.loanCard, { backgroundColor: loanType.color }]}
                onPress={() => handleLoanTypeSelect(loanType)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={loanType.icon as any}
                  size={32}
                  color="#fff"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{loanType.title}</Text>
                <Text style={styles.cardSubtitle}>{loanType.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B2B5C',
  },
  spacer: {
    width: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B2B5C',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1B2B5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    gap: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  loanCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'flex-start',
    minHeight: 150,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});
