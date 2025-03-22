
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Clock, Golf, Plus, Settings, Trophy, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-10 py-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="icon-container mx-auto mb-6">
            <Golf size={24} />
          </div>
          <h1 className="heading-1 mb-4">Golf Game Guru</h1>
          <p className="text-xl text-foreground/70">
            Track multiple golf games simultaneously with handicaps for your entire group
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/setup" 
            className="card card-hover p-6 flex flex-col items-start"
          >
            <div className="icon-container mb-4">
              <Plus size={20} />
            </div>
            <h2 className="heading-2 mb-2">New Round</h2>
            <p className="text-foreground/70 mb-4">
              Set up a new round with multiple game formats and players
            </p>
            <div className="pill pill-primary mt-auto">Start Now</div>
          </Link>
          
          <div className="card p-6 opacity-60">
            <div className="icon-container mb-4">
              <Clock size={20} />
            </div>
            <h2 className="heading-2 mb-2">Recent Rounds</h2>
            <p className="text-foreground/70 mb-4">
              View your recent rounds and game results
            </p>
            <div className="text-center py-4 text-muted-foreground">
              No recent rounds
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-5">
            <div className="icon-container mb-4">
              <Trophy size={20} />
            </div>
            <h3 className="heading-3 mb-2">Multiple Games</h3>
            <p className="text-foreground/70">
              Track Bingo Bango Bongo, Wolf, Four Ball, and Stroke Play all at once
            </p>
          </div>
          
          <div className="card p-5">
            <div className="icon-container mb-4">
              <Users size={20} />
            </div>
            <h3 className="heading-3 mb-2">Player Handicaps</h3>
            <p className="text-foreground/70">
              Set handicap index and tees for each player in your group
            </p>
          </div>
          
          <div className="card p-5">
            <div className="icon-container mb-4">
              <Settings size={20} />
            </div>
            <h3 className="heading-3 mb-2">Customizable</h3>
            <p className="text-foreground/70">
              Adjust handicap percentages and game settings to your preference
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
