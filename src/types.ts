export type Language = "en" | "bn";

export interface ProjectSpec {
  label: string;
  labelBn: string;
  value: string;
  valueBn: string;
}

export interface Project {
  id: string;
  name: string;
  nameBn: string;
  location: string;
  locationBn: string;
  type: "Residential" | "Commercial" | "Duplex" | "Penthouse";
  typeBn: string;
  size: string;
  sizeBn: string;
  price: string;
  priceBn: string;
  status: "Ongoing" | "Completed" | "Upcoming" | "Booking Open" | "New Launch" | "Few Units Left";
  statusBn: string;
  image: string;
  description: string;
  descriptionBn: string;
  rajukApproved: boolean;
  earthquakeResistant: boolean;
  amenities: string[];
  amenitiesBn: string[];
  specs: ProjectSpec[];
  dwgUrl?: string;
  pdfUrl?: string;
  dwgFilename?: string;
  pdfFilename?: string;
  
  // Custom Investment Calculator parameters
  isLandShare?: boolean;
  isReadyPlot?: boolean;
  isReadyFlat?: boolean;
  sharePrice?: number;
  installmentDue?: number;
  constructionCost?: number;
  minTotalInvestment?: number;
  maxTotalInvestment?: number;
  pricePerKatha?: number;
  flatPriceReady?: number;
}

export interface Testimonial {
  name: string;
  nameBn: string;
  location: string;
  locationBn: string;
  rating: number;
  comment: string;
  commentBn: string;
  avatar: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  date: string;
  dateBn: string;
  image: string;
  readTime: string;
  readTimeBn: string;
  summary: string;
  summaryBn: string;
  content?: string;
}

export interface CareerJob {
  id: string;
  title: string;
  titleBn: string;
  department: string;
  departmentBn: string;
  location: string;
  type: string;
  typeBn: string;
  experience: string;
  experienceBn: string;
  deadline: string;
}

export interface FAQ {
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
}

export interface FlatDetail {
  id: string;
  floor: number;
  unitCode: string;
  flatName: string;
  sizeSqFt: number;
  bedrooms: number;
  bathrooms: number;
  verandas: number;
  facing: string;
  priceBDT: string;
  priceNum: number;
  status: string;
  idealFor: string;
  ReservedDates?: string[];
}

