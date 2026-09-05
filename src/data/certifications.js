// Single source of truth for portfolio certifications.
// To add a new certificate in the future, simply place the image (.png/.jpg/.webp)
// and PDF (.pdf) in `src/assets/certifications/` and add an entry to this array.

import sqlTransactionsImg from '../assets/certifications/Data Manipulation and Transactions in SQL Server.png';
import sqlTransactionsPdf from '../assets/certifications/Data Manipulation and Transactions in SQL Server.pdf';

import gcpCoreImg from '../assets/certifications/Google Cloud Fundamentals Core Infrastructure.png';
import gcpCorePdf from '../assets/certifications/Google Cloud Fundamentals Core Infrastructure.pdf';

import ibmAIFundamentalsImg from '../assets/certifications/IBM AI Fumdamentals.png';
import ibmAIFundamentalsPdf from '../assets/certifications/IBM AI Fumdamentals.pdf';

import networkingImg from '../assets/certifications/Introduction to Networking.png';
import networkingPdf from '../assets/certifications/Introduction to Networking.pdf';

import kaggleMLImg from '../assets/certifications/Kaggle Intermediate ML Certificate.png';
import kaggleMLPdf from '../assets/certifications/Kaggle Intermediate ML Certificate.pdf';

import pythonSpecImg from '../assets/certifications/Python for Everybody SPECIALIZATION.png';
import pythonSpecPdf from '../assets/certifications/Python for Everybody SPECIALIZATION.pdf';

import sqlFoundationsImg from '../assets/certifications/SQL Foundations.png';
import sqlFoundationsPdf from '../assets/certifications/SQL Foundations.pdf';

export const certifications = [
  {
    id: 'ibm-ai-fundamentals',
    name: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM SkillsBuild',
    issueDate: 'Jan 30, 2026',
    credentialId: 'dda8d923-fa5e-47ef-84b3-1eaea26f9f7e',
    credentialUrl: 'https://www.credly.com/badges/dda8d923-fa5e-47ef-84b3-1eaea26f9f7e',
    image: ibmAIFundamentalsImg,
    pdf: ibmAIFundamentalsPdf,
  },
  {
    id: 'gcp-core-infrastructure',
    name: 'Google Cloud Fundamentals: Core Infrastructure',
    issuer: 'Google Cloud (via Coursera)',
    issueDate: 'Sep 7, 2025',
    credentialId: 'XU6DROCMVSLM',
    credentialUrl: 'https://coursera.org/verify/XU6DROCMVSLM',
    image: gcpCoreImg,
    pdf: gcpCorePdf,
  },
  {
    id: 'python-for-everybody',
    name: 'Python for Everybody Specialization',
    issuer: 'University of Michigan (via Coursera)',
    issueDate: 'Sep 8, 2025',
    credentialId: 'N59IZP734XS8',
    credentialUrl: 'https://coursera.org/verify/specialization/N59IZP734XS8',
    image: pythonSpecImg,
    pdf: pythonSpecPdf,
  },
  {
    id: 'intro-to-networking',
    name: 'Introduction to Networking',
    issuer: 'NVIDIA (via Coursera)',
    issueDate: 'Sep 9, 2025',
    credentialId: 'O7RFKXBZRSY2',
    credentialUrl: 'https://coursera.org/verify/O7RFKXBZRSY2',
    image: networkingImg,
    pdf: networkingPdf,
  },
  {
    id: 'sql-foundations',
    name: 'SQL Foundations',
    issuer: 'Microsoft (via Coursera)',
    issueDate: 'Sep 15, 2025',
    credentialId: '57KHSYC1YK1X',
    credentialUrl: 'https://coursera.org/verify/57KHSYC1YK1X',
    image: sqlFoundationsImg,
    pdf: sqlFoundationsPdf,
  },
  {
    id: 'sql-transactions',
    name: 'Data Manipulation and Transactions in SQL Server',
    issuer: 'Microsoft (via Coursera)',
    issueDate: 'Sep 20, 2025',
    credentialId: '0I1KP361PIZP',
    credentialUrl: 'https://coursera.org/verify/0I1KP361PIZP',
    image: sqlTransactionsImg,
    pdf: sqlTransactionsPdf,
  },
  {
    id: 'kaggle-intermediate-ml',
    name: 'Intermediate Machine Learning',
    issuer: 'Kaggle',
    issueDate: null,
    credentialId: null,
    credentialUrl: null,
    image: kaggleMLImg,
    pdf: kaggleMLPdf,
  },
];

export default certifications;
