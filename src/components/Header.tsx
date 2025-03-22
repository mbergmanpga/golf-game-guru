
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native-web";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Home, Flag, Menu } from "lucide-react";
import { useGame } from "../contexts/GameContext";

const Header: React.FC = () => {
  const location = useLocation();
  const { state, resetRound } = useGame();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isRound = location.pathname.includes("/round");
  const isSetup = location.pathname.includes("/setup");
  const isResults = location.pathname.includes("/results");

  const getTitle = () => {
    if (isHome) return "Golf Game Guru";
    if (isSetup) return "Game Setup";
    if (isRound) {
      return state.currentRound 
        ? `Hole ${state.currentRound.currentHole}` 
        : "Round";
    }
    if (isResults) return "Game Results";
    return "Golf Game Guru";
  };

  const handleEndRound = () => {
    if (confirm("Are you sure you want to end the current round?")) {
      resetRound();
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.container}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              {!isHome && (
                <TouchableOpacity 
                  component={Link}
                  to={isRound ? "/results" : "/"} 
                  style={styles.backButton}
                >
                  <ArrowLeft size={20} color="#666" />
                </TouchableOpacity>
              )}
              <Text style={styles.title}>{getTitle()}</Text>
              {isRound && state.currentRound && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>
                    {state.currentRound.currentHole}/{state.currentRound.totalHoles}
                  </Text>
                </View>
              )}
            </View>

            <View>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {isMenuOpen && (
        <View style={styles.mobileMenu}>
          <View style={styles.container}>
            <View style={styles.menuContent}>
              <TouchableOpacity 
                component={Link}
                to="/" 
                style={styles.menuItem}
                onPress={() => setIsMenuOpen(false)}
              >
                <Home size={18} color="#333" />
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>
              
              {(isRound || isResults) && (
                <TouchableOpacity 
                  onPress={() => {
                    handleEndRound();
                    setIsMenuOpen(false);
                  }}
                  style={styles.endRoundButton}
                >
                  <Flag size={18} color="#e11d48" />
                  <Text style={styles.endRoundText}>End Round</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  container: {
    maxWidth: 1024,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  pill: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16a34a',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
  },
  mobileMenu: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuContent: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
  },
  endRoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  endRoundText: {
    fontSize: 16,
    color: '#e11d48',
  },
});

export default Header;
