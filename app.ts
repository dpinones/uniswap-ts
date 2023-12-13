import {
    SimulationDataManager,
    SimulatorClient,
    SQLiteSimulationDataManager,
    PoolConfig,
    FeeAmount,
    ConfigurableCorePool,
    CorePoolView
} from "@bella-defintech/uniswap-v3-simulator";
import JSBI from "jsbi";

import { TEST_POOLS, SWAP_CASES } from './pool_cases';

async function main() {
    try {
        const pool_number = 3;
        const swap_number = 2;

        const pool_case = TEST_POOLS[pool_number];
        const swap_case = SWAP_CASES[swap_number];

        let simulationDataManager: SimulationDataManager =
        await SQLiteSimulationDataManager.buildInstance(
            "internal.data"
        );

        let clientInstance: SimulatorClient = new SimulatorClient(
            simulationDataManager
        );

        // init Pool
        let configurableCorePool: ConfigurableCorePool =
        clientInstance.initCorePoolFromConfig(
            new PoolConfig(pool_case.tickSpacing, "USDC", "ETH", pool_case.feeAmount)
        );
        let sqrtPriceX96ForInitialization = JSBI.BigInt(pool_case.startingPrice.toString());
        await configurableCorePool.initialize(sqrtPriceX96ForInitialization);
        let corePoolView: CorePoolView = configurableCorePool.getCorePool();

        // mint positions
        for (const mint_position of pool_case.positions) {
            let amount0: JSBI, amount1: JSBI;
            ({ amount0, amount1 } = await configurableCorePool.mint(
                "testUser",
                mint_position.tickLower,
                mint_position.tickUpper,
                JSBI.BigInt(mint_position.liquidity.toString())
            ));
        }

        const view_before = { ...corePoolView }

        //execute Swap case
        //WIP make correct swap
        let amount0: JSBI, amount1: JSBI;
        ({ amount0, amount1 } = await configurableCorePool.swap(
            swap_case.zeroForOne,
            JSBI.BigInt("20000000000000000") //To-Do use amount0 or amount1
            // JSBI.BigInt(swap_case.amountX.toString()) //To-Do use amount0 or amount1
                //To-Do implement amountout=True, i think swap(-x) is not implemented :(
        ));


        console.log("amounts 0 & 1: ", amount0.toString(), amount1.toString());

        print_values(view_before, corePoolView);

        await clientInstance.shutdown();
    } catch (error) {
        console.error("Error: ", error);
    }
}

main();

function print_values(view_before: any, view_after: any): void {
    console.log("view before: ", view_before);
    console.log("view after: ", view_after);
    console.log("\n\n");
    console.log("liquidity: ", view_after.liquidity.toString());
    console.log('amount_0_delta: ', );
    console.log('amount_1_delta: ', );
    console.log('execution_price: ', ); // get_significant_figures(actual.execution_price, 10).print();
    console.log('fee_growth_global_0_X128_delta: ', parseFloat(view_after._feeGrowthGlobal0X128.toString()) - parseFloat(view_before._feeGrowthGlobal0X128.toString())); //not printing the right values
    console.log('fee_growth_global_1_X128_delta: ', parseFloat(view_after._feeGrowthGlobal1X128.toString()) - parseFloat(view_before._feeGrowthGlobal1X128.toString())); //not printing the right values
    console.log('pool_price_before: ', view_before._sqrtPriceX96.toString());
    console.log('pool_price_after: ', view_after._sqrtPriceX96.toString()); //get_significant_figures(actual.pool_price_after, pool_price_sig_figures).print();
    console.log('tick_before: ', view_before._tickCurrent);
    console.log('tick_after: ', view_after._tickCurrent);
    console.log('\n');
}



