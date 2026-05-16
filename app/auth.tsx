import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';
import { COLORS } from '@/src/constants/theme';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { login, signup, isLoading, error } = useAuthStore();

  const validate = () => {
    const errors: string[] = [];
    if (!email.trim()) errors.push("L'email est requis");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("L'email n'est pas valide");
    if (!password) errors.push('Le mot de passe est requis');
    else if (password.length < 6) errors.push('Le mot de passe doit contenir au moins 6 caractères');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch {
      // Error is handled by the store
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setValidationErrors([]);
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Brand */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-brand rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">L</Text>
            </View>
            <Text className="text-primary-text text-3xl font-bold mb-2">Luma</Text>
            <Text className="text-secondary-text text-base text-center leading-relaxed">
              Understand your body, one day at a time.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-card rounded-card p-6 shadow-card">
            {/* Toggle */}
            <View className="flex-row bg-card rounded-pill p-1 mb-6">
              <TouchableOpacity
                onPress={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-pill items-center ${
                  isLogin ? 'bg-background shadow-sm' : ''
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isLogin ? 'text-primary-text' : 'text-secondary-text'
                  }`}
                >
                  Connexion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-pill items-center ${
                  !isLogin ? 'bg-background shadow-sm' : ''
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    !isLogin ? 'text-primary-text' : 'text-secondary-text'
                  }`}
                >
                  Inscription
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-primary-text text-sm font-medium mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="vous@exemple.com"
                placeholderTextColor={COLORS.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-card rounded-button px-4 py-3.5 text-primary-text text-base border border-transparent focus:border-brand"
              />
            </View>

            {/* Password */}
            <View className="mb-1">
              <Text className="text-primary-text text-sm font-medium mb-2">Mot de passe</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.text.secondary}
                secureTextEntry
                autoCapitalize="none"
                className="bg-card rounded-button px-4 py-3.5 text-primary-text text-base border border-transparent focus:border-brand"
              />
            </View>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <View className="mt-4">
                {validationErrors.map((err, i) => (
                  <Text key={i} className="text-red-500 text-sm mb-1">
                    {err}
                  </Text>
                ))}
              </View>
            )}

            {/* Server Error */}
            {error && (
              <Text className="text-red-500 text-sm mt-4 text-center">{error}</Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className="bg-brand rounded-button py-4 items-center mt-6 shadow-button"
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text.inverse} />
              ) : (
                <Text className="text-white text-base font-semibold">
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Toggle */}
          <View className="flex-row justify-center mt-6 mb-4">
            <Text className="text-secondary-text text-sm">
              {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text className="text-brand text-sm font-semibold ml-1">
                {isLogin ? "S'inscrire" : 'Se connecter'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
