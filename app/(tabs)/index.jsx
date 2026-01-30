import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";
import { Loader } from "../../components/Loader";
import { useMemo } from "react";
import { getOptimizedImage } from "../../lib/image";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const { token, user } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(
    async (pageNum = 1, refresh = false) => {
      try {
        if (refresh) setRefreshing(true);
        else if (pageNum === 1) setLoading(true);

        const response = await fetch(
          `${API_URL}/books?page=${pageNum}&limit=2`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch books");

        // setBooks((prevBooks) => [...prevBooks, ...data.books]);

        const uniqueBooks =
          refresh || pageNum === 1
            ? data.books
            : Array.from(
                new Set([...books, ...data.books].map((book) => book._id)),
              ).map((id) =>
                [...books, ...data.books].find((book) => book._id === id),
              );
        setBooks(uniqueBooks);

        setHasMore(pageNum < data.totalPages);
        setPage(pageNum);
      } catch (error) {
        console.log("Error fetching books", error);
      } finally {
        if (refresh) {
          await sleep(800);
          setRefreshing(false);
        } else setLoading(false);
      }
    },
    [token, books],
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !loading && !refreshing) {
      await sleep(1000);
      await fetchBooks(page + 1);
    }
  }, [hasMore, loading, refreshing, page, fetchBooks]);

  const renderRatingStars = useCallback((rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />,
      );
    }
    return stars;
  }, []);

  const fallbackAvatar = useMemo(() => {
    return `https://ui-avatars.com/api/?name=${user?.username || "Unknown"}`;
  }, [user?.username]);

  // ✅ Treat fallback as MAIN image
  const mainProfileImage = fallbackAvatar;

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.bookCard}>
          <View style={styles.bookHeader}>
            {/* User info section */}
            <View style={styles.userInfo}>
              <Image
                source={{ uri: getOptimizedImage(mainProfileImage, 100) }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{item.user?.username}</Text>
            </View>
          </View>

          <View style={styles.bookImageContainer}>
            {/* <Image
              source={{ uri: item.image }}
              style={styles.bookImage}
              contentFit="cover"
            /> */}
            <Image
              source={{ uri: getOptimizedImage(item.image, 600) }}
              style={styles.bookImage}
              contentFit="cover"
              priority={index === 0 ? "high" : "normal"}
            />
          </View>

          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              {renderRatingStars(item.rating)}
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
            <Text style={styles.date}>
              Shared On {formatPublishDate(item.createdAt)}
            </Text>
          </View>
        </View>
      );
    },
    [renderRatingStars],
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BOOKWORM</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a book!
            </Text>
          </View>
        }
      />
    </View>
  );
}
