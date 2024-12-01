import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';
import papyrusIdl from '../idl/papyrus.json';
import { REVIEW_SEED } from './constants';

export interface ReviewAccount {
  pubkey: string;
  publication: string;
  reviewer: string;
  technicalScore: number;
  innovationScore: number;
  presentationScore: number;
  overallScore: number;
  commentsUri: string;
  timestamp: number;
}

export const getReviews = async (
  wallet: AnchorWallet,
  connection: Connection,
  publicationKey: string
): Promise<ReviewAccount[]> => {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    const program = new anchor.Program(
      papyrusIdl,
      provider
    );

    // 获取所有与该 publication 相关的 review 账户
    const reviews = await program.account.review.all([
      {
        memcmp: {
          offset: 8, // 跳过 discriminator
          bytes: publicationKey, // 按 publication 地址过滤
        },
      },
    ]);

    // 转换为前端友好的格式
    return reviews.map(review => ({
      pubkey: review.publicKey.toString(),
      publication: review.account.publication.toString(),
      reviewer: review.account.reviewer.toString(),
      technicalScore: review.account.technicalScore / 10, // 转换为小数
      innovationScore: review.account.innovationScore / 10,
      presentationScore: review.account.presentationScore / 10,
      overallScore: review.account.overallScore / 10,
      commentsUri: review.account.commentsUri,
      timestamp: review.account.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// 辅助函数：计算平均分
export const calculateAverageScores = (reviews: ReviewAccount[]) => {
  if (reviews.length === 0) return null;

  const sum = reviews.reduce((acc, review) => ({
    technical: acc.technical + review.technicalScore,
    innovation: acc.innovation + review.innovationScore,
    presentation: acc.presentation + review.presentationScore,
    overall: acc.overall + review.overallScore,
  }), {
    technical: 0,
    innovation: 0,
    presentation: 0,
    overall: 0,
  });

  const count = reviews.length;
  return {
    technicalScore: sum.technical / count,
    innovationScore: sum.innovation / count,
    presentationScore: sum.presentation / count,
    overallScore: sum.overall / count,
    reviewCount: count,
  };
};

// 使用示例：
/*
const reviews = await getReviews(wallet, connection, publicationKey);
const averageScores = calculateAverageScores(reviews);

console.log('Reviews:', reviews);
console.log('Average Scores:', averageScores);
*/