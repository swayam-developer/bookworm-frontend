import React, { Suspense, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useFonts } from "expo-font";
import COLORS from "../constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  // Hide splash only after fonts load
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Restore auth ONCE
  useEffect(() => {
    checkAuth();
  }, []);

  // Auth-based routing
  useEffect(() => {
    if (isCheckingAuth || segments.length === 0) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = !!(user && token);

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isCheckingAuth, user, token, segments]);

  // Block render until ready
  if (!fontsLoaded || isCheckingAuth) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        {/* 🔥 THIS ENABLES ROUTE-LEVEL LAZY LOADING */}
        <Suspense
          fallback={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          }
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </Suspense>
      </SafeScreen>

      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
