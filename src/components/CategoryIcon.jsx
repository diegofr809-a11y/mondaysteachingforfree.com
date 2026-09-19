import React from 'react';
import {
  Gamepad2,
  Zap,
  Flame,
  Puzzle,
  Trophy,
  Car,
  Boxes,
  Sparkles,
  Heart,
  Crown,
  Users,
} from 'lucide-react';

export const CategoryIcon = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Puzzle':
      return <Puzzle className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
