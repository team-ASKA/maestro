interface CharacterData {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  strength: number;
  discipline: number;
  growth: number;
  totalWealth: number;
  dailyStreak: number;
}

interface TransactionData {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
}

export class GamificationEngine {
  // XP calculation constants
  private static readonly BASE_XP_PER_LEVEL = 1000;
  private static readonly XP_MULTIPLIER = 1.2;
  private static readonly DAILY_BASE_XP = 25;
  private static readonly STREAK_BONUS_MULTIPLIER = 1.1;

  // Calculate XP required for next level
  calculateNextLevelXP(level: number): number {
    return Math.floor(
      GamificationEngine.BASE_XP_PER_LEVEL * 
      Math.pow(GamificationEngine.XP_MULTIPLIER, level - 1)
    );
  }

  // Calculate daily XP based on streak
  calculateDailyXP(streak: number): number {
    const baseXP = GamificationEngine.DAILY_BASE_XP;
    const streakBonus = Math.floor(streak * (GamificationEngine.STREAK_BONUS_MULTIPLIER - 1) * 10);
    return baseXP + streakBonus;
  }

  // Add XP and handle level ups
  addXP(characterData: CharacterData, xpAmount: number): CharacterData {
    let newXP = characterData.currentXP + xpAmount;
    let newLevel = characterData.level;
    let nextLevelXP = characterData.nextLevelXP;

    // Check for level up
    while (newXP >= nextLevelXP) {
      newXP -= nextLevelXP;
      newLevel++;
      nextLevelXP = this.calculateNextLevelXP(newLevel);
    }

    return {
      ...characterData,
      currentXP: newXP,
      level: newLevel,
      nextLevelXP: nextLevelXP,
    };
  }

  // Calculate Financial Strength from net worth and transactions
  calculateStrength(netWorth: number, transactions: TransactionData[]): number {
    const baseStrength = Math.min(netWorth / 1000, 90); // Max 90 from net worth
    
    // Bonus for consistent saving behavior
    const recentSavings = transactions
      .filter(t => t.type === 'income' || (t.type === 'expense' && t.category === 'savings'))
      .slice(-30) // Last 30 transactions
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    
    const savingsBonus = Math.min(recentSavings / 500, 10);
    
    return Math.min(Math.floor(baseStrength + savingsBonus), 100);
  }

  // Calculate Discipline from logging consistency
  calculateDiscipline(dailyStreak: number, totalLogDays: number, accountAgeDays: number): number {
    const streakScore = Math.min(dailyStreak * 2, 60); // Max 60 from streak
    const consistencyScore = Math.min((totalLogDays / accountAgeDays) * 40, 40); // Max 40 from consistency
    
    return Math.min(Math.floor(streakScore + consistencyScore), 100);
  }

  // Calculate Growth from investment performance
  calculateGrowth(investmentValue: number, investmentGrowth: number, monthsInvested: number): number {
    const valueScore = Math.min(investmentValue / 500, 30); // Max 30 from value
    const growthScore = Math.min(investmentGrowth * 100, 50); // Max 50 from growth rate
    const timeScore = Math.min(monthsInvested * 2, 20); // Max 20 from time invested
    
    return Math.min(Math.floor(valueScore + growthScore + timeScore), 100);
  }

  // Calculate quest progress
  calculateQuestProgress(currentAmount: number, targetAmount: number): number {
    return Math.min(Math.floor((currentAmount / targetAmount) * 100), 100);
  }

  // Award XP for different actions
  awardActionXP(action: string, value?: number): number {
    switch (action) {
      case 'daily_checkin':
        return 25;
      case 'expense_logged':
        return 10;
      case 'goal_set':
        return 50;
      case 'goal_achieved':
        return 200;
      case 'investment_made':
        return Math.min((value || 0) / 10, 100);
      case 'debt_payment':
        return Math.min((value || 0) / 20, 75);
      case 'financial_lesson':
        return 30;
      case 'streak_milestone':
        return (value || 0) * 10; // 10 XP per day milestone
      default:
        return 0;
    }
  }

  // Generate achievement based on character progress
  checkAchievements(characterData: CharacterData, transactions: TransactionData[]): string[] {
    const achievements: string[] = [];

    // Level-based achievements
    if (characterData.level >= 10) achievements.push('🎖️ Veteran Warrior');
    if (characterData.level >= 20) achievements.push('👑 Financial Master');

    // Streak-based achievements
    if (characterData.dailyStreak >= 7) achievements.push('🔥 Week Warrior');
    if (characterData.dailyStreak >= 30) achievements.push('📅 Monthly Master');
    if (characterData.dailyStreak >= 100) achievements.push('⚡ Legendary Streak');

    // Attribute-based achievements
    if (characterData.strength >= 90) achievements.push('💪 Financial Titan');
    if (characterData.discipline >= 90) achievements.push('🛡️ Iron Discipline');
    if (characterData.growth >= 90) achievements.push('📈 Growth Master');

    // Wealth-based achievements
    if (characterData.totalWealth >= 10000) achievements.push('💰 Wealth Builder');
    if (characterData.totalWealth >= 100000) achievements.push('💎 Wealth Baron');

    return achievements;
  }

  // Calculate boss battle progress (e.g., debt payoff, budget adherence)
  calculateBossProgress(bossType: string, userData: any): number {
    switch (bossType) {
      case 'debt_slayer':
        const totalDebt = userData.totalDebt || 0;
        const paidDebt = userData.paidDebt || 0;
        return totalDebt > 0 ? Math.floor((paidDebt / totalDebt) * 100) : 100;
      
      case 'budget_keeper':
        const budgetAdherence = userData.budgetAdherence || 0;
        return Math.floor(budgetAdherence * 100);
      
      case 'impulse_controller':
        const impulseSpending = userData.impulseSpending || 0;
        const budgetedSpending = userData.budgetedSpending || 1;
        return Math.max(0, 100 - Math.floor((impulseSpending / budgetedSpending) * 100));
      
      default:
        return 0;
    }
  }
}

export const gamificationEngine = new GamificationEngine();