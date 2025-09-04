import { supabase } from './supabase'

export interface ReferralCode {
  id: string
  code: string
  userId: string
  discountPercentage: number
  maxUses: number
  currentUses: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

export interface ReferralReward {
  id: string
  referrerId: string
  refereeId: string
  orderId: string
  rewardAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export class ReferralService {
  private static instance: ReferralService

  private constructor() {}

  public static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService()
    }
    return ReferralService.instance
  }

  // Generate a unique referral code
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Create a new referral code for a user
  async createReferralCode(
    userId: string, 
    discountPercentage: number = 10, 
    maxUses: number = 100
  ): Promise<ReferralCode | null> {
    try {
      let code = this.generateReferralCode()
      let attempts = 0
      
      // Ensure the code is unique
      while (attempts < 10) {
        const { data: existing } = await supabase
          .from('referral_codes')
          .select('id')
          .eq('code', code)
          .single()
        
        if (!existing) break
        
        code = this.generateReferralCode()
        attempts++
      }

      const newReferralCode: Omit<ReferralCode, 'id'> = {
        code,
        userId,
        discountPercentage,
        maxUses,
        currentUses: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('referral_codes')
        .insert([newReferralCode])
        .select()
        .single()

      if (error) {
        console.error('Error creating referral code:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in createReferralCode:', error)
      return null
    }
  }

  // Get user's referral codes
  async getUserReferralCodes(userId: string): Promise<ReferralCode[]> {
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('userId', userId)
        .eq('isActive', true)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('Error fetching user referral codes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserReferralCodes:', error)
      return []
    }
  }

  // Validate a referral code
  async validateReferralCode(code: string): Promise<ReferralCode | null> {
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code)
        .eq('isActive', true)
        .single()

      if (error || !data) {
        return null
      }

      // Check if code has reached max uses
      if (data.currentUses >= data.maxUses) {
        return null
      }

      // Check if code has expired
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        return null
      }

      return data
    } catch (error) {
      console.error('Error in validateReferralCode:', error)
      return null
    }
  }

  // Apply referral code and calculate discount
  async applyReferralCode(code: string, orderAmount: number): Promise<{
    isValid: boolean
    discountAmount: number
    referralCode?: ReferralCode
  }> {
    try {
      const referralCode = await this.validateReferralCode(code)
      
      if (!referralCode) {
        return { isValid: false, discountAmount: 0 }
      }

      const discountAmount = Math.floor((orderAmount * referralCode.discountPercentage) / 100)
      
      return {
        isValid: true,
        discountAmount,
        referralCode
      }
    } catch (error) {
      console.error('Error in applyReferralCode:', error)
      return { isValid: false, discountAmount: 0 }
    }
  }

  // Record referral usage when order is placed
  async recordReferralUsage(
    code: string, 
    refereeId: string, 
    orderId: string, 
    orderAmount: number
  ): Promise<boolean> {
    try {
      const referralCode = await this.validateReferralCode(code)
      
      if (!referralCode) {
        return false
      }

      // Update referral code usage count
      const { error: updateError } = await supabase
        .from('referral_codes')
        .update({ 
          currentUses: referralCode.currentUses + 1 
        })
        .eq('id', referralCode.id)

      if (updateError) {
        console.error('Error updating referral code usage:', updateError)
        return false
      }

      // Create referral reward record
      const rewardAmount = Math.floor((orderAmount * referralCode.discountPercentage) / 100)
      
      const newReward: Omit<ReferralReward, 'id'> = {
        referrerId: referralCode.userId,
        refereeId,
        orderId,
        rewardAmount,
        status: 'completed',
        createdAt: new Date().toISOString(),
      }

      const { error: rewardError } = await supabase
        .from('referral_rewards')
        .insert([newReward])

      if (rewardError) {
        console.error('Error creating referral reward:', rewardError)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in recordReferralUsage:', error)
      return false
    }
  }

  // Get referral statistics for a user
  async getReferralStats(userId: string): Promise<{
    totalReferrals: number
    totalEarnings: number
    activeReferralCodes: number
  }> {
    try {
      // Get total referrals and earnings
      const { data: rewards, error: rewardsError } = await supabase
        .from('referral_rewards')
        .select('rewardAmount')
        .eq('referrerId', userId)
        .eq('status', 'completed')

      if (rewardsError) {
        console.error('Error fetching referral rewards:', rewardsError)
        return { totalReferrals: 0, totalEarnings: 0, activeReferralCodes: 0 }
      }

      // Get active referral codes count
      const { data: codes, error: codesError } = await supabase
        .from('referral_codes')
        .select('id')
        .eq('userId', userId)
        .eq('isActive', true)

      if (codesError) {
        console.error('Error fetching referral codes:', codesError)
        return { totalReferrals: 0, totalEarnings: 0, activeReferralCodes: 0 }
      }

      const totalReferrals = rewards?.length || 0
      const totalEarnings = rewards?.reduce((sum, reward) => sum + reward.rewardAmount, 0) || 0
      const activeReferralCodes = codes?.length || 0

      return {
        totalReferrals,
        totalEarnings,
        activeReferralCodes
      }
    } catch (error) {
      console.error('Error in getReferralStats:', error)
      return { totalReferrals: 0, totalEarnings: 0, activeReferralCodes: 0 }
    }
  }

  // Get referral history for a user
  async getReferralHistory(userId: string): Promise<ReferralReward[]> {
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('referrerId', userId)
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('Error fetching referral history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getReferralHistory:', error)
      return []
    }
  }
}

export const referralService = ReferralService.getInstance()
