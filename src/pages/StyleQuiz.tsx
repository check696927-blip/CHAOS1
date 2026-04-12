import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, Sparkles, Tag } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { QUIZ_QUESTIONS, QuizAnswer } from "@/types/quiz";
import { saveStyleProfile, getRecommendedProducts } from "@/lib/quiz";
import { PRODUCTS } from "@/constants/products";

const StyleQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string) => {
    if (question.type === 'single') {
      setSelectedOptions([value]);
    } else {
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter(v => v !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    }
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) return;

    const answer: QuizAnswer = {
      question: question.question,
      answer: question.type === 'single' ? selectedOptions[0] : selectedOptions
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
    } else {
      // Quiz completed
      if (user) {
        const savedProfile = saveStyleProfile(user.id, newAnswers);
        setProfile(savedProfile);
      }
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousAnswer = answers[currentQuestion - 1];
      setSelectedOptions(Array.isArray(previousAnswer.answer) ? previousAnswer.answer : [previousAnswer.answer]);
      setAnswers(answers.slice(0, -1));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <Sparkles className="w-16 h-16 text-chaos-purple mx-auto" />
          <h2 className="font-chaos text-3xl neon-text-red">Sign in to take the Style Quiz</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Create an account to unlock personalized product recommendations and exclusive discount codes!
          </p>
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

  if (completed && profile) {
    const recommendations = getRecommendedProducts(profile, 12);

    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Success Header */}
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-chaos-cyan to-chaos-purple rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10" />
              </div>
              <h1 className="font-chaos text-5xl neon-text-cyan">Style Profile Complete!</h1>
              <p className="text-gray-300 text-lg">
                Your personalized recommendations are ready
              </p>
            </div>

            {/* Discount Code */}
            <div className="bg-gradient-to-r from-chaos-purple/20 to-chaos-red/20 border-2 border-chaos-purple rounded-lg p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Tag className="w-6 h-6 text-chaos-cyan" />
                <h3 className="font-neon text-xl font-bold">Exclusive Quiz Discount</h3>
              </div>
              <div className="bg-chaos-dark border-2 border-chaos-cyan rounded-lg p-6 mb-4">
                <code className="font-mono text-3xl neon-text-cyan tracking-wider">
                  {profile.discountCode}
                </code>
              </div>
              <p className="text-chaos-purple font-bold">15% OFF your next purchase!</p>
              <p className="text-sm text-gray-400 mt-2">Valid for 30 days</p>
            </div>

            {/* Recommendations */}
            <div className="space-y-6">
              <h2 className="font-chaos text-3xl neon-text-red">Your Perfect Matches</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(match => {
                  const product = PRODUCTS.find(p => p.id === match.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-chaos-dark border border-chaos-purple/30 rounded-lg overflow-hidden hover:border-chaos-purple cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-chaos-cyan text-chaos-darker font-bold text-sm px-3 py-1 rounded-full">
                          {match.matchPercentage}% Match
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-neon font-bold text-sm line-clamp-2">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 line-through text-sm">${product.price}</span>
                          <span className="font-bold text-xl neon-text-purple">
                            ${(product.price * 0.8).toFixed(0)}
                          </span>
                        </div>
                        {match.matchReasons.length > 0 && (
                          <p className="text-xs text-chaos-cyan">
                            {match.matchReasons[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-4 px-12 rounded-lg hover:scale-105 transition-all font-neon tracking-wider text-lg"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-chaos-purple mx-auto mb-4" />
            <h1 className="font-chaos text-4xl neon-text-red mb-4">Find Your Perfect Style</h1>
            <p className="text-gray-400">
              Answer 5 quick questions to get personalized recommendations and an exclusive discount code
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-neon text-gray-400">
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-sm font-bold text-chaos-purple">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-chaos-dark rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-chaos-red to-chaos-purple transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-chaos-dark border-2 border-chaos-purple/30 rounded-lg p-8 space-y-6">
            <h2 className="font-neon text-2xl font-bold text-center">{question.question}</h2>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
              {question.options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOptions.includes(option.value)
                      ? 'border-chaos-cyan bg-chaos-cyan/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selectedOptions.includes(option.value)
                        ? 'border-chaos-cyan bg-chaos-cyan'
                        : 'border-gray-500'
                    }`}>
                      {selectedOptions.includes(option.value) && (
                        <Check className="w-3 h-3 text-chaos-darker" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold mb-1">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              {currentQuestion > 0 ? (
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white transition-colors font-neon"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={handleNext}
                disabled={selectedOptions.length === 0}
                className="bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Get Results' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleQuiz;
