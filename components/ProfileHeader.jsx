import { View, Text } from "react-native";
import React from "react";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles";
import { Image } from "expo-image";
import { formatMemberSince } from "../lib/utils";
import COLORS from "../constants/colors";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  // ✅ Guard: Handle loading or missing user
  if (!user) {
    return (
      <View
        style={[
          styles.profileHeader,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: COLORS.textSecondary }}>Loading profile...</Text>
      </View>
    );
  }

  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    user.username || "User"
  }&backgroundColor=lightblue`;

  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: user.profileImage || fallbackAvatar }}
        style={styles.profileImage}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username || "Unknown User"}</Text>
        <Text style={styles.email}>{user.email || "No email available"}</Text>
        <Text style={styles.memberSince}>
          Joined{" "}
          {user.createdAt ? formatMemberSince(user.createdAt) : "recently"}
        </Text>
      </View>
    </View>
  );
}
