# MAESTRO - Financial Sage App

A React Native Expo app with an AI-powered Financial Sage that provides personalized financial advice based on your actual spending data.

## 🚀 Features

- **AI Financial Sage**: Powered by Azure OpenAI GPT-4.1 with mystical RPG-style personality
- **PDF Analysis**: Upload bank statements for personalized financial insights
- **Contextual Chat**: Maintains conversation history with financial context
- **Secure Processing**: Bank-level encryption messaging for user confidence
- **Persistent Storage**: Conversation and financial data persist across sessions

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd maestro
npm install
```

### 2. Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your API keys in the `.env` file:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=your_gpt_deployment_name
OPENAI_API_TYPE=azure

# Google API Configuration (optional)
GOOGLE_API_KEY=your_google_api_key_here

# Other configurations...
```

### 3. Required API Keys

#### Azure OpenAI (Required)
- **API Key**: Your Azure OpenAI subscription key
- **Endpoint**: Your Azure OpenAI resource endpoint
- **Deployment Name**: Your GPT-4 deployment name

#### Expense Tracker API (Pre-configured)
- The PDF analysis API endpoint is pre-configured
- No additional setup required

### 4. Run the App

```bash
# Start development server
npm run dev

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

## 🔒 Security Features

- **Environment Variables**: All API keys stored in `.env` file (not committed to git)
- **Input Validation**: Environment variable validation before API calls
- **Fallback System**: Graceful degradation if APIs are unavailable
- **Privacy Messaging**: Clear communication about data processing

## 🏗️ Architecture

### Core Components

- **Financial Sage (`app/(tabs)/sage.tsx`)**: Main chat interface with AI integration
- **API Service (`lib/apiService.ts`)**: Handles Azure OpenAI and PDF analysis APIs
- **Analysis Storage (`lib/analysisStorage.ts`)**: Persistent storage for financial data and conversations
- **Config (`lib/config.ts`)**: Environment-based configuration with validation

### Key Features

1. **Smart Upload Prompts**: Automatically detects when financial advice needs data
2. **Contextual Responses**: AI references actual spending patterns and amounts
3. **Conversation Memory**: Maintains context across multiple interactions
4. **Error Handling**: Robust fallback mechanisms for API failures

## 🧪 Development & Testing

### Test LLM Integration

In development mode, a "TEST LLM" button appears in the sage interface for testing:

- Tests Azure OpenAI connection
- Tests with financial context
- Tests PDF analysis API connectivity

### Environment Validation

The app automatically validates required environment variables on startup and provides clear error messages for missing configurations.

## 📱 Usage

1. **First Time Setup**: 
   - Open the Sage tab
   - Upload a bank statement PDF for personalized advice
   - Or continue with general financial wisdom

2. **Chat with the Sage**:
   - Ask questions about budgeting, saving, investing, debt management
   - Get responses tailored to your actual financial data
   - Conversation history is maintained across sessions

3. **Upload Financial Data**:
   - Use the upload button in the header
   - Secure processing with privacy assurance
   - Data is analyzed and stored locally for personalized advice

## 🔧 Configuration Options

### API Configuration
All API settings can be customized via environment variables:

- **Azure OpenAI**: Model, temperature, max tokens
- **PDF Analysis**: Endpoint and processing options
- **Storage**: Local storage keys and retention

### Character Customization
The Financial Sage personality can be modified in `lib/config.ts`:

- System prompt and character traits
- Response patterns and vocabulary
- Financial philosophy and advice style

## 🚨 Important Notes

- **Never commit `.env` file**: It's already in `.gitignore`
- **API Key Security**: Keep your Azure OpenAI keys secure
- **Environment Variables**: Required for production deployment
- **Fallback Responses**: App works even without API keys (limited functionality)

## 📞 Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify environment variables are set correctly
3. Test API connectivity using the development test button
4. Review the fallback response system for offline functionality

---

**Note**: This app requires Azure OpenAI access for full functionality. The PDF analysis feature uses an external API for processing financial documents.
