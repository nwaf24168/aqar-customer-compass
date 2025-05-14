
import { ServiceCategory } from '@/services/service-data-service';
import { SatisfactionData } from '@/services/satisfaction-service';

/**
 * Converts service data categories to a format suitable for charts
 */
export const convertServiceDataToFormat = (categories: ServiceCategory[]) => {
  const result: Record<string, number> = {};
  
  categories.forEach(category => {
    const categoryTotal = category.metrics.reduce((sum, metric) => sum + metric.value, 0);
    result[category.title] = categoryTotal;
  });
  
  return result;
};

/**
 * Calculates satisfaction percentages from satisfaction data
 */
export const calculateSatisfactionPercentages = (data: SatisfactionData) => {
  const result: Record<string, number> = {};
  
  data.categories.forEach(category => {
    const total = category.metrics.reduce((sum, metric) => sum + metric.value, 0);
    if (total > 0) {
      // Calculate percentage of positive responses (e.g., very good + good)
      const positiveResponses = category.metrics
        .filter(m => m.id.includes('veryGood') || m.id.includes('good'))
        .reduce((sum, m) => sum + m.value, 0);
      
      result[category.title] = Math.round((positiveResponses / total) * 100);
    } else {
      result[category.title] = 0;
    }
  });
  
  return result;
};
