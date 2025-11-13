import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indian formatting utilities
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '₹0';
  
  if (numAmount >= 10000000) {
    return `₹${(numAmount / 10000000).toFixed(1)}Cr`;
  } else if (numAmount >= 100000) {
    return `₹${(numAmount / 100000).toFixed(1)}L`;
  } else if (numAmount >= 1000) {
    return `₹${(numAmount / 1000).toFixed(0)}K`;
  }
  
  return `₹${numAmount.toLocaleString('en-IN')}`;
}

export function formatIndianNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return '0';
  return numValue.toLocaleString('en-IN');
}

// Sample Indian names for different categories
export const indianClientNames = {
  corporate: [
    'Tata Consultancy Services',
    'Reliance Industries Ltd',
    'Infosys Technologies',
    'Wipro Corporation',
    'Mahindra & Mahindra',
    'Bajaj Auto Limited',
    'ITC Limited',
    'HDFC Bank Ltd',
    'Asian Paints Ltd',
    'Maruti Suzuki India'
  ],
  individual: [
    'Rajesh Kumar Sharma',
    'Priya Mehta',
    'Amit Singh Rajput',
    'Neha Joshi',
    'Arjun Gupta',
    'Kavya Iyer',
    'Suresh Reddy',
    'Anita Patel',
    'Rohit Agarwal',
    'Deepika Nair'
  ],
  emails: [
    'rajesh.sharma@gmail.com',
    'priya.mehta@company.co.in',
    'amit.singh@techsolutions.in',
    'neha.joshi@enterprises.in',
    'arjun.gupta@business.co.in'
  ]
};

export const indianInsuranceCompanies = [
  'LIC of India',
  'ICICI Prudential Life',
  'HDFC Life Insurance',
  'SBI Life Insurance',
  'Bajaj Allianz General',
  'IFFCO Tokio General',
  'New India Assurance',
  'Oriental Insurance',
  'United India Insurance',
  'National Insurance'
];

export const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
];
