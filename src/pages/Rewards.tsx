import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { 
  getRewardsAccount, 
  createRewardsAccount, 
  getTransactions,
  getNextTierProgress,
  redeemPoints
} from "@/lib/rewards";
import { RewardsAccount, PointsTransaction, Reward } from "@/types/rewards";
import { TIER_BENEFITS } from "@/types/rewards";
import { 
  Trophy, 
  Gift, 
  Star, 
  TrendingUp, 
  Clock, 
  ArrowLeft,
  Zap,
  Crown,
  Sparkles,
  Truck,
  Tag
} from "lucide-react";

const AVAILABLE_REWARDS: Reward[] = [
  {
    id: 'r1',
    name: '$10 Off',
    description: 'Get $10 off your next order',
    pointsCost: 1000,
    type: 'discount',
    value: 10,
    available: true
  },
  {
    id: 'r2',
    name: '$25 Off',
    description: 'Get $25 off your next order',
    pointsCost: 2500,
    type: 'discount',
    value: 25,
    available: true,
    tier: 'Silver'
  },
  {
    id: 'r3',
    name: 'Free Shipping',
    description: 'Free shipping on your next order',
    pointsCost: 500,
    type: 'free_shipping',
    value: 0,
    available: true
  },
  {
    id: 'r4',
    name: '$50 Off',
    description: 'Get $50 off your next order',
    pointsCost: 5000,
    type: 'discount',
    value: 50,
    available: true,
    tier: 'Gold'
  },
  {
    id: 'r5',
    name: 'Early Access Pass',
    description: '24-hour early access to new drops',
    pointsCost: 750,
    type: 'early_access',
    value: 0,
    available: true
  }
];

const Rewards = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  
  const [account, setAccount] = useState<RewardsAccount | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history'>('overview');

  useEffect(() => {
    if (user) {
      let userAccount = getRewardsAccount(user.id);
      if (!userAccount) {
        userAccount = createRewardsAccount(user.id);
      }
      setAccount(userAccount);
      setTransactions(getTransactions(user.id));
    }
  }, [user]);

  if (!isAuthenticated || !user || !account) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">Sign In to Access Rewards</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-3 px-8 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const progress = getNextTierProgress(account);
  const benefits = TIER_BENEFITS[account.tier];

  const handleRedeem = (reward: Reward) => {
    if (account.points < reward.pointsCost) {
      alert("Not enough points!");
      return;
    }

    if (reward.tier && account.tier !== reward.tier && account.tier !== 'Gold') {
      alert(`This reward requires ${reward.tier} tier or higher!`);
      return;
    }

    const updated = redeemPoints(user.id, reward.pointsCost, `Redeemed: ${reward.name}`);
    if (updated) {
      setAccount(updated);
      setTransactions(getTransactions(user.id));
      alert(`Successfully redeemed ${reward.name}!`);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-gray-300';
      default: return 'text-orange-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Gold': return Crown;
      case 'Silver': return Star;
      default: return Trophy;
    }
  };

  const TierIcon = getTierIcon(account.tier);

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-chaos-purple hover:text-chaos-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-neon">Back to Shop</span>
        </button>

        <h1 className="font-chaos text-4xl neon-text-red mb-8">REWARDS PROGRAM</h1>

        {/* Points & Tier Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Points Balance */}
          <div className="bg-gradient-to-br from-chaos-purple/20 to-chaos-red/20 border-2 border-chaos-purple/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-chaos-cyan" />
              <h3 className="font-neon font-bold">Available Points</h3>
            </div>
            <p className="text-5xl font-bold neon-text-purple mb-2">{account.points}</p>
            <p className="text-sm text-gray-400">Lifetime: {account.lifetimePoints} points</p>
          </div>

          {/* Current Tier */}
          <div className="bg-gradient-to-br from-chaos-red/20 to-chaos-purple/20 border-2 border-chaos-red/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TierIcon className={`w-8 h-8 ${getTierColor(account.tier)}`} />
              <h3 className="font-neon font-bold">Membership Tier</h3>
            </div>
            <p className={`text-5xl font-bold ${getTierColor(account.tier)} mb-2`}>{account.tier}</p>
            <p className="text-sm text-gray-400">{benefits.pointsMultiplier}x points multiplier</p>
          </div>

          {/* Next Tier Progress */}
          <div className="bg-gradient-to-br from-chaos-cyan/20 to-chaos-purple/20 border-2 border-chaos-cyan/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-chaos-cyan" />
              <h3 className="font-neon font-bold">Next Tier</h3>
            </div>
            {progress.next ? (
              <>
                <p className={`text-3xl font-bold ${getTierColor(progress.next)} mb-2`}>{progress.next}</p>
                <div className="w-full bg-chaos-darker rounded-full h-2 mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-chaos-purple to-chaos-cyan rounded-full transition-all"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{progress.pointsNeeded} points to go</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-yellow-400 mb-2">Max Tier!</p>
                <p className="text-sm text-gray-400">You've reached the highest tier</p>
              </>
            )}
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6 mb-8">
          <h3 className="font-neon text-xl font-bold mb-4">Your {account.tier} Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-chaos-darker rounded-lg p-4">
              <Zap className="w-6 h-6 text-chaos-cyan" />
              <div>
                <p className="font-bold text-chaos-cyan">{benefits.pointsMultiplier}x</p>
                <p className="text-xs text-gray-400">Points Multiplier</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-chaos-darker rounded-lg p-4">
              <Tag className="w-6 h-6 text-chaos-purple" />
              <div>
                <p className="font-bold text-chaos-purple">{benefits.exclusiveDiscounts}%</p>
                <p className="text-xs text-gray-400">Extra Discount</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-chaos-darker rounded-lg p-4">
              <Truck className="w-6 h-6 text-chaos-red" />
              <div>
                <p className="font-bold text-chaos-red">
                  {benefits.freeShippingThreshold === 0 ? 'Always' : `$${benefits.freeShippingThreshold}+`}
                </p>
                <p className="text-xs text-gray-400">Free Shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-chaos-darker rounded-lg p-4">
              <Crown className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="font-bold text-yellow-400">{benefits.earlyAccess ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-400">Early Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-neon transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-chaos-red text-chaos-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            How to Earn
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 px-4 font-neon transition-colors ${
              activeTab === 'rewards'
                ? 'border-b-2 border-chaos-red text-chaos-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Redeem Rewards
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-neon transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-chaos-red text-chaos-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Points History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
              <div className="w-12 h-12 bg-chaos-purple/20 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-chaos-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">Make Purchases</h3>
              <p className="text-gray-400 text-sm mb-3">Earn 10 points for every $1 spent</p>
              <p className="text-chaos-purple font-bold">Up to {benefits.pointsMultiplier}x with your tier!</p>
            </div>

            <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
              <div className="w-12 h-12 bg-chaos-red/20 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-chaos-red" />
              </div>
              <h3 className="font-bold text-lg mb-2">Write Reviews</h3>
              <p className="text-gray-400 text-sm mb-3">Earn 50 points per review, 100 with photo</p>
              <p className="text-chaos-red font-bold">Help others shop smarter!</p>
            </div>

            <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
              <div className="w-12 h-12 bg-chaos-cyan/20 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-chaos-cyan" />
              </div>
              <h3 className="font-bold text-lg mb-2">Refer Friends</h3>
              <p className="text-gray-400 text-sm mb-3">Earn 500 points per successful referral</p>
              <p className="text-chaos-cyan font-bold">Share the chaos!</p>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_REWARDS.map((reward) => {
              const canRedeem = account.points >= reward.pointsCost;
              const tierMismatch = reward.tier && account.tier !== reward.tier && account.tier !== 'Gold';
              
              return (
                <div 
                  key={reward.id}
                  className={`bg-chaos-dark border rounded-lg p-6 ${
                    canRedeem && !tierMismatch
                      ? 'border-chaos-purple/50'
                      : 'border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
                      {reward.tier && (
                        <span className={`text-xs font-bold ${getTierColor(reward.tier)}`}>
                          {reward.tier} Tier Required
                        </span>
                      )}
                    </div>
                    <Gift className="w-8 h-8 text-chaos-purple" />
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-chaos-cyan">{reward.pointsCost} pts</span>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem || tierMismatch}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        canRedeem && !tierMismatch
                          ? 'bg-gradient-to-r from-chaos-red to-chaos-purple hover:scale-105'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {tierMismatch ? 'Tier Required' : canRedeem ? 'Redeem' : 'Not Enough Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
            <h3 className="font-neon font-bold text-xl mb-6">Points History</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div 
                    key={txn.id}
                    className="flex items-center justify-between p-4 bg-chaos-darker rounded-lg border border-gray-800"
                  >
                    <div>
                      <p className="font-bold">{txn.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-bold text-lg ${
                      txn.type === 'earn' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {txn.type === 'earn' ? '+' : ''}{txn.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
