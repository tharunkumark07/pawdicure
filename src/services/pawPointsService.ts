export interface PawPointTransaction {
  transactionId: string;
  userId: string;
  type: 'EARN' | 'SPEND';
  source: string;
  sourceRecordId: string;
  points: number;
  balanceAfter: number;
  description: string;
  createdAt: number;
}

export const pawPointsService = {
  async awardPoints(
    userId: string,
    activityType: string,
    sourceRecordId: string,
    description?: string
  ): Promise<{ success: boolean; pointsAwarded: number; balance: number; error?: string }> {
    try {
      const response = await fetch('/api/award-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, activityType, sourceRecordId, description }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to award points');
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error awarding PAW Points:', err);
      return { success: false, pointsAwarded: 0, balance: 0, error: err.message };
    }
  },

  async redeemReward(
    userId: string,
    rewardId: string,
    title: string,
    pointsSpent: number
  ): Promise<{ success: boolean; code?: string; balance?: number; error?: string }> {
    try {
      const response = await fetch('/api/redeem-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rewardId, title, pointsSpent }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to redeem reward');
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error redeeming reward via backend:', err);
      return { success: false, error: err.message };
    }
  },

  async getTransactions(userId: string): Promise<PawPointTransaction[]> {
    try {
      const response = await fetch(`/api/paw-points/transactions?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      return data.transactions || [];
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return [];
    }
  }
};
