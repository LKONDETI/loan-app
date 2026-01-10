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

interface LoanApplicationScreenProps {
  navigation: any;
  route: any;
}

type TabType = 'details' | 'you' | 'income' | 'documents';

export default function LoanApplicationScreen({
  navigation,
  route,
}: LoanApplicationScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const loanType = route.params?.loanType;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'you', label: 'You' },
    { id: 'income', label: 'Income' },
    { id: 'documents', label: 'Documents' },
  ] as const;

  const isLastTab = activeTab === 'documents';

  const goToNextTabOrSubmit = () => {
    if (activeTab === 'details') {
      setActiveTab('you');
      return;
    }
    if (activeTab === 'you') {
      setActiveTab('income');
      return;
    }
    if (activeTab === 'income') {
      setActiveTab('documents');
      return;
    }
    // documents -> final submit
    navigation.navigate('Dashboard');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionLabel}>Loan Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter loan amount"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />

            <Text style={styles.sectionLabel}>Loan Term (Months)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter loan term"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />

            <Text style={styles.sectionLabel}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="What is the loan for?"
              placeholderTextColor="#999"
            />
          </View>
        );
      case 'you':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />

            <Text style={styles.sectionLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        );
      case 'income':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionLabel}>Annual Income</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter annual income"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />

            <Text style={styles.sectionLabel}>Employment Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Select employment status"
              placeholderTextColor="#999"
            />

            <Text style={styles.sectionLabel}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              placeholderTextColor="#999"
            />
          </View>
        );
      case 'documents':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity style={styles.uploadBox}>
              <Ionicons name="cloud-upload-outline" size={32} color="#1FA29C" />
              <Text style={styles.uploadText}>Upload Documents</Text>
              <Text style={styles.uploadSubtext}>ID, Pay stubs, Bank statements</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Application</Text>
        <View style={styles.spacer} />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        scrollEventThrottle={16}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Next / Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={goToNextTabOrSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>{isLastTab ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // removed flex: 1 to reduce extra vertical space
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    // removed bottom border to eliminate line/gap under tabs
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    position: 'relative',
  },
  activeTab: {
    // removed borderBottom and negative margin so content can sit flush below
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  activeTabLabel: {
    color: '#1B2B5C',
    fontWeight: '600',
  },
  tabIndicator: {
    height: 3,
    backgroundColor: '#1B2B5C',
    marginTop: 4,
  },
  contentContainer: {

    paddingHorizontal: 16,
    paddingTop: 4, // tighter to sit closer to tabs

  },
  tabContent: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2B5C',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#1FA29C',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2B5C',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#1FA29C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
