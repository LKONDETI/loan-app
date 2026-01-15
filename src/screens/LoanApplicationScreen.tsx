import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../api/auth';
import apiClient from '../api/client';

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
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const loanType = route.params?.loanType;

  // Form State
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [income, setIncome] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email);
        const nameParts = user.name.split(' ');
        if (nameParts.length > 0) setFirstName(nameParts[0]);
        if (nameParts.length > 1) setLastName(nameParts.slice(1).join(' '));
      }
    } catch (error) {
      console.log('Error fetching user for application:', error);
    }
  };

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'you', label: 'You' },
    { id: 'income', label: 'Income' },
    { id: 'documents', label: 'Documents' },
  ] as const;

  const isLastTab = activeTab === 'documents';

  const validateTab = () => {
    switch (activeTab) {
      case 'details':
        if (!amount || !term || !purpose) {
          Alert.alert('Missing Fields', 'Please fill in all loan details.');
          return false;
        }
        return true;
      case 'you':
        if (!firstName || !lastName || !email || !phone) {
          Alert.alert('Missing Fields', 'Please fill in all personal details.');
          return false;
        }
        return true;
      case 'income':
         // Optional for demo, but good to have
         return true;
      default:
        return true;
    }
  };

  const calculateMonthlyPayment = (principal: number, months: number, rate: number) => {
    if (principal <= 0 || months <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const goToNextTabOrSubmit = async () => {
    if (!validateTab()) return;

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
    
    // Final Submit
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User session invalid. Please login again.');
      return;
    }

    setLoading(true);
    try {
      const principal = parseFloat(amount);
      const months = parseInt(term);
      const rate = 8.5; // Fixed rate for demo
      const monthlyPayment = calculateMonthlyPayment(principal, months, rate);

      const payload = {
        userId,
        borrowerName: `${firstName} ${lastName}`,
        amount: principal,
        interestRate: rate,
        loanTerm: months,
        startDate: new Date().toISOString(),
        status: 'pending',
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      };

      await apiClient.post('/loans', payload);

      Alert.alert(
        'Success',
        'Your loan application has been submitted successfully!',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Loan submission error:', error);
      const msg = error.response?.data?.detail || 'Failed to submit application.';
      Alert.alert('Application Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionLabel}>Loan Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5000"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.sectionLabel}>Loan Term (Months)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 12"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={term}
              onChangeText={setTerm}
            />

            <Text style={styles.sectionLabel}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Home Renovation"
              placeholderTextColor="#999"
              value={purpose}
              onChangeText={setPurpose}
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
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.sectionLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text style={styles.sectionLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={false} // Prefilled from login
            />

            <Text style={styles.sectionLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        );
      case 'income':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionLabel}>Annual Income ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 60000"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={income}
              onChangeText={setIncome}
            />

            <Text style={styles.sectionLabel}>Employment Status</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Full-time"
              placeholderTextColor="#999"
              value={employmentStatus}
              onChangeText={setEmploymentStatus}
            />

            <Text style={styles.sectionLabel}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              placeholderTextColor="#999"
              value={company}
              onChangeText={setCompany}
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
            <Text style={styles.hintText}>* You can skip uploading for this demo</Text>
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
          style={[styles.nextButton, loading && styles.disabledButton]}
          onPress={goToNextTabOrSubmit}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.nextButtonText}>{isLastTab ? 'Submit Application' : 'Next'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    maxHeight: 50,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    position: 'relative',
  },
  activeTab: {},
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
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContent: {
    gap: 16,
    paddingBottom: 24,
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
  hintText: {
     fontSize: 12,
     color: '#666',
     alignSelf: 'center',
     fontStyle: 'italic',
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
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
