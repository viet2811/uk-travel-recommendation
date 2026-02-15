import { Link, useNavigation } from '@react-navigation/native';
import { Text } from 'components/ui/Text';
import { useAuth } from 'context/AuthContext';
import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function LoginScreen() {
  return <UserAuthScreen loginView />;
}

export function RegisterScreen() {
  return <UserAuthScreen loginView={false} />;
}

function UserAuthScreen({ loginView }: { loginView: boolean }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const { login } = useAuth();
  const { navigate } = useNavigation();
  const handleLogin = async () => {
    const { success, message } = await login(usernameInput, passwordInput);
    if (!success) {
      console.log(message);
    } else {
      navigate('Main');
    }
    //else: navigate to app stack, probably already automatically
  };
  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-1 justify-center items-center"
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled">
      <View className="w-5/6 gap-4 rounded border border-border bg-card p-6">
        <View>
          <Text className="mb-1 font-bold text-2xl">
            {loginView ? 'Log in' : 'Create an account'}
          </Text>
          <Text>To discover and find your attraction</Text>
        </View>

        <View>
          <Text className="mb-2 font-bold">Username</Text>
          <TextInput
            placeholder="Enter username..."
            className="border border-border p-4"
            value={usernameInput}
            onChangeText={setUsernameInput}
          />
        </View>

        <View>
          <Text className="mb-2 font-bold">Password</Text>
          <TextInput
            placeholder="Enter password..."
            className="border border-input p-4"
            value={passwordInput}
            onChangeText={setPasswordInput}
            secureTextEntry
          />
        </View>
        <Pressable
          className="mt-3 rounded border border-border bg-accent px-12 py-3"
          onPress={handleLogin}>
          <Text className="text-center font-bold text-secondary-foreground">
            {loginView ? 'Log in' : 'Create account'}
          </Text>
        </Pressable>

        {loginView ? (
          <Text className="text-center">
            Don't have an account?{' '}
            <Link screen="Register">
              <Text className="underline">Sign up</Text>
            </Link>
          </Text>
        ) : (
          <Text className="text-center">
            Already have an account?{' '}
            <Link screen="Login">
              <Text className="underline">Log in</Text>
            </Link>
          </Text>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}
