import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Clock, Flag, Plus, Settings, Trophy, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Flag size={24} className="text-primary" />
          </div>
          <h1 className="heading-1 mb-4">Golf Game Guru</h1>
          <p className="text-lg text-muted-foreground">
            Track multiple golf games simultaneously with handicaps for your entire group
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            to="/setup" 
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">New Round</h2>
            <p className="text-muted-foreground mb-4">
              Set up a new round with multiple game formats and players
            </p>
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mt-auto">
              Start Now
            </span>
          </Link>
          
          <div className="card opacity-60 cursor-not-allowed">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Recent Rounds</h2>
            <p className="text-muted-foreground mb-4">
              View your recent rounds and game results
            </p>
            <div className="text-center py-4">
              <span className="text-muted-foreground/70">No recent rounds</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Trophy size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Games</h3>
            <p className="text-muted-foreground">
              Track Bingo Bango Bongo, Wolf, Four Ball, and Stroke Play all at once
            </p>
          </div>
          
          <div className="card">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Player Handicaps</h3>
            <p className="text-muted-foreground">
              Set handicap index and tees for each player in your group
            </p>
          </div>
          
          <div className="card">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Settings size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Customizable</h3>
            <p className="text-muted-foreground">
              Adjust handicap percentages and game settings to your preference
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
