import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { 
  generateReferralCode, 
  getReferralStats, 
  getMilestoneProgress,
  getReferrals
} from "@/lib/referrals";
import { Referral } from "@/types/referrals";
import { 
  Users, 
  Copy, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Award, 
  ArrowLeft,
  Gift,
  Share2
} from "lucide-react";

const Referrals = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({
    code: '',
    totalClicks: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    conversionRate: 0,
    totalRevenue: 0,
    totalPointsEarned: 0
  });
  const [milestones, setMilestones] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      const code = generateReferralCode(user.id);
      setReferralCode(code.code);
      setStats(getReferralStats(user.id));
      setMilestones(getMilestoneProgress(user.id));
      setReferrals(getReferrals(user.id));
    }
  }, [user]);

  const handleCopyCode = async () => {
    const referralUrl = `${window.location.origin}?ref=${referralCode}`;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">Sign In to Access Referrals</h1>
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

        <h1 className="font-chaos text-4xl neon-text-red mb-8">REFERRAL PROGRAM</h1>

        {/* Referral Code */}
        <div className="bg-gradient-to-br from-chaos-purple/20 to-chaos-red/20 border-2 border-chaos-purple/50 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-8 h-8 text-chaos-cyan" />
            <h2 className="font-neon text-2xl font-bold">Your Referral Code</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 bg-chaos-darker border-2 border-chaos-cyan rounded-lg p-6 font-mono text-3xl font-bold text-chaos-cyan text-center">
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-chaos-cyan hover:bg-chaos-purple text-chaos-darker hover:text-white font-bold p-6 rounded-lg transition-all"
            >
              {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>

          <p className="text-center text-gray-300 mb-2">
            Share your code and earn <span className="text-chaos-cyan font-bold">500 points</span> for each successful referral!
          </p>
          <p className="text-center text-sm text-gray-400">
            Your link: {window.location.origin}?ref={referralCode}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-chaos-purple" />
              <h3 className="font-neon font-bold text-sm">Total Clicks</h3>
            </div>
            <p className="text-4xl font-bold neon-text-purple">{stats.totalClicks}</p>
          </div>

          <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-chaos-cyan" />
              <h3 className="font-neon font-bold text-sm">Completed</h3>
            </div>
            <p className="text-4xl font-bold neon-text-cyan">{stats.completedReferrals}</p>
          </div>

          <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-chaos-red" />
              <h3 className="font-neon font-bold text-sm">Conversion</h3>
            </div>
            <p className="text-4xl font-bold neon-text-red">{stats.conversionRate.toFixed(1)}%</p>
          </div>

          <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-6 h-6 text-yellow-400" />
              <h3 className="font-neon font-bold text-sm">Points Earned</h3>
            </div>
            <p className="text-4xl font-bold text-yellow-400">{stats.totalPointsEarned}</p>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8 mb-8">
          <h3 className="font-neon text-xl font-bold mb-6">Milestone Rewards</h3>
          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div 
                key={idx}
                className={`border-2 rounded-lg p-6 ${
                  milestone.unlocked
                    ? 'border-chaos-cyan bg-chaos-cyan/10'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {milestone.count} Successful Referrals
                    </h4>
                    <p className="text-sm text-gray-400">{milestone.reward}</p>
                  </div>
                  {milestone.unlocked && (
                    <div className="bg-chaos-cyan text-chaos-darker px-3 py-1 rounded-full text-xs font-bold">
                      UNLOCKED
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-chaos-cyan font-bold">+{milestone.pointsBonus} points</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-chaos-darker rounded-full h-2">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          milestone.unlocked ? 'bg-chaos-cyan' : 'bg-gray-700'
                        }`}
                        style={{ width: milestone.unlocked ? '100%' : `${(stats.completedReferrals / milestone.count) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {stats.completedReferrals}/{milestone.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-8">
          <h3 className="font-neon text-xl font-bold mb-6">Referral History</h3>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No referrals yet</p>
              <p className="text-sm text-gray-500 mt-2">Share your code to start earning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div 
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-chaos-darker rounded-lg border border-gray-800"
                >
                  <div>
                    <p className="font-bold">
                      {referral.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-chaos-cyan">
                      {referral.status === 'completed' ? '+500 pts' : 'Awaiting purchase'}
                    </p>
                    {referral.purchaseValue && (
                      <p className="text-xs text-gray-400">
                        ${referral.purchaseValue.toFixed(2)} spent
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referrals;
