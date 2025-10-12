export function throwInvalidStrategyError(strategyName, availableStrategies) {
    const errorMessage = `Strategy "${strategyName}" doesn't exist. Available strategies: ${availableStrategies}`;

    console.error(errorMessage);

    throw new Error('Unavailable strategy')
}