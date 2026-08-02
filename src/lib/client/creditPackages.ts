/** Credit top-up packages — mirrors CREDIT_PACKAGES in razorpay.service.ts */
export const CREDIT_PACKAGES_CLIENT = [
  { label: "₹100",  amountPaid: 100,  creditsGiven: 100,  bonus: 0   },
  { label: "₹500",  amountPaid: 500,  creditsGiven: 550,  bonus: 10  },
  { label: "₹1000", amountPaid: 1000, creditsGiven: 1100, bonus: 10  },
  { label: "₹2000", amountPaid: 2000, creditsGiven: 2300, bonus: 15  },
  { label: "₹5000", amountPaid: 5000, creditsGiven: 6000, bonus: 20  },
] as const;
