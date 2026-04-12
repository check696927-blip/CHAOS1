import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { getPunchCard, claimReward, getConsecutiveBonus, STAMP_VALUE, MAX_STAMPS } from "@/lib/punchcard";
import { Gift, Sparkles, Calendar, TrendingUp } from "lucide-react";

const PunchCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  const [card, setCard] = useState<any>(null);
  const [animatingStamps, setAnimatingStamps] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      const punchCard = getPunchCard(user.id);
      setCard(punchCard);

      // Animate new stamps
      const newStamps = punchCard.stamps
        .map((s, i) => s.animated ? i : -1)
        .filter(i => i >= 0);
      
      if (newStamps.length > 0) {
        setAnimatingStamps(newStamps);
        setTimeout(() => setAnimatingStamps([]), 2000);
      }
    }
  }, [user]);

  const handleClaimReward = (rewardId: string) => {
    if (user) {
      claimReward(user.id, rewardId);
      setCard(getPunchCard(user.id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <Gift className="w-16 h-16 text-chaos-purple mx-auto" />
          <h2 className="font-chaos text-3xl neon-text-red">Sign in to view your Punch Card</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!card) {
    return null;
  }

  const progress = (card.stamps.length / MAX_STAMPS) * 100;
  const consecutiveBonus = getConsecutiveBonus(card.consecutiveMonths);

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Gift className="w-16 h-16 text-chaos-purple mx-auto" />
            <h1 className="font-chaos text-5xl neon-text-red">Punch Card</h1>
            <p className="text-gray-400 text-lg">
              Earn stamps with every purchase • Unlock amazing rewards
            </p>
          </div>

          {/* Consecutive Months Bonus */}
          {card.consecutiveMonths > 1 && (
            <div className="bg-gradient-to-r from-chaos-purple/20 to-chaos-cyan/20 border-2 border-chaos-purple rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-chaos-cyan" />
                  <div>
                    <h3 className="font-neon font-bold">
                      {card.consecutiveMonths} Consecutive Months! 🔥
                    </h3>
                    <p className="text-sm text-gray-400">
                      Keep the streak going for bonus rewards
                    </p>
                  </div>
                </div>
                {consecutiveBonus > 0 && (
                  <div className="text-right">
                    <p className="font-bold text-chaos-cyan text-xl">+{consecutiveBonus} pts</p>
                    <p className="text-xs text-gray-400">Bonus earned</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="bg-chaos-dark border-2 border-chaos-purple/30 rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-neon text-xl font-bold">Your Progress</h3>
              <span className="text-chaos-purple font-bold">
                {card.stamps.length} / {MAX_STAMPS} stamps
              </span>
            </div>
            
            <div className="w-full bg-chaos-darker rounded-full h-4 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-chaos-red to-chaos-purple transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-400 text-center">
              Earn 1 stamp for every ${STAMP_VALUE} spent
            </p>
          </div>

          {/* Stamp Grid */}
          <div className="bg-chaos-dark border-2 border-chaos-purple/30 rounded-lg p-8">
            <h3 className="font-neon text-xl font-bold mb-6 text-center">Stamp Collection</h3>
            
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
              {Array.from({ length: MAX_STAMPS }).map((_, index) => {
                const hasStamp = index < card.stamps.length;
                const isAnimating = animatingStamps.includes(index);

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                      hasStamp
                        ? 'border-chaos-purple bg-gradient-to-br from-chaos-purple to-chaos-red neon-box-glow'
                        : 'border-gray-700 bg-chaos-darker'
                    } ${isAnimating ? 'animate-bounce scale-110' : ''}`}
                  >
                    {hasStamp && (
                      <Sparkles className="w-6 h-6 text-white" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-chaos-dark border-2 border-chaos-purple/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-chaos-cyan" />
              <h3 className="font-neon text-xl font-bold">Milestone Rewards</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { stamps: 5, reward: '$10 OFF', desc: '5 stamps' },
                { stamps: 10, reward: '$25 OFF', desc: '10 stamps' },
                { stamps: 20, reward: 'FREE ITEM', desc: '20 stamps' }
              ].map(milestone => {
                const unlocked = card.stamps.length >= milestone.stamps;
                const reward = card.rewardsUnlocked.find((r: any) => r.milestone === milestone.stamps);
                const claimed = reward?.claimed || false;

                return (
                  <div
                    key={milestone.stamps}
                    className={`p-6 rounded-lg border-2 text-center space-y-3 transition-all ${
                      unlocked
                        ? 'border-chaos-cyan bg-chaos-cyan/10'
                        : 'border-gray-700 bg-chaos-darker opacity-50'
                    }`}
                  >
                    <div className={`text-3xl font-bold ${
                      unlocked ? 'neon-text-cyan' : 'text-gray-600'
                    }`}>
                      {milestone.reward}
                    </div>
                    <p className="text-sm text-gray-400">{milestone.desc}</p>
                    
                    {unlocked && !claimed && (
                      <button
                        onClick={() => reward && handleClaimReward(reward.id)}
                        className="w-full bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-2 px-4 rounded-lg hover:scale-105 transition-all"
                      >
                        Claim Reward
                      </button>
                    )}
                    
                    {claimed && (
                      <div className="text-green-400 font-bold text-sm">
                        ✓ Claimed
                      </div>
                    )}
                    
                    {!unlocked && (
                      <div className="text-gray-500 text-sm">
                        {milestone.stamps - card.stamps.length} more stamps needed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-r from-chaos-red/20 to-chaos-purple/20 border border-chaos-purple/30 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-300">
              💡 Cards reset monthly with bonus rewards for consecutive months! Keep shopping to maximize your rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchCard;
