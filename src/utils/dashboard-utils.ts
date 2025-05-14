
import { ServiceCategory } from '@/services/service-data-service';
import { SatisfactionCategory } from '@/services/satisfaction-service';

/**
 * Converts service data categories to a format suitable for the dashboard
 */
export const convertServiceDataToFormat = (serviceData: ServiceCategory[]) => {
  if (!serviceData || !Array.isArray(serviceData)) {
    return [];
  }
  
  // Return the data in the expected format for the dashboard
  return serviceData.map(category => ({
    title: category.title,
    items: category.metrics.map(metric => ({
      name: metric.label,
      value: metric.value
    }))
  }));
};

/**
 * Calculates satisfaction percentages from satisfaction data
 */
export const calculateSatisfactionPercentages = (data: { categories: SatisfactionCategory[] }) => {
  if (!data || !data.categories) {
    return [];
  }
  
  return data.categories.map(category => {
    const metrics = category.metrics || [];
    
    // Calculate total responses
    const total = metrics.reduce((sum, metric) => sum + (metric.value || 0), 0);
    
    // Calculate positive responses (very good + good)
    const positiveResponses = metrics
      .filter(metric => metric.id === 'veryGood' || metric.id === 'good')
      .reduce((sum, metric) => sum + (metric.value || 0), 0);
    
    // Calculate percentage
    const percentage = total > 0 ? `${((positiveResponses / total) * 100).toFixed(1)}%` : '0%';
    
    return {
      title: category.title,
      percentage: percentage
    };
  });
};
