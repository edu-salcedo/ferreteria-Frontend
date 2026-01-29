// src/utils/priceCalculations.js

/**
 * Calcula el multiplicador de ganancia basado en el costo
 */
export const getMarginByCost = (cost) => {
    if (cost < 100) return 3.0;    // 100%
    if (cost < 500) return 2.0;
    if (cost < 1000) return 1.6;    // 60%
    if (cost < 10000) return 1.5;
    if (cost < 20000) return 1.3;   // 40%
    return 1.25;                    // 25%
};

/**
 * Retorna el precio final formateado
 */
export const calculateFinalPrice = (cost) => {
    console.log("Calculating final price for cost:", cost);

    const margin = getMarginByCost(cost);
    console.log("margin", margin);
    return Math.ceil((cost * margin) / 100) * 100;
};

