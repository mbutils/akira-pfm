// Format currency to Vietnamese Dong
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Calculate monthly debt payment
export const calculateMonthlyDebtPayment = (debt) => {
  if (debt.type === 'installment') {
    const totalWithInterest = debt.amount + (debt.amount * (debt.interestRate || 0) / 100);
    return totalWithInterest / debt.months;
  }
  return debt.monthlyAmount || 0;
};

// Check if debt is within safe limit (40% of income)
export const isDebtSafe = (totalDebtPayment, monthlyIncome) => {
  const debtLimit = monthlyIncome * 0.4;
  return totalDebtPayment <= debtLimit;
};

// Calculate total from array of items
export const calculateTotal = (items, field) => {
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
};
