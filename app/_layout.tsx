import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store'
import { useColorScheme } from '@/hooks/useColorScheme';
import { ClerkProvider,  SignedIn, SignedOut, } from '@clerk/clerk-expo';
import LoginScreen from '../screens/LoginScreen';
import * as Location from 'expo-location';
import { UserLocationContext } from '../src/Context/UserLocationContext';
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    'Outfit-SemiBold': require('../assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-ExtraBold': require('../assets/fonts/Outfit-ExtraBold.ttf'),
  });


  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  ;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log(location)
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key)
        if (item) {
          console.log(`${key} was used 🔐 \n`)
        } else {
          console.log('No values stored under key: ' + key)
        }
        return item
      } catch (error) {
        console.error('SecureStore get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value)
      } catch (err) {
        return
      }
    },
  }
  const publishableKey = 'pk_test_bW92aW5nLWhhd2stMTQuY2xlcmsuYWNjb3VudHMuZGV2JA'
  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key',
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <UserLocationContext.Provider 
      value={{location,setLocation}} >
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <SignedOut>
      <LoginScreen/>
      </SignedOut>
      <SignedIn>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </SignedIn>
    </ThemeProvider>
    </UserLocationContext.Provider>
    </ClerkProvider>
  );
}
