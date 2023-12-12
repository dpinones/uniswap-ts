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

async function main() {
    try {
        let simulationDataManager: SimulationDataManager =
        await SQLiteSimulationDataManager.buildInstance(
            "Your file path to save the internal data"
        );

        let clientInstance: SimulatorClient = new SimulatorClient(
            simulationDataManager
        );

        // Pool 0
        let configurableCorePool: ConfigurableCorePool =
        clientInstance.initCorePoolFromConfig(
            new PoolConfig(500, "USDC", "ETH", FeeAmount.LOW) 
        );

        let sqrtPriceX96ForInitialization = JSBI.BigInt("79228162514264337593543950336");
        await configurableCorePool.initialize(sqrtPriceX96ForInitialization);

        let corePoolView: CorePoolView = configurableCorePool.getCorePool();

        console.log('tick current: ', corePoolView.tickCurrent);

        console.log("before liquidity", corePoolView.liquidity.toString());

        let amount0: JSBI, amount1: JSBI;
        ({ amount0, amount1 } = await configurableCorePool.mint(
            "testUser",
            -887270,
            887270,
            JSBI.BigInt("2000000000000000000")
        ));

        console.log("after liquidity", corePoolView.liquidity.toString());

        await clientInstance.shutdown();
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
