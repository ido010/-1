export interface PortfolioItem {
  id: string;
  title: string;
  category: "E-COMMERCE" | "CONTENT" | "CAMPAIGN" | "OTHER";
  client: string;
  projectType: string;
  role: string;
  year: string;
  classification: "Agency Project" | "In-house Project" | "Freelance Project";
  description: string;
  thumbnailUrl: string;
  resultImages: string[];
  isCustom?: boolean; // True if created by Admin
}

export interface ContactInquiry {
  id: string;
  inquirerName: string;
  companyName: string;
  phone: string;
  email: string;
  projectType: string;
  budgetEstimate: string;
  message: string;
  createdAt: string;
  status: "pending" | "reviewed" | "completed";
}
