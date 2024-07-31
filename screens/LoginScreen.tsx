import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import Colors from '../assets/colors'


export const useWarmUpBrowser = () => {
    React.useEffect(() => {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, []);
  };
  
  WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  
    const onPress = React.useCallback(async () => {
      try {
        const result = await startOAuthFlow({ redirectUrl: Linking.createURL("tabNavigation", { scheme: "Home" }) });
  
        if (!result) {
          console.error("startOAuthFlow did not return a result");
          return;
        }
  
        const { createdSessionId, setActive } = result;
  
        if (createdSessionId) {
          if (setActive) {
            setActive({ session: createdSessionId });
          } else {
            console.error("setActive is undefined");
          }
        } else {
          console.log("Invalid session ID");
        }
      } catch (err) {
        console.error("OAuth error", err);
      }
    }, [startOAuthFlow]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
      <Image source={require('../assets/images/ev-charging-station.png')} style={styles.bgImage} />
      <View style={{ padding: 20 }}>
        <Text style={styles.heading}>Your Ultimate EV Charging Station Finder App</Text>
        <Text style={styles.desc}>Find EV Charging Stations near you, plan trips, and much more in just one click</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Login With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 15,
      alignItems: 'center',
    },
    logoImage: {
      width: 200,
      height: 90,
      resizeMode: 'contain',
    },
    bgImage: {
      width: '100%',
      height: 350,
      resizeMode: 'contain',
    },
    heading: {
      fontSize: 25,
      fontFamily: 'Outfit-Bold',
      textAlign: 'left',
    },
    desc: {
      fontSize: 17,
      fontFamily: 'Outfit-Regular',
      marginTop: 5,
      textAlign: 'left',
      color: Colors.GRAY,
    },
    button: {
      backgroundColor: Colors.PRIMARY,
      padding: 16,
      borderRadius: 99,
      marginTop: 80,
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 17,
      fontFamily: 'Outfit-SemiBold',
      color: Colors.WHITE,
      letterSpacing: 0.75,
    },
  });
  
