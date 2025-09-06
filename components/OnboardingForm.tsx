import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions, ScrollView, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { User, DollarSign, Calendar, MapPin, Briefcase, Mail, Upload, FileText } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

interface OnboardingData {
  name: string;
  email: string;
  location: string;
  profession: string;
  monthlySalary: string;
  currency: string;
  uploadedDocument?: string;
}

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    location: '',
    profession: '',
    monthlySalary: '',
    currency: 'INR',
    uploadedDocument: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const steps = [
    {
      title: 'WELCOME TO MAESTRO',
      subtitle: 'Your Financial Adventure Begins',
      fields: ['name']
    },
    {
      title: 'CONTACT DETAILS',
      subtitle: 'How Can We Reach You?',
      fields: ['email', 'location']
    },
    {
      title: 'PROFESSIONAL INFO',
      subtitle: 'Tell Us About Your Work',
      fields: ['profession']
    },
    {
      title: 'FINANCIAL SETUP',
      subtitle: 'Set Your Monthly Income',
      fields: ['monthlySalary']
    },
    {
      title: 'DOCUMENT UPLOAD',
      subtitle: 'Upload Bank Statement (Optional)',
      fields: ['uploadedDocument']
    }
  ];

  const validateStep = (step: number) => {
    const currentFields = steps[step].fields;
    
    // Skip validation for optional document upload step
    if (step === 4) {
      return true; // Document upload is optional
    }
    
    for (const field of currentFields) {
      if (!formData[field as keyof OnboardingData]?.trim()) {
        Alert.alert('Missing Information', `Please fill in all required fields.`);
        return false;
      }
    }

    if (step === 3) { // Financial setup validation
      const salary = parseFloat(formData.monthlySalary);
      if (isNaN(salary) || salary <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid monthly salary amount.');
        return false;
      }
    }

    if (step === 1) { // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = async () => {
    setUploadingDocument(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Simulate successful processing for demo
        setTimeout(() => {
          updateFormData('uploadedDocument', file.name);
          setUploadingDocument(false);
          Alert.alert(
            '📄 Document Uploaded!',
            `${file.name} has been uploaded successfully. Your financial data will be analyzed to provide better insights.`,
            [{ text: 'Great!', style: 'default' }]
          );
        }, 1500); // 1.5 second delay to simulate processing
        
      } else {
        setUploadingDocument(false);
      }
    } catch (error) {
      setUploadingDocument(false);
      console.error('Upload Error:', error);
      Alert.alert('Upload Failed', 'Please try again with a valid PDF file.');
    }
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '';
    const number = parseFloat(amount);
    if (isNaN(number)) return amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(number);
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderField = (fieldName: string) => {
    const getIcon = () => {
      switch (fieldName) {
        case 'name': return <User size={16} color="#666666" />;
        case 'email': return <Mail size={16} color="#666666" />;
        case 'location': return <MapPin size={16} color="#666666" />;
        case 'profession': return <Briefcase size={16} color="#666666" />;
        case 'monthlySalary': return <DollarSign size={16} color="#666666" />;
        case 'uploadedDocument': return <FileText size={16} color="#666666" />;
        default: return null;
      }
    };

    const getPlaceholder = () => {
      switch (fieldName) {
        case 'name': return 'Enter your full name';
        case 'email': return 'Enter your email address';
        case 'location': return 'Enter your city, country';
        case 'profession': return 'Enter your job title';
        case 'monthlySalary': return 'Enter your monthly salary';
        case 'uploadedDocument': return 'No document selected';
        default: return '';
      }
    };

    const getLabel = () => {
      switch (fieldName) {
        case 'name': return 'FULL NAME';
        case 'email': return 'EMAIL ADDRESS';
        case 'location': return 'LOCATION';
        case 'profession': return 'PROFESSION';
        case 'monthlySalary': return 'MONTHLY SALARY (₹)';
        case 'uploadedDocument': return 'BANK STATEMENT (OPTIONAL)';
        default: return fieldName.toUpperCase();
      }
    };

    // Special handling for document upload
    if (fieldName === 'uploadedDocument') {
      return (
        <View key={fieldName} style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{getLabel()}</Text>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleDocumentUpload}
            disabled={uploadingDocument}
          >
            <View style={styles.uploadButtonContent}>
              <Upload size={20} color="#ffffff" />
              <Text style={styles.uploadButtonText}>
                {uploadingDocument ? 'UPLOADING...' : 'SELECT PDF'}
              </Text>
            </View>
          </TouchableOpacity>
          {formData.uploadedDocument && (
            <View style={styles.uploadedFileInfo}>
              <FileText size={16} color="#10B981" />
              <Text style={styles.uploadedFileName}>{formData.uploadedDocument}</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View key={fieldName} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{getLabel()}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            {getIcon()}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={getPlaceholder()}
            placeholderTextColor="#999999"
            value={formData[fieldName as keyof OnboardingData]}
            onChangeText={(value) => updateFormData(fieldName as keyof OnboardingData, value)}
            keyboardType={fieldName === 'monthlySalary' ? 'numeric' : 'default'}
            autoCapitalize={fieldName === 'email' ? 'none' : 'words'}
            autoComplete={fieldName === 'email' ? 'email' : 'off'}
          />
        </View>
        {fieldName === 'monthlySalary' && formData.monthlySalary && (
          <Text style={styles.currencyPreview}>
            Preview: {formatCurrency(formData.monthlySalary)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={require('../assets/images/ruppe.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>MAESTRO</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / steps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {steps.length}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Step Content */}
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
              <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>

            <View style={styles.formCard}>
              {steps[currentStep].fields.map(field => renderField(field))}
            </View>

            {/* Welcome Message for First Step */}
            {currentStep === 0 && (
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeText}>
                  🎮 Welcome to your financial adventure! MAESTRO gamifies your money management journey.
                </Text>
                <Text style={styles.welcomeText}>
                  📊 Track expenses, complete quests, and level up your financial skills!
                </Text>
              </View>
            )}

            {/* Salary Info for Step 4 */}
            {currentStep === 3 && (
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  💡 Your monthly salary helps us:
                </Text>
                <Text style={styles.infoText}>
                  • Calculate your spending ratios
                </Text>
                <Text style={styles.infoText}>
                  • Set realistic budget goals
                </Text>
                <Text style={styles.infoText}>
                  • Track your financial progress
                </Text>
                <Text style={styles.infoNote}>
                  🔒 Your data is stored securely on your device
                </Text>
              </View>
            )}

            {/* Document Upload Info for Step 5 */}
            {currentStep === 4 && (
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  📄 Upload your bank statement to:
                </Text>
                <Text style={styles.infoText}>
                  • Get personalized spending insights
                </Text>
                <Text style={styles.infoText}>
                  • Automatically categorize expenses
                </Text>
                <Text style={styles.infoText}>
                  • Track your financial patterns
                </Text>
                <Text style={styles.infoNote}>
                  ⚠️ This step is completely optional - you can skip it and add documents later from the homepage
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>BACK</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.nextButton, currentStep === 0 && styles.singleButton]} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'START JOURNEY' : 'NEXT'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#666666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#dddddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingBottom: 120,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  stepSubtitle: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 15,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  dividerImage: {
    width: '40%',
    height: 24,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#cccccc',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dddddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#dddddd',
  },
  textInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  currencyPreview: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#10B981',
    marginTop: 4,
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  welcomeText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#000000',
    lineHeight: 20,
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  infoText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    lineHeight: 16,
    marginBottom: 6,
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  infoNote: {
    fontSize: 9,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 10,
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#666666',
    borderRadius: 8,
    paddingVertical: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  singleButton: {
    marginLeft: 0,
  },
  nextButtonText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  uploadButton: {
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    marginLeft: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  uploadedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  uploadedFileName: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#10B981',
    marginLeft: 8,
    letterSpacing: 1,
    flex: 1,
  },
});
