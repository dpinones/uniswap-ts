import { BigNumber, BigNumberish, ContractTransaction, Wallet } from 'ethers'

import {
    encodePriceSqrt,
    expandTo18Decimals,
    FeeAmount,
    getMaxLiquidityPerTick,
    getMaxTick,
    getMinTick,
    MAX_SQRT_RATIO,
    MIN_SQRT_RATIO,
    TICK_SPACINGS,
  } from './shared/utilities'

interface BaseSwapTestCase {
    zeroForOne: boolean
    sqrtPriceLimit?: BigNumber
}
interface SwapExact0For1TestCase extends BaseSwapTestCase {
    zeroForOne: true
    exactOut: false
    amount0: BigNumberish
    sqrtPriceLimit?: BigNumber
}
interface SwapExact1For0TestCase extends BaseSwapTestCase {
    zeroForOne: false
    exactOut: false
    amount1: BigNumberish
    sqrtPriceLimit?: BigNumber
}
interface Swap0ForExact1TestCase extends BaseSwapTestCase {
    zeroForOne: true
    exactOut: true
    amount1: BigNumberish
    sqrtPriceLimit?: BigNumber
}
interface Swap1ForExact0TestCase extends BaseSwapTestCase {
    zeroForOne: false
    exactOut: true
    amount0: BigNumberish
    sqrtPriceLimit?: BigNumber
}
interface SwapToHigherPrice extends BaseSwapTestCase {
    zeroForOne: false
    sqrtPriceLimit: BigNumber
}
interface SwapToLowerPrice extends BaseSwapTestCase {
    zeroForOne: true
    sqrtPriceLimit: BigNumber
}
type SwapTestCase =
  | SwapExact0For1TestCase
  | Swap0ForExact1TestCase
  | SwapExact1For0TestCase
  | Swap1ForExact0TestCase
  | SwapToHigherPrice
  | SwapToLowerPrice


interface Position {
    tickLower: number
    tickUpper: number
    liquidity: BigNumberish
  }

interface PoolTestCase {
    description: string
    feeAmount: number
    tickSpacing: number
    startingPrice: BigNumber
    positions: Position[]
    swapTests?: SwapTestCase[]
  }

export const TEST_POOLS: PoolTestCase[] = [
    {
      description: 'low fee, 1:1 price, 2e18 max range liquidity',
      feeAmount: FeeAmount.LOW,
      tickSpacing: TICK_SPACINGS[FeeAmount.LOW],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.LOW]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.LOW]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, 1:1 price, 2e18 max range liquidity',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'high fee, 1:1 price, 2e18 max range liquidity',
      feeAmount: FeeAmount.HIGH,
      tickSpacing: TICK_SPACINGS[FeeAmount.HIGH],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.HIGH]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.HIGH]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, 10:1 price, 2e18 max range liquidity',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(10, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, 1:10 price, 2e18 max range liquidity',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 10),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, 1:1 price, 0 liquidity, all liquidity around current price',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: -TICK_SPACINGS[FeeAmount.MEDIUM],
          liquidity: expandTo18Decimals(2),
        },
        {
          tickLower: TICK_SPACINGS[FeeAmount.MEDIUM],
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, 1:1 price, additional liquidity around current price',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: -TICK_SPACINGS[FeeAmount.MEDIUM],
          liquidity: expandTo18Decimals(2),
        },
        {
          tickLower: TICK_SPACINGS[FeeAmount.MEDIUM],
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'low fee, large liquidity around current price (stable swap)',
      feeAmount: FeeAmount.LOW,
      tickSpacing: TICK_SPACINGS[FeeAmount.LOW],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: -TICK_SPACINGS[FeeAmount.LOW],
          tickUpper: TICK_SPACINGS[FeeAmount.LOW],
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, token0 liquidity only',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: 0,
          tickUpper: 2000 * TICK_SPACINGS[FeeAmount.MEDIUM],
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'medium fee, token1 liquidity only',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: -2000 * TICK_SPACINGS[FeeAmount.MEDIUM],
          tickUpper: 0,
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'close to max price',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(BigNumber.from(2).pow(127), 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'close to min price',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, BigNumber.from(2).pow(127)),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'max full range liquidity at 1:1 price with default fee',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: encodePriceSqrt(1, 1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: getMaxLiquidityPerTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        },
      ],
    },
    {
      description: 'initialized at the max ratio',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: MAX_SQRT_RATIO.sub(1),
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
    {
      description: 'initialized at the min ratio',
      feeAmount: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      startingPrice: MIN_SQRT_RATIO,
      positions: [
        {
          tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
          liquidity: expandTo18Decimals(2),
        },
      ],
    },
  ]

export const SWAP_CASES: SwapTestCase[] = [
    // swap large amounts in/out
    {
      zeroForOne: true,
      exactOut: false,
      amount0: expandTo18Decimals(1),
    },
    {
      zeroForOne: false,
      exactOut: false,
      amount1: expandTo18Decimals(1),
    },
    {
      zeroForOne: true,
      exactOut: true,
      amount1: expandTo18Decimals(1),
    },
    {
      zeroForOne: false,
      exactOut: true,
      amount0: expandTo18Decimals(1),
    },
    // swap large amounts in/out with a price limit
    {
      zeroForOne: true,
      exactOut: false,
      amount0: expandTo18Decimals(1),
      sqrtPriceLimit: encodePriceSqrt(50, 100),
    },
    {
      zeroForOne: false,
      exactOut: false,
      amount1: expandTo18Decimals(1),
      sqrtPriceLimit: encodePriceSqrt(200, 100),
    },
    {
      zeroForOne: true,
      exactOut: true,
      amount1: expandTo18Decimals(1),
      sqrtPriceLimit: encodePriceSqrt(50, 100),
    },
    {
      zeroForOne: false,
      exactOut: true,
      amount0: expandTo18Decimals(1),
      sqrtPriceLimit: encodePriceSqrt(200, 100),
    },
    // swap small amounts in/out
    {
      zeroForOne: true,
      exactOut: false,
      amount0: 1000,
    },
    {
      zeroForOne: false,
      exactOut: false,
      amount1: 1000,
    },
    {
      zeroForOne: true,
      exactOut: true,
      amount1: 1000,
    },
    {
      zeroForOne: false,
      exactOut: true,
      amount0: 1000,
    },
    // swap arbitrary input to price
    {
      sqrtPriceLimit: encodePriceSqrt(5, 2),
      zeroForOne: false,
    },
    {
      sqrtPriceLimit: encodePriceSqrt(2, 5),
      zeroForOne: true,
    },
    {
      sqrtPriceLimit: encodePriceSqrt(5, 2),
      zeroForOne: true,
    },
    {
      sqrtPriceLimit: encodePriceSqrt(2, 5),
      zeroForOne: false,
    },
  ]