import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles";
import { Image } from "expo-image";
import { formatMemberSince } from "../lib/utils";
import COLORS from "../constants/colors";
import { getOptimizedImage } from "../lib/image";

export default function ProfileHeader() {
  const { user } = useAuthStore();

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

  // ✅ Generate fallback avatar
  const fallbackAvatar = useMemo(() => {
    return `https://ui-avatars.com/api/?name=${user.username || "Unknown"}`;
  }, [user?.username]);

  // ✅ Treat fallback as MAIN image
  const mainProfileImage = fallbackAvatar;

  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: getOptimizedImage(mainProfileImage, 100) }}
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
