
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Clock, Flag, Plus, Settings, Trophy, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={[styles.iconContainer, styles.heroIcon]}>
            <Flag size={24} color="#16a34a" />
          </View>
          <Text style={styles.heading}>Golf Game Guru</Text>
          <Text style={styles.subheading}>
            Track multiple golf games simultaneously with handicaps for your entire group
          </Text>
        </View>
        
        <View style={styles.cardGrid}>
          <TouchableOpacity 
            component={Link}
            to="/setup" 
            style={[styles.card, styles.cardHover]}
          >
            <View style={styles.iconContainer}>
              <Plus size={20} color="#16a34a" />
            </View>
            <Text style={styles.cardTitle}>New Round</Text>
            <Text style={styles.cardDescription}>
              Set up a new round with multiple game formats and players
            </Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Start Now</Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.card, styles.disabledCard]}>
            <View style={styles.iconContainer}>
              <Clock size={20} color="#16a34a" />
            </View>
            <Text style={styles.cardTitle}>Recent Rounds</Text>
            <Text style={styles.cardDescription}>
              View your recent rounds and game results
            </Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent rounds</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Trophy size={20} color="#16a34a" />
            </View>
            <Text style={styles.featureTitle}>Multiple Games</Text>
            <Text style={styles.featureDescription}>
              Track Bingo Bango Bongo, Wolf, Four Ball, and Stroke Play all at once
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Users size={20} color="#16a34a" />
            </View>
            <Text style={styles.featureTitle}>Player Handicaps</Text>
            <Text style={styles.featureDescription}>
              Set handicap index and tees for each player in your group
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Settings size={20} color="#16a34a" />
            </View>
            <Text style={styles.featureTitle}>Customizable</Text>
            <Text style={styles.featureDescription}>
              Adjust handicap percentages and game settings to your preference
            </Text>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 40,
  },
  hero: {
    alignItems: 'center',
    maxWidth: 640,
    marginHorizontal: 'auto',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  heroIcon: {
    marginBottom: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  card: {
    flex: 1,
    minWidth: 280,
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHover: {
    // Note: In React Native, we'll handle this with Pressable state
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 16,
  },
  pill: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 'auto',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  featureCard: {
    flex: 1,
    minWidth: 240,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
});

export default Index;
