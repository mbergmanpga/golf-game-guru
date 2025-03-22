
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useLocation } from "react-router-dom";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isRoundActive = location.pathname.includes('/round');

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={[styles.scrollView, isRoundActive ? styles.withBottomPadding : styles.withStandardPadding]}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.content}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  content: {
    maxWidth: 1024,
    width: '100%',
    marginHorizontal: 'auto',
    paddingVertical: 24,
  },
  withBottomPadding: {
    paddingBottom: 80,
  },
  withStandardPadding: {
    paddingBottom: 32,
  }
});

export default Layout;
