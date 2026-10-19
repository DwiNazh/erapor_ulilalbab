// src/navigation/AppNavigator.js
import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import api, { setOnUnauthorized } from "../api";
import LoginSiswa from "../screens/LoginSiswa";
import DashboardSiswa from "../screens/DashboardSiswa";
import ProfilSiswa from "../screens/ProfilSiswa";
import JadwalSiswa from "../screens/JadwalSiswa";
import AbsensiSiswa from "../screens/AbsensiSiswa";
import NilaiSiswa from "../screens/NilaiSiswa";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState("LoginSiswa");
  const navigationRef = useRef(null);

  useEffect(() => {
    checkAuth();

    setOnUnauthorized(() => {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: "LoginSiswa" }],
      });
    });
  }, []);

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("siswa_token");

    if (!token) {
      setInitialRoute("LoginSiswa");
      setCheckingAuth(false);
      return;
    }

    try {
      await api.get("/api/siswa/me");
      setInitialRoute("DashboardSiswa");
    } catch (e) {
      await SecureStore.deleteItemAsync("siswa_token");
      await SecureStore.deleteItemAsync("siswa_data");
      setInitialRoute("LoginSiswa");
    } finally {
      setCheckingAuth(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginSiswa" component={LoginSiswa} />
        <Stack.Screen
          name="DashboardSiswa"
          component={DashboardSiswa}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="ProfilSiswa"
          component={ProfilSiswa}
          options={{ headerShown: true, title: "Profil Saya" }}
        />
        <Stack.Screen
          name="JadwalSiswa"
          component={JadwalSiswa}
          options={{ headerShown: true, title: "Jadwal Pelajaran" }}
        />
        <Stack.Screen
          name="AbsensiSiswa"
          component={AbsensiSiswa}
          options={{ headerShown: true, title: "Absensi Saya" }}
        />
        <Stack.Screen
          name="NilaiSiswa"
          component={NilaiSiswa}
          options={{ headerShown: true, title: "Nilai Akademik" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}