
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native-web";
import { PlayerHandicap } from "../utils/types";
import { Plus, Trash2, User } from "lucide-react";

interface PlayerSetupProps {
  players: PlayerHandicap[];
  onAddPlayer: (player: PlayerHandicap) => void;
  onRemovePlayer: (playerId: string) => void;
  tees: { id: string; name: string }[];
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  tees
}) => {
  const [name, setName] = useState("");
  const [handicapIndex, setHandicapIndex] = useState<number | "">("");
  const [tee, setTee] = useState(tees.length > 0 ? tees[0].id : "");

  const handleAddPlayer = () => {
    if (name.trim() && handicapIndex !== "" && tee) {
      const newPlayer: PlayerHandicap = {
        id: `player-${Date.now()}`,
        name: name.trim(),
        handicapIndex: typeof handicapIndex === "number" ? handicapIndex : 0,
        tee
      };
      
      onAddPlayer(newPlayer);
      
      // Reset form
      setName("");
      setHandicapIndex("");
      setTee(tees.length > 0 ? tees[0].id : "");
    }
  };

  const renderItem = ({ item }: { item: PlayerHandicap }) => {
    const playerTee = tees.find(t => t.id === item.tee);
    
    return (
      <View style={styles.playerCard}>
        <View style={styles.playerInfo}>
          <View style={styles.iconContainer}>
            <User size={18} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.playerName}>{item.name}</Text>
            <View style={styles.playerDetails}>
              <Text style={styles.playerDetailText}>Handicap: {item.handicapIndex}</Text>
              <Text style={styles.playerDetailText}>•</Text>
              <Text style={styles.playerDetailText}>Tee: {playerTee?.name || item.tee}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => onRemovePlayer(item.id)}
          style={styles.removeButton}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Add Players</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.formGrid}>
            <View style={styles.formField}>
              <Text style={styles.label}>Player Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter player name"
                style={styles.input}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Handicap Index</Text>
              <TextInput
                value={handicapIndex.toString()}
                onChangeText={(value) => setHandicapIndex(value === "" ? "" : Number(value))}
                placeholder="Enter handicap"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Tee</Text>
              <TextInput
                value={tee}
                onChangeText={setTee}
                placeholder="Select tee"
                style={styles.input}
              />
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleAddPlayer}
            disabled={!name.trim() || handicapIndex === "" || !tee}
            style={[styles.addButton, (!name.trim() || handicapIndex === "" || !tee) && styles.disabledButton]}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.buttonText}>Add Player</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {players.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.heading}>Players ({players.length})</Text>
          
          <FlatList
            data={players}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.playersList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  card: {
    padding: 20,
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
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  formContainer: {
    gap: 16,
  },
  formGrid: {
    gap: 16,
  },
  formField: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: {
    fontWeight: '500',
  },
  playerDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  playerDetailText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default PlayerSetup;
