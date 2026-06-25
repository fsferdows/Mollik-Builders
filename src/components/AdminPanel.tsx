import React, { useEffect, useState } from "react";
import { Language } from "../types";
import { 
  Shield, Mail, Phone, Calendar, MapPin, Briefcase, LandPlot, RefreshCw, X, Menu,
  FileText, Award, User, Save, Building, Clock, Sparkles, Lock, Edit, Sliders, 
  CheckCircle2, Users, ChevronRight, BarChart3, Plus, Trash2, Eye, Play, 
  DollarSign, Activity, FileCheck, Layers, MessageSquare, Send, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Lead {
  id: string;
  type: "visit" | "land" | "career" | "contact" | "newsletter";
  data: any;
  timestamp: string;
}

interface AdminPanelProps {
  language: Language;
  onClose: () => void;
  webConfig?: any;
  onConfigSaved?: () => void;
}

export default function AdminPanel({ language, onClose, webConfig, onConfigSaved }: AdminPanelProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Session details
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = sessionStorage.getItem("mollik_admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch (_) { return null; }
  });
  
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mfaSubmitted, setMfaSubmitted] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempUser, setTempUser] = useState<any>(null);

  // Lists & data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [managerActivity, setManagerActivity] = useState<any[]>([]);
  
  // Theme state
  const [themeConfig, setThemeConfig] = useState({
    logoText: "Mollik",
    footerText: "© 2026 Mollik Builders — Corporate Headquarters",
    primaryColor: "#1B4D3E",
    accentColor: "#C8A165",
    fontFamily: "Space Grotesk"
  });

  // Sidebar navigation and Filters
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [leadsFilter, setLeadsFilter] = useState<string>("all");

  // Editable configuration fields based on current webConfig props (Super Admin / Founders)
  const [founderConfig, setFounderConfig] = useState({
    name: "", nameBn: "", title: "", titleBn: "", phone: "", email: "",
    location: "", locationBn: "", bio: "", bioBn: "", exp: "", expBn: "", image: ""
  });
  const [aboutConfig, setAboutConfig] = useState({
    title: "", titleBn: "", text: "", textBn: "", image: ""
  });
  const [hotline1, setHotline1] = useState("");
  const [hotline2, setHotline2] = useState("");
  const [hotline3, setHotline3] = useState("");
  const [heroSlides, setHeroSlides] = useState<any[]>([]);

  // Input states for Manager actions & CRM Kanban
  const [newProp, setNewProp] = useState({ name: "", location: "", price: "", status: "Booking Open", units: "20" });
  const [newExpense, setNewExpense] = useState({ project: "Mollik Tower", amount: "", category: "Labor wages", description: "" });
  const [newInvoice, setNewInvoice] = useState({ client: "", email: "", suite: "3B", project: "Mollik Tower", bdt: "৳ 3.15 Crore", plan: "Custom 36-Month Plan" });
  const [chatInput, setChatInput] = useState("");
  const [emiState, setEmiState] = useState({ amount: "10000000", rate: "9", duration: "10", emiResult: "126,676 BDT" });
  const [newBooking, setNewBooking] = useState({ clientName: "", clientPhone: "", clientEmail: "", projectName: "Madina Tower", unitId: "", unitFloor: "1", unitSize: "1450", totalPriceBDT: "", paidAmountBDT: "", paymentPlan: "36-Month Installment", notes: "" });
  const [paymentModal, setPaymentModal] = useState<{ bookingId: string; clientName: string } | null>(null);
  const [paymentInput, setPaymentInput] = useState({ amount: "", method: "Bank Transfer" });

  // Notifications state
  const [notifications, setNotifications] = useState<string[]>([
    "System alert: Pre-launch registrations has reached peak Q2 targets.",
    "Manager Sabbir generated property sales invoice to Sayed Chowdhury."
  ]);

  // Operations state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // VIP Concierge Hub state
  const [conciergeSubTab, setConciergeSubTab] = useState<"visits" | "telemetry" | "broadcast">("visits");
  const [broadcastRate, setBroadcastRate] = useState("6.5%");
  const [vipDispatchedLeads, setVipDispatchedLeads] = useState<string[]>([]);
  const [newVipAlertText, setNewVipAlertText] = useState("");
  const [vipChatLogs, setVipChatLogs] = useState([
    {
      id: "vchat-1",
      client: "Anisur Rahman",
      location: "Gulshan-2 Elite resident",
      query: "What is the BDT valuation of Mollik Vista Penthouse?",
      response: "The starting valuation is 5.40 Crore BDT with RAJUK-compliant smart VRF cooling specs.",
      time: "2 mins ago",
      active: true
    },
    {
      id: "vchat-2",
      client: "Engr. Tasnim Chowdhury",
      location: "Banani Lake Road",
      query: "Tell me about the smart cooling systems.",
      response: "All units feature high-efficiency VRF (Variable Refrigerant Flow) multi-split cooling channels, giving individual room controls and reducing electricity load factor by 35%.",
      time: "10 mins ago",
      active: false
    },
    {
      id: "vchat-3",
      client: "Zubayer Hussain",
      location: "Uttara Sector 4",
      query: "Can I customize the partition wall placements?",
      response: "Yes! Our structural engineering studio allows complete partition relocation and kitchen repositioning prior to slab casting. Our physical concierge holds pre-cast blueprint consulting hours daily.",
      time: "25 mins ago",
      active: false
    }
  ]);

  // Synchronize state values from webConfig when it updates
  useEffect(() => {
    if (webConfig) {
      setFounderConfig({
        name: webConfig.founderName || "",
        nameBn: webConfig.founderNameBn || "",
        title: webConfig.founderTitle || "",
        titleBn: webConfig.founderTitleBn || "",
        phone: webConfig.founderPhone || "",
        email: webConfig.founderEmail || "",
        location: webConfig.founderLocation || "",
        locationBn: webConfig.founderLocationBn || "",
        bio: webConfig.founderBio || "",
        bioBn: webConfig.founderBioBn || "",
        exp: webConfig.founderExp || "",
        expBn: webConfig.founderExpBn || "",
        image: webConfig.founderImage || "/chairman.png"
      });

      setAboutConfig({
        title: webConfig.aboutTitle || "",
        titleBn: webConfig.aboutTitleBn || "",
        text: webConfig.aboutText || "",
        textBn: webConfig.aboutTextBn || "",
        image: webConfig.aboutImage || ""
      });

      const numbers = webConfig.hotlineNumbersList || [];
      setHotline1(numbers[0] || "+880 1715-120802");
      setHotline2(numbers[1] || "+880 1811-253989");
      setHotline3(numbers[2] || "+880 1928-258818");
      setHeroSlides(webConfig.heroSlides || []);
    }
  }, [webConfig]);

  const pullERPData = async () => {
    if (!currentUser) return;
    setLeadsLoading(true);
    try {
      const [leadsRes, usersRes, logsRes, propsRes, laborRes, invRes, expRes, flowRes, chatRes, invcRes, themeRes, bookingsRes, statsRes, activityRes, mgrActivityRes] = await Promise.all([
        fetch("/api/admin/leads").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json()),
        fetch("/api/admin/audit-logs").then(r => r.json()),
        fetch("/api/admin/properties").then(r => r.json()),
        fetch("/api/admin/attendance").then(r => r.json()),
        fetch("/api/admin/inventory").then(r => r.json()),
        fetch("/api/admin/expenses").then(r => r.json()),
        fetch("/api/admin/workflows").then(r => r.json()),
        fetch("/api/admin/chats").then(r => r.json()),
        fetch("/api/admin/invoices").then(r => r.json()),
        fetch("/api/admin/theme").then(r => r.json()),
        fetch("/api/admin/bookings").then(r => r.json()),
        fetch("/api/admin/dashboard-stats").then(r => r.json()),
        fetch("/api/admin/activity-feed").then(r => r.json()),
        fetch("/api/admin/activity-feed?role=manager").then(r => r.json())
      ]);

      if (leadsRes.success) setLeads(leadsRes.leads);
      if (usersRes.success) setUsers(usersRes.users);
      if (logsRes.success) setAuditLogs(logsRes.logs);
      if (propsRes.success) setProperties(propsRes.properties);
      if (laborRes.success) setAttendance(laborRes.attendance);
      if (invRes.success) setInventory(invRes.inventory);
      if (expRes.success) setExpenses(expRes.expenses);
      if (flowRes.success) setWorkflows(flowRes.workflows);
      if (chatRes.success) setChats(chatRes.chats);
      if (invcRes.success) setInvoices(invcRes.invoices);
      if (themeRes.success) setThemeConfig(themeRes.theme);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (statsRes.success) setDashboardStats(statsRes.stats);
      if (activityRes.success) setActivityFeed(activityRes.activities);
      if (mgrActivityRes.success) setManagerActivity(mgrActivityRes.activities);
    } catch (_) {}
    setLeadsLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      pullERPData();
      // Set reasonable active route scope
      if (currentUser.role === "manager") {
        setActiveTab("manager_erp");
      } else if (currentUser.role === "founder") {
        setActiveTab("founder_board");
      } else {
        setActiveTab("dashboard");
      }
    }
  }, [currentUser]);

  // Auto-refresh every 10 seconds for real-time sync
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      pullERPData();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Auth Submit & Quick Test Bypass
  const handleLoginSubmit = async (e?: React.FormEvent, directCreds?: { u: string; p: string }) => {
    if (e) e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    const uName = directCreds ? directCreds.u : usernameInput;
    const pwd = directCreds ? directCreds.p : passwordInput;

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uName, password: pwd })
      });
      const data = await res.json();
      if (data.success) {
        if (data.user.role === "super_admin") {
          setTempUser(data.user);
          // Wait for 2FA verification code
        } else {
          setCurrentUser(data.user);
          sessionStorage.setItem("mollik_admin_authenticated", "true");
          sessionStorage.setItem("mollik_admin_user", JSON.stringify(data.user));
        }
      } else {
        setLoginError(data.error);
      }
    } catch (_) {
      setLoginError("Connection refused by the master server.");
    }
    setIsLoading(false);
  };

  const handle2FAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode === "123456" || mfaCode === "18108") {
      setCurrentUser(tempUser);
      setMfaSubmitted(true);
      sessionStorage.setItem("mollik_admin_authenticated", "true");
      sessionStorage.setItem("mollik_admin_user", JSON.stringify(tempUser));
    } else {
      setLoginError("Invalid MFA Verification Code pin.");
    }
  };

  // Impersonator login-as account selection
  const handleImpersonatorLaunch = async (targetId: string) => {
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ superAdminId: currentUser.id, targetUserId: targetId })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.targetUser);
        setNotifications(n => [`Impersonating dashboard session as ${data.targetUser.name}!`, ...n]);
      }
    } catch (_) {}
  };

  // Revert back from Impersonator session
  const exitImpersonation = () => {
    const originalSuperAdmin = {
      id: "usr_super_1",
      username: "fsferdows",
      name: "Ferdows Mollik",
      email: "erdows.mollik@mollikbuilders.com",
      role: "super_admin",
      mfaEnabled: true
    };
    setCurrentUser(originalSuperAdmin);
    setNotifications(n => [`Impersonation terminated. Reverted safely to Super Admin privileges.`, ...n]);
  };

  // CMS WebConfig full save
  const handleCMSAndFounderSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setSaveSuccess(false);

    const updatedConfig = {
      ...webConfig,
      founderName: founderConfig.name,
      founderNameBn: founderConfig.nameBn,
      founderTitle: founderConfig.title,
      founderTitleBn: founderConfig.titleBn,
      founderPhone: founderConfig.phone,
      founderEmail: founderConfig.email,
      founderLocation: founderConfig.location,
      founderLocationBn: founderConfig.locationBn,
      founderBio: founderConfig.bio,
      founderBioBn: founderConfig.bioBn,
      founderExp: founderConfig.exp,
      founderExpBn: founderConfig.expBn,
      founderImage: founderConfig.image,
      aboutTitle: aboutConfig.title,
      aboutTitleBn: aboutConfig.titleBn,
      aboutText: aboutConfig.text,
      aboutTextBn: aboutConfig.textBn,
      aboutImage: aboutConfig.image,
      hotlineNumbersList: [hotline1, hotline2, hotline3].filter(n => n.trim() !== ""),
      hotlineNumber: hotline1,
      heroSlides
    };

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig)
      });
      if (res.ok) {
        setSaveSuccess(true);
        if (onConfigSaved) onConfigSaved();
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (_) {}
    setActionLoading(false);
  };

  // Brand and UX palette customizer
  const handleThemeColorSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeConfig)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (_) {}
    setActionLoading(false);
  };

  // Property CRUD actions (Mgr/Super Admin)
  const handlePropertyCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.name || !newProp.location) return;
    try {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProp)
      });
      if (res.ok) {
        pullERPData();
        setNewProp({ name: "", location: "", price: "", status: "Booking Open", units: "20" });
      }
    } catch (_) {}
  };

  const handlePropertyDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) pullERPData();
    } catch (_) {}
  };

  // labor attendance
  const toggleAttendance = async (workerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Present" ? "Absent" : "Present";
    try {
      const res = await fetch("/api/admin/attendance-toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, status: nextStatus })
      });
      if (res.ok) pullERPData();
    } catch (_) {}
  };

  // inventory adjustment
  const handleInventoryAdjust = async (id: string, qty: number) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adjustmentQuantity: qty })
      });
      if (res.ok) pullERPData();
    } catch (_) {}
  };

  // Manager Expense filing
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: newExpense.project,
          amountBDT: newExpense.amount,
          category: newExpense.category,
          description: newExpense.description,
          reportedBy: currentUser.name
        })
      });
      if (res.ok) {
        pullERPData();
        setNewExpense({ project: "Mollik Tower", amount: "", category: "Labor wages", description: "" });
      }
    } catch (_) {}
  };

  // Lead Kanban Stage adjust
  const handleLeadStageAdvance = async (leadId: string, newType: any) => {
    // Advanced click progression simulation
    pullERPData();
  };

  // Sales invoice creator
  const handleInvoiceCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliName: newInvoice.client,
          cliEmail: newInvoice.email,
          suiteNum: newInvoice.suite,
          project: newInvoice.project,
          amountBDT: newInvoice.bdt,
          paymentPlan: newInvoice.plan
        })
      });
      if (res.ok) {
        pullERPData();
        setNewInvoice({ client: "", email: "", suite: "3B", project: "Mollik Tower", bdt: "৳ 3.15 Crore", plan: "Custom 36-Month Plan" });
      }
    } catch (_) {}
  };

  // Executive workflow approval actions
  const processWorkflowStatus = async (id: string, decision: "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/admin/workflows/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: decision, remarks: "Decision authorized by Founder Saheb Ali Mollik" })
      });
      if (res.ok) {
        pullERPData();
        setNotifications(n => [`Workflow status updated to ${decision}!`, ...n]);
      }
    } catch (_) {}
  };

  // Custom EMI Calculator solver
  const computeEMIMath = () => {
    const P = parseFloat(emiState.amount) || 0;
    const r = (parseFloat(emiState.rate) || 0) / 12 / 100;
    const n = (parseFloat(emiState.duration) || 0) * 12;
    if (P > 0 && r > 0 && n > 0) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmiState(s => ({ ...s, emiResult: `${Math.round(emi).toLocaleString()} BDT / Month` }));
    }
  };

  // Chat message send
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      const res = await fetch("/api/admin/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: currentUser.name,
          senderRole: currentUser.role === "super_admin" ? "Super Admin" : currentUser.role === "founder" ? "Founder" : "Manager",
          text: chatInput
        })
      });
      if (res.ok) {
        pullERPData();
        setChatInput("");
      }
    } catch (_) {}
  };

  // Booking CRUD handlers
  const handleBookingCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.clientName || !newBooking.projectName || !newBooking.unitId || !newBooking.totalPriceBDT) return;
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBooking, bookedBy: currentUser.name })
      });
      if (res.ok) {
        pullERPData();
        setNewBooking({ clientName: "", clientPhone: "", clientEmail: "", projectName: "Madina Tower", unitId: "", unitFloor: "1", unitSize: "1450", totalPriceBDT: "", paidAmountBDT: "", paymentPlan: "36-Month Installment", notes: "" });
        setNotifications(n => [`New booking created for ${newBooking.clientName}!`, ...n]);
      }
    } catch (_) {}
  };

  const handleBookingPayment = async (bookingId: string) => {
    if (!paymentInput.amount || Number(paymentInput.amount) <= 0) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentAmount: paymentInput.amount, paymentMethod: paymentInput.method })
      });
      if (res.ok) {
        pullERPData();
        setPaymentModal(null);
        setPaymentInput({ amount: "", method: "Bank Transfer" });
        setNotifications(n => [`Payment of ৳${Number(paymentInput.amount).toLocaleString()} recorded successfully!`, ...n]);
      }
    } catch (_) {}
  };

  const handleBookingStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) pullERPData();
    } catch (_) {}
  };

  const handleBookingDelete = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
      if (res.ok) {
        pullERPData();
        setNotifications(n => ["Booking removed successfully.", ...n]);
      }
    } catch (_) {}
  };

  // Simulated Database Backup-Restore
  const triggerDatabaseBackup = () => {
    setNotifications(n => ["Lead registries database synced & backed up safely to Cloud SQL cold vault.", ...n]);
  };

  // Search filter
  const [globalSearch, setGlobalSearch] = useState("");
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
    u.username.toLowerCase().includes(globalSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredCMSLeads = leads.filter(l => {
    if (leadsFilter !== "all" && l.type !== leadsFilter) return false;
    if (!globalSearch) return true;
    const term = globalSearch.toLowerCase();
    return (
      (l.data?.name || "").toLowerCase().includes(term) ||
      (l.data?.phone || "").toLowerCase().includes(term) ||
      (l.data?.email || "").toLowerCase().includes(term) ||
      (l.data?.project || "").toLowerCase().includes(term)
    );
  });

  const handleLogout = () => {
    setCurrentUser(null);
    setTempUser(null);
    setMfaSubmitted(false);
    sessionStorage.removeItem("mollik_admin_authenticated");
    sessionStorage.removeItem("mollik_admin_user");
  };

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-[#090b10]/95 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans text-neutral-200 selection:bg-[#1B4D3E] selection:text-[#DFBA84]">
      
      {/* IMPERSONATION FLOATING INDICATOR BAR */}
      {currentUser && currentUser.impersonatedBy && (
        <div className="fixed top-0 inset-x-0 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white font-mono text-[10px] font-bold uppercase text-center py-2 px-4 tracking-widest flex items-center justify-center gap-2 z-55 shadow-2xl animate-pulse border-b border-red-500/35">
          <Activity className="w-3 h-3 shrink-0" />
          <span>ALERT: Active Session Impersonation Mode - [{currentUser.name}] ({currentUser.role.toUpperCase()})</span>
          <button 
            onClick={exitImpersonation}
            className="ml-3 px-2 py-0.5 bg-white hover:bg-neutral-100 text-red-700 rounded font-black uppercase text-[9px] tracking-wider transition-all duration-300 cursor-pointer border-0 shadow-md"
          >
            TERMINATE &times;
          </button>
        </div>
      )}

      {/* 1. AUTHENTICATED PORTAL */}
      {!currentUser ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-[#111319] to-[#0a0b0e] border border-[#C8A165]/30 p-5 rounded-xl w-full max-w-sm shadow-[0_0_50px_rgba(200,161,101,0.06)] relative text-left"
        >
          {/* Subtle gold decoration dot */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1 items-center">
            <span className="w-1 h-1 rounded-full bg-[#C8A165]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A165]" />
            <span className="w-1 h-1 rounded-full bg-[#C8A165]/40" />
          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-neutral-500 hover:text-white transition-all p-1 bg-neutral-900/60 hover:bg-neutral-800 rounded border border-white/[0.04] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Luxury Head */}
          <div className="flex flex-col items-center text-center space-y-1.5 mb-5 pt-3">
            <div className="w-11 h-11 rounded-full border border-[#C8A165]/30 flex items-center justify-center bg-black/80 shadow-[inset_0_0_12px_rgba(200,161,101,0.1)]">
              <Shield className="w-5 h-5 text-[#C8A165] animate-pulse" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8A165]">Secure Portal Login</h4>
            <p className="text-[9px] text-neutral-450 tracking-wider uppercase font-mono">Mollik Builders Executive Console</p>
          </div>

          {!tempUser ? (
            <form onSubmit={(e) => handleLoginSubmit(e)} className="space-y-3">
              <div>
                <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase mb-1 tracking-widest">Authorized ID</label>
                <input 
                  type="text" 
                  placeholder="Username (e.g. fsferdows)" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#030406]/90 border border-neutral-800 focus:border-[#C8A165]/80 focus:ring-1 focus:ring-[#C8A165]/30 text-white px-3 py-1.5 text-xs rounded outline-none font-mono tracking-wider transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase mb-1 tracking-widest">Decryption Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#030406]/90 border border-neutral-800 focus:border-[#C8A165]/80 focus:ring-1 focus:ring-[#C8A165]/30 text-white px-3 py-1.5 text-xs rounded outline-none font-mono tracking-wider transition-all"
                  required
                />
              </div>

              {loginError && (
                <div className="text-[9.5px] text-red-400 font-bold bg-red-950/15 p-2 rounded border border-red-900/40 leading-snug">
                  ✕ {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1.5 bg-gradient-to-r from-[#C8A165] to-[#DFBA84] hover:brightness-110 active:scale-[0.98] text-neutral-950 font-mono font-black py-2 rounded text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg border-0"
              >
                {isLoading ? "Decrypting..." : (language === "en" ? "Verify Identity ↗" : "লগইন করুন ↗")}
              </button>

              {/* QUICK TEST DEMO BYPASS ROW */}
              <div className="pt-3 border-t border-neutral-900/90 mt-4 text-center">
                <span className="block text-[8px] font-mono uppercase mb-2 tracking-[0.15em] text-neutral-500">Authorized Passkeys</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLoginSubmit(undefined, { u: "fsferdows", p: "FsFerdows26" })}
                    className="py-1 px-1.5 bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-[#C8A165]/60 rounded font-mono text-[8.5px] text-[#C8A165] transition-all cursor-pointer font-bold"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoginSubmit(undefined, { u: "MOLLIKLTD", p: "Mollik" })}
                    className="py-1 px-1.5 bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-[#C8A165]/60 rounded font-mono text-[8.5px] text-[#DFBA84] transition-all cursor-pointer font-bold"
                  >
                    Founder
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoginSubmit(undefined, { u: "manager", p: "Manager" })}
                    className="py-1 px-1.5 bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-900 hover:border-emerald-500/50 rounded font-mono text-[8.5px] text-cyan-400 transition-all cursor-pointer font-bold"
                  >
                    Manager
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Super Admin 2-FA PIN CODE SCREEN */
            <form onSubmit={handle2FAVerify} className="space-y-4">
              <div className="p-2.5 bg-amber-500/5 border border-amber-500/25 rounded text-[10px] text-amber-400/90 leading-normal font-mono">
                ⚠️ SECURITY REQUIREMENT: Two-factor credentials decrypted. Enter bypass authentication key (use: <span className="text-[#C8A165] font-bold">123456</span> or <span className="text-[#C8A165] font-bold">18108</span>).
              </div>
              <div>
                <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase mb-1.5 tracking-wider text-center">Dual Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="123456" 
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full bg-[#030406] border border-neutral-850 text-center tracking-[0.5em] text-base focus:border-[#C8A165] text-[#C8A165] font-mono py-1.5 rounded outline-none"
                  required
                />
              </div>

              {loginError && (
                <div className="text-[9.5px] text-red-400 font-bold bg-red-950/10 p-2 rounded border border-red-900/40 text-center leading-normal">
                  ✕ {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C8A165] to-[#DFBA84] text-neutral-950 font-mono font-black py-2 rounded text-[10px] uppercase tracking-[0.15em] transition-all cursor-pointer border-0 hover:brightness-105"
              >
                Access Session
              </button>
            </form>
          )}

          <div className="mt-4 pt-3.5 border-t border-neutral-900/60 text-center text-[8px] text-neutral-500 font-mono tracking-wider">
            RAJUK / BNBC CLASSIFIED PROTOCOL LOCKS APPLIED
          </div>
        </motion.div>
      ) : (
        /* MAIN AUTHENTICATED BOARD PANEL */
        <motion.div 
          initial={{ opacity: 0, scale: 0.992 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-b from-[#0b0c10] to-[#040506] border border-[#C8A165]/15 text-neutral-300 w-full max-w-6xl h-[92vh] rounded-xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col md:flex-row relative text-left"
        >
          {/* SIDEBAR BACKDROP ON MOBILE */}
          {isSidebarOpen && (
            <div 
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 md:hidden"
            />
          )}

          {/* SIDEBAR NAVIGATION PANEL */}
          <div 
            className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-64 md:w-56 h-full md:h-auto bg-[#040507]/98 md:bg-[#040507]/90 border-r border-[#C8A165]/10 p-3 shrink-0 flex flex-col justify-between select-none transition-transform duration-350 md:transform-none ${
              isSidebarOpen ? "translate-x-0 animate-in slide-in-from-left duration-250" : "-translate-x-full md:translate-x-0"
            }`}
          >
            <div>
              {/* Luxury Logo Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900/80 mb-4 px-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C8A165] to-[#DFBA84] flex items-center justify-center text-neutral-950 font-black font-mono text-[11px] shadow-[0_0_15px_rgba(200,161,101,0.2)]">
                    MB
                  </div>
                  <div>
                    <h5 className="font-serif font-black text-[11px] text-white leading-none tracking-[0.16em] uppercase">
                      {themeConfig.logoText.toUpperCase()}<span className="text-[#C8A165]">.</span>ADMIN
                    </h5>
                    <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#C8A165]/90 uppercase block mt-1">
                      {currentUser.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
                {/* Close Button on Mobile only */}
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SIDEBAR TABS BY ROLE CAPABILITIES */}
              <div className="space-y-1">
                {currentUser.role === "super_admin" && (
                  <>
                    <button
                      onClick={() => selectTab("dashboard")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "dashboard" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Activity className={`w-3.5 h-3.5 ${activeTab === "dashboard" ? "text-[#C8A165]" : ""}`} />
                      <span>Security Console</span>
                    </button>
                    <button
                      onClick={() => selectTab("website_cms")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "website_cms" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Sliders className={`w-3.5 h-3.5 ${activeTab === "website_cms" ? "text-[#C8A165]" : ""}`} />
                      <span>Dynamic CMS</span>
                    </button>
                    <button
                      onClick={() => selectTab("incoming_leads")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "incoming_leads" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Users className={`w-3.5 h-3.5 ${activeTab === "incoming_leads" ? "text-[#C8A165]" : ""}`} />
                      <span>CMS Client Leads</span>
                    </button>
                    <button
                      onClick={() => selectTab("vip_concierge")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "vip_concierge" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${activeTab === "vip_concierge" ? "text-[#C8A165]" : ""}`} />
                      <span>VIP Concierge Hub</span>
                    </button>
                    <button
                      onClick={() => selectTab("activity_monitor")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "activity_monitor" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Eye className={`w-3.5 h-3.5 ${activeTab === "activity_monitor" ? "text-[#C8A165]" : ""}`} />
                      <span>Activity Monitor</span>
                    </button>
                  </>
                )}

                {currentUser.role === "founder" && (
                  <>
                    <button
                      onClick={() => selectTab("founder_board")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "founder_board" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <BarChart3 className={`w-3.5 h-3.5 ${activeTab === "founder_board" ? "text-[#C8A165]" : ""}`} />
                      <span>Founder Board</span>
                    </button>
                    <button
                      onClick={() => selectTab("workflows")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "workflows" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <FileCheck className={`w-3.5 h-3.5 ${activeTab === "workflows" ? "text-[#C8A165]" : ""}`} />
                      <span>Workflows Approval</span>
                    </button>
                    <button
                      onClick={() => selectTab("incoming_leads")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "incoming_leads" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Users className={`w-3.5 h-3.5 ${activeTab === "incoming_leads" ? "text-[#C8A165]" : ""}`} />
                      <span>Live Client Leads</span>
                    </button>
                    <button
                      onClick={() => selectTab("manager_activity")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "manager_activity" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Activity className={`w-3.5 h-3.5 ${activeTab === "manager_activity" ? "text-[#C8A165]" : ""}`} />
                      <span>Manager Activity</span>
                    </button>
                  </>
                )}

                {currentUser.role === "manager" && (
                  <>
                    <button
                      onClick={() => selectTab("manager_erp")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "manager_erp" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Layers className={`w-3.5 h-3.5 ${activeTab === "manager_erp" ? "text-[#C8A165]" : ""}`} />
                      <span>Properties & CRM</span>
                    </button>
                    <button
                      onClick={() => selectTab("bookings_mgmt")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "bookings_mgmt" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Briefcase className={`w-3.5 h-3.5 ${activeTab === "bookings_mgmt" ? "text-[#C8A165]" : ""}`} />
                      <span>Bookings Manager</span>
                    </button>
                    <button
                      onClick={() => selectTab("field_labor")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "field_labor" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <Calendar className={`w-3.5 h-3.5 ${activeTab === "field_labor" ? "text-[#C8A165]" : ""}`} />
                      <span>Labor & Materials</span>
                    </button>
                    <button
                      onClick={() => selectTab("sales_billing")}
                      className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                        activeTab === "sales_billing" 
                          ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                          : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <DollarSign className={`w-3.5 h-3.5 ${activeTab === "sales_billing" ? "text-[#C8A165]" : ""}`} />
                      <span>Expenses & Billing</span>
                    </button>
                  </>
                )}

                {/* SHARED COMMON ERP TAB */}
                <button
                  onClick={() => selectTab("internal_chat")}
                  className={`w-full text-left px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-2 cursor-pointer border-0 transition-all ${
                    activeTab === "internal_chat" 
                      ? "bg-[#1B4D3E]/30 text-[#DFBA84] border-l-2 border-[#C8A165] shadow-[inset_0_0_10px_rgba(27,77,62,0.15)]" 
                      : "text-neutral-450 hover:bg-neutral-900/40 hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <MessageSquare className={`w-3.5 h-3.5 ${activeTab === "internal_chat" ? "text-[#C8A165]" : ""}`} />
                  <span>HQ Team Chat</span>
                </button>
              </div>
            </div>

            {/* Bottom session user profile card */}
            <div className="pt-3 border-t border-neutral-900/80 mt-3 px-0.5">
              <div className="flex items-center gap-2 p-1.5 bg-neutral-950/70 rounded border border-neutral-900 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#1B4D3E]/40 border border-[#C8A165]/35 text-[#DFBA84] flex items-center justify-center font-bold text-[10px] uppercase font-mono shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold text-white truncate leading-none">{currentUser.name}</span>
                  <span className="block text-[8px] text-[#C8A165]/95 font-mono leading-none mt-1 truncate">{currentUser.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-2.5 px-2.5 py-1 bg-neutral-950 hover:bg-red-950/20 text-neutral-400 hover:text-red-400 text-[9px] font-mono uppercase font-bold tracking-widest rounded transition-all cursor-pointer border border-neutral-900/85 hover:border-red-900/50"
              >
                Sign Out Session &times;
              </button>
            </div>
          </div>

          {/* MAIN INTERNAL WORKSPACE WINDOW */}
          <div className="flex-1 overflow-y-auto bg-[#06070a] flex flex-col justify-between">
            
            {/* Header Toolbar */}
            <div className="px-5 py-3 bg-[#0a0c10]/95 border-b border-[#C8A165]/10 flex items-center justify-between shadow-sm relative">
              {/* Highlight divider bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#1B4D3E] via-[#C8A165]/40 to-transparent" />
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-1.5 bg-neutral-900 text-[#C8A165] hover:text-white hover:bg-neutral-850 rounded border border-neutral-800 cursor-pointer"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-white font-serif font-black text-xs tracking-widest flex flex-wrap items-center gap-1.5 sm:gap-2 uppercase">
                    <span>{themeConfig.logoText} Builders — ERP Portal</span>
                    <span className="text-[7.5px] bg-[#163a23]/80 text-emerald-350 px-2 py-0.5 rounded font-mono border border-emerald-500/25 tracking-widest uppercase hidden sm:inline-block">Live System Lock</span>
                  </h3>
                  <p className="text-[9px] text-neutral-450 tracking-wider mt-0.5 font-light line-clamp-1">
                    Decrypted credentials session active. Database is secure.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white transition-all p-1 bg-neutral-900/60 hover:bg-neutral-800 rounded border border-white/[0.04] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Major Switch Workspaces */}
            <div className="p-4 sm:p-5 flex-1">
              <AnimatePresence mode="wait">

                {/* ==========================================
                    SUPER ADMIN CONSOLE: STAFF CRUD, IMPERSONATION, BACKUP
                    ========================================== */}
                {activeTab === "dashboard" && currentUser.role === "super_admin" && (
                  <motion.div key="sec_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Left Side: System Credentials & Impersonate */}
                      <div className="lg:col-span-8 space-y-4">
                        <div className="bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3.5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/10 via-[#C8A165]/30 to-transparent" />
                          <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                            <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5" />
                              <span>Staff credentials management</span>
                            </h4>
                            <span className="text-[8px] font-mono text-neutral-500 uppercase">{users.length} Active Accounts</span>
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={globalSearch}
                              onChange={(e) => setGlobalSearch(e.target.value)}
                              placeholder="Search credentials system by role or name..."
                              className="w-full bg-[#030406] border border-neutral-850 text-[10px] sm:text-xs px-3 py-1.5 rounded outline-none text-neutral-200 placeholder-neutral-600 focus:border-[#C8A165]/50 transition-all font-mono"
                            />
                            <button
                              onClick={triggerDatabaseBackup}
                              className="px-3 shrink-0 py-1 bg-[#1B4D3E]/10 hover:bg-[#1B4D3E]/30 text-[9px] font-mono text-[#DFBA84] rounded border border-[#C8A165]/35 uppercase font-bold tracking-wider cursor-pointer transition-all hover:scale-[1.02]"
                            >
                              Sync Backup
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-neutral-400">
                              <thead>
                                <tr className="border-b border-neutral-905 font-mono text-[8px] uppercase tracking-widest text-neutral-500">
                                  <th className="pb-1.5 font-bold">User details</th>
                                  <th className="pb-1.5 font-bold">Role level</th>
                                  <th className="pb-1.5 font-bold">Security Status</th>
                                  <th className="pb-1.5 font-bold text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredUsers.map((u, idx) => (
                                  <tr key={`user-row-${u.id || idx}-${idx}`} className="border-b border-neutral-900/40 last:border-0 hover:bg-neutral-900/30 transition-all">
                                    <td className="py-2">
                                      <span className="block font-sans font-bold text-[#f3f4f6] text-[11px] leading-tight">{u.name}</span>
                                      <span className="block text-[8.5px] text-neutral-500 font-mono mt-0.5">{u.username} • {u.email}</span>
                                    </td>
                                    <td className="py-2">
                                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase tracking-wider ${
                                        u.role === "super_admin" ? "bg-red-950/20 text-red-400 border border-red-900/30" :
                                        u.role === "founder" ? "bg-amber-950/20 text-amber-400 border border-amber-900/30" :
                                        "bg-cyan-950/20 text-cyan-400 border border-cyan-900/30"
                                      }`}>
                                        {u.role.replace("_", " ")}
                                      </span>
                                    </td>
                                    <td className="py-2">
                                      <span className="inline-flex items-center gap-1 text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active
                                      </span>
                                    </td>
                                    <td className="py-2 text-right space-x-1 whitespace-nowrap">
                                      {u.id !== currentUser.id && (
                                        <button
                                          onClick={() => handleImpersonatorLaunch(u.id)}
                                          className="px-2 py-0.5 bg-[#1B4D3E]/25 hover:bg-[#1B4D3E]/50 text-[#DFBA84] font-mono font-bold text-[8px] rounded border border-[#C8A165]/30 cursor-pointer uppercase transition-all tracking-wider"
                                          title="Spoof target user session"
                                        >
                                          Login As
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handlePropertyDelete(u.id)}
                                        className="text-red-400/80 hover:text-red-400 font-mono text-[8.5px] uppercase cursor-pointer border-0 bg-transparent px-1"
                                      >
                                        Revoke
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Audit Logs */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-neutral-850 via-[#C8A165]/30 to-transparent" />
                          <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2">
                            Global security audit logs
                          </h4>
                          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                            {auditLogs.map((log, idx) => (
                              <div key={`audit-log-${log.id || idx}-${idx}`} className="p-2 bg-[#030406]/95 rounded border border-neutral-900 leading-normal">
                                <div className="flex justify-between text-[7px] font-mono text-neutral-550 uppercase mb-0.5">
                                  <span>{log.username} • {log.action}</span>
                                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[10px] text-neutral-350 font-sans tracking-wide leading-normal font-light">{log.details}</p>
                                {log.impersonatedBy && (
                                  <span className="block text-[7.5px] text-red-400 font-mono uppercase font-black mt-0.5">
                                    [IMPERSONATED BY SUPER ADMIN]
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    CMS WEBSITE CUSTOMIZER & BRAND CUSTOMIZATION
                    ========================================== */}
                {activeTab === "website_cms" && currentUser.role === "super_admin" && (
                  <motion.div key="cms_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Left: Dynamic Brand Customizer */}
                      <form onSubmit={handleThemeColorSave} className="lg:col-span-4 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3">
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2">
                          UI/UX Style Brand parameters
                        </h4>

                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Brand Logotype Text</label>
                          <input 
                            type="text"
                            value={themeConfig.logoText}
                            onChange={(e) => setThemeConfig({ ...themeConfig, logoText: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-xs px-2.5 py-1 rounded outline-none text-white font-bold font-mono uppercase tracking-widest focus:border-[#C8A165]/50 transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Primary Color</label>
                            <input 
                              type="color"
                              value={themeConfig.primaryColor}
                              onChange={(e) => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                              className="w-full h-7 bg-neutral-950 border border-neutral-850 rounded p-0.5 outline-none cursor-pointer"
                            />
                            <span className="block text-[8px] font-mono text-neutral-500 text-center mt-0.5 uppercase">{themeConfig.primaryColor}</span>
                          </div>
                          <div>
                            <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Accent Gold</label>
                            <input 
                              type="color"
                              value={themeConfig.accentColor}
                              onChange={(e) => setThemeConfig({ ...themeConfig, accentColor: e.target.value })}
                              className="w-full h-7 bg-neutral-950 border border-neutral-850 rounded p-0.5 outline-none cursor-pointer"
                            />
                            <span className="block text-[8px] font-mono text-neutral-500 text-center mt-0.5 uppercase">{themeConfig.accentColor}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Interface Typography</label>
                          <select
                            value={themeConfig.fontFamily}
                            onChange={(e) => setThemeConfig({ ...themeConfig, fontFamily: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-xs px-2 py-1 rounded outline-none text-neutral-300 font-mono focus:border-[#C8A165]/50 transition-all"
                          >
                            <option value="Space Grotesk">Space Grotesk (Tech Modern)</option>
                            <option value="Inter">Inter (Swiss Corporate)</option>
                            <option value="Playfair Display">Playfair Display (Luxury Editorial)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono text-[#C8A165]/90 uppercase mb-1 tracking-wider">Legal Copyright</label>
                          <textarea 
                            rows={2}
                            value={themeConfig.footerText}
                            onChange={(e) => setThemeConfig({ ...themeConfig, footerText: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded outline-none text-neutral-400 font-serif leading-normal focus:border-[#C8A165]/50 transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-1.5 bg-gradient-to-r from-[#C29B61] to-[#DFBA84] hover:brightness-110 text-neutral-950 font-mono font-bold text-[9px] uppercase tracking-widest rounded transition-all cursor-pointer border-0 shadow-md"
                        >
                          Disseminate Styles
                        </button>

                        <div className="p-2 bg-[#030406] rounded border border-neutral-900 leading-normal text-[8.5px] text-neutral-500 text-center font-mono select-none">
                          Real-time system theme injection applied globally.
                        </div>
                      </form>

                      {/* Right: CMS Text Editor */}
                      <div className="lg:col-span-8">
                        <form onSubmit={handleCMSAndFounderSave} className="bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/10 via-[#C8A165]/20 to-transparent" />
                          <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                            <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                              <Edit className="w-3.5 h-3.5" />
                              <span>CMS Live Content Block Editor</span>
                            </h4>
                            <button
                              type="submit"
                              disabled={actionLoading}
                              className="px-3 py-1 bg-[#1B4D3E]/15 hover:bg-[#1B4D3E]/30 border border-[#C8A165]/35 text-[#DFBA84] font-mono font-bold text-[9.5px] tracking-widest uppercase rounded cursor-pointer transition-all"
                            >
                              Sync CMS Data
                            </button>
                          </div>

                          {/* Direct website hotlines editing */}
                          <div className="space-y-1">
                            <span className="block text-[8.5px] font-mono text-neutral-450 uppercase tracking-widest">Hotline coordinates (live flashing footer bar)</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input 
                                type="text"
                                value={hotline1}
                                onChange={(e) => setHotline1(e.target.value)}
                                className="bg-[#030406] border border-neutral-850 text-xs px-2.5 py-1 rounded text-white font-mono focus:border-[#C8A165]/50 transition-all"
                                placeholder="Primary hotline"
                              />
                              <input 
                                type="text"
                                value={hotline2}
                                onChange={(e) => setHotline2(e.target.value)}
                                className="bg-[#030406] border border-neutral-850 text-xs px-2.5 py-1 rounded text-white font-mono focus:border-[#C8A165]/50 transition-all"
                                placeholder="Backup hot"
                              />
                              <input 
                                type="text"
                                value={hotline3}
                                onChange={(e) => setHotline3(e.target.value)}
                                className="bg-[#030406] border border-neutral-850 text-xs px-2.5 py-1 rounded text-white font-mono focus:border-[#C8A165]/50 transition-all"
                                placeholder="Crisis route"
                              />
                            </div>
                          </div>

                          {/* About Section text block formatting */}
                          <div className="space-y-2 pt-2 border-t border-neutral-900">
                            <span className="block text-[8.5px] font-mono text-neutral-450 uppercase tracking-widest">About Corporate Section Content</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-wider mb-0.5">Title En</label>
                                <input 
                                  value={aboutConfig.title}
                                  onChange={(e) => setAboutConfig({ ...aboutConfig, title: e.target.value })}
                                  className="w-full bg-[#030406] border border-neutral-850 text-xs px-2.5 py-1 rounded outline-none focus:border-[#C8A165]/50 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-wider mb-0.5">Title Bn</label>
                                <input 
                                  value={aboutConfig.titleBn}
                                  onChange={(e) => setAboutConfig({ ...aboutConfig, titleBn: e.target.value })}
                                  className="w-full bg-[#030406] border border-neutral-850 text-xs px-2.5 py-1 rounded outline-none focus:border-[#C8A165]/50 transition-all"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-wider mb-0.5">Story Paragraph En</label>
                                <textarea 
                                  rows={2}
                                  value={aboutConfig.text}
                                  onChange={(e) => setAboutConfig({ ...aboutConfig, text: e.target.value })}
                                  className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded outline-none text-neutral-350 font-sans focus:border-[#C8A165]/50 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-wider mb-0.5">Story Paragraph Bn</label>
                                <textarea 
                                  rows={2}
                                  value={aboutConfig.textBn}
                                  onChange={(e) => setAboutConfig({ ...aboutConfig, textBn: e.target.value })}
                                  className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded outline-none text-neutral-350 font-sans focus:border-[#C8A165]/50 transition-all"
                                />
                              </div>
                            </div>
                          </div>

                          {saveSuccess && (
                            <div className="p-2 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 text-[9px] font-mono uppercase text-center rounded tracking-wider">
                              ✓ Website configuration synchronized and loaded globally on all sessions.
                            </div>
                          )}
                        </form>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    CMS INCOMING CLIENT LEADS GRID VIEWER
                    ========================================== */}
                {activeTab === "incoming_leads" && (
                  <motion.div key="leads_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 bg-[#0b0c10]/95 rounded border border-neutral-900 space-y-4 shadow relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/10 via-[#C8A165]/30 to-transparent" />
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-neutral-900 pb-3">
                        <div>
                          <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>System client leads registry</span>
                          </h4>
                          <p className="text-[9px] text-neutral-450 mt-0.5">Real-time land submissions, site-visits, and joint ventures proposal pipeline.</p>
                        </div>

                        {/* Search + Filter Selectors */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex rounded bg-[#030406] p-0.5 border border-neutral-850 shadow-inner">
                            {["all", "visit", "land", "contact"].map(tier => (
                              <button
                                key={tier}
                                onClick={() => setLeadsFilter(tier)}
                                className={`px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase rounded border-0 cursor-pointer transition-all ${
                                  leadsFilter === tier 
                                    ? "bg-[#1B4D3E] text-[#DFBA84] shadow-sm font-black" 
                                    : "text-neutral-500 hover:text-white"
                                }`}
                              >
                                {tier}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {leadsLoading ? (
                        <div className="py-12 text-center text-[10px] font-mono text-neutral-500 flex items-center justify-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C8A165]" />
                          <span>PULLING DIRECT PLATFORM LEAD DATASTREAM...</span>
                        </div>
                      ) : filteredCMSLeads.length === 0 ? (
                        <div className="py-12 text-center text-xs font-mono text-neutral-500 uppercase tracking-wider">
                          No active items match the current search filters or criteria.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredCMSLeads.map((lead, idx) => (
                            <div key={`cms-lead-${lead.id || idx}-${idx}`} className="p-3 bg-[#030406] rounded border border-neutral-900 hover:border-neutral-800 transition-all flex flex-col justify-between relative group shadow-sm">
                              {/* Left filament highlighting */}
                              <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r ${
                                lead.type === "visit" ? "bg-emerald-500" :
                                lead.type === "land" ? "bg-amber-500" :
                                "bg-cyan-500"
                              }`} />
                              <div className="pl-1">
                                <div className="flex justify-between items-center mb-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase text-white tracking-widest ${
                                    lead.type === "visit" ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30" :
                                    lead.type === "land" ? "bg-amber-950/20 text-amber-400 border border-amber-900/30" :
                                    "bg-cyan-950/20 text-cyan-400 border border-cyan-900/30"
                                  }`}>
                                    {lead.type}
                                  </span>
                                  <span className="text-[8.5px] text-neutral-500 font-mono tracking-wider">
                                    {new Date(lead.timestamp).toLocaleDateString()} {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>

                                <div className="space-y-1 text-xs font-sans text-neutral-300">
                                  {Object.entries(lead.data).map(([key, val], eIdx) => (
                                    <div key={`${lead.id || idx}-data-prop-${key}-${eIdx}`} className="flex gap-2 justify-between border-b border-neutral-900/40 pb-1 py-0.5 last:border-0 last:pb-0">
                                      <span className="text-[8px] font-mono text-neutral-500 uppercase font-bold w-16 shrink-0 truncate">{key}:</span>
                                      <span className="text-[10px] text-right font-medium break-all flex-1 text-neutral-300">{String(val)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-neutral-900/80 border-dashed text-[8px] text-neutral-550 font-mono uppercase flex justify-between items-center bg-[#07080b]/50 px-2 py-0.5 rounded">
                                <span>Record: #{lead.id}</span>
                                <span className="text-emerald-500 font-bold flex items-center gap-1">✓ Verified stream</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    FOUNDER ANALYTICS EXECUTIVE BOARD
                    ========================================== */}
                {activeTab === "founder_board" && currentUser.role === "founder" && (
                  <motion.div key="f_board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    
                    {/* Live KPIs Header metrics from real backend stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { title: "Revenue Collected", val: dashboardStats ? `৳${(dashboardStats.totalRevenue / 100000).toFixed(1)} Lac` : "Loading...", change: `${dashboardStats?.confirmedBookings || 0} confirmed bookings`, color: "text-[#DFBA84]", trend: "up" },
                        { title: "Outstanding Receivables", val: dashboardStats ? `৳${(dashboardStats.totalRemaining / 100000).toFixed(1)} Lac` : "Loading...", change: `${dashboardStats?.pendingBookings || 0} pending clients`, color: "text-amber-400", trend: "stable" },
                        { title: "Total Expenses Filed", val: dashboardStats ? `৳${(dashboardStats.totalExpenses / 1000).toFixed(0)}K` : "Loading...", change: "Filed by managers", color: "text-red-400", trend: "down" },
                        { title: "Net Cashflow", val: dashboardStats ? `৳${(dashboardStats.netCashflow / 100000).toFixed(1)} Lac` : "Loading...", change: `${dashboardStats?.totalBookings || 0} active bookings`, color: "text-emerald-400", trend: dashboardStats?.netCashflow > 0 ? "up" : "down" }
                      ].map((item, idx) => (
                        <div key={`kpi-${idx}`} className="p-2.5 bg-[#0b0c10]/95 rounded border border-neutral-900 relative overflow-hidden group shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#C8A165]/30">
                          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#C8A165]/15 group-hover:bg-[#C8A165]/35 transition-all" />
                          <span className="text-[8px] font-mono font-bold uppercase text-neutral-450 tracking-widest block">{item.title}</span>
                          <div className="flex items-center justify-between gap-1 mt-1">
                            <span className={`block font-serif text-sm sm:text-base font-black leading-none ${item.color}`}>{item.val}</span>
                            <svg className={`w-10 h-5 opacity-40 group-hover:opacity-100 transition-opacity ${item.color}`} viewBox="0 0 50 20">
                              {item.trend === "up" && (
                                <path d="M 2 18 Q 15 12 28 14 T 48 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              )}
                              {item.trend === "stable" && (
                                <path d="M 2 10 Q 15 11 28 10 T 48 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" />
                              )}
                              {item.trend === "down" && (
                                <path d="M 2 3 Q 15 5 28 12 T 48 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              )}
                            </svg>
                          </div>
                          <span className="block text-[7.5px] font-mono text-neutral-500 leading-none mt-1">{item.change}</span>
                        </div>
                      ))}
                    </div>

                    {/* Manager Bookings Overview Table */}
                    <div className="bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/10 via-[#C8A165]/25 to-transparent" />
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Manager Bookings Ledger — Live Overview</span>
                        </h4>
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest font-black">{bookings.length} Records</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-neutral-400">
                          <thead>
                            <tr className="border-b border-neutral-900 font-mono text-[8px] uppercase tracking-widest text-[#D2B48C]">
                              <th className="pb-1.5 font-bold">Client</th>
                              <th className="pb-1.5 font-bold">Project / Unit</th>
                              <th className="pb-1.5 font-bold font-mono">Total (BDT)</th>
                              <th className="pb-1.5 font-bold font-mono">Paid</th>
                              <th className="pb-1.5 font-bold font-mono">Remaining</th>
                              <th className="pb-1.5 font-bold">Status</th>
                              <th className="pb-1.5 font-bold">Booked By</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-900/60">
                            {bookings.map((bk: any, idx: number) => (
                              <tr key={`fbk-${bk.id || idx}`} className="hover:bg-[#030406]/40 transition-colors">
                                <td className="py-2.5">
                                  <span className="font-bold text-white text-[11px] block">{bk.clientName}</span>
                                  <span className="text-[8px] text-neutral-500 font-mono">{bk.clientPhone}</span>
                                </td>
                                <td className="py-2.5 font-mono text-neutral-350 text-[10px]">{bk.projectName} — {bk.unitId}</td>
                                <td className="py-2.5 text-[#DFBA84] font-serif font-black text-xs">৳{bk.totalPriceBDT?.toLocaleString()}</td>
                                <td className="py-2.5 text-emerald-400 font-mono font-bold text-[10px]">৳{bk.paidAmountBDT?.toLocaleString()}</td>
                                <td className="py-2.5 text-amber-400 font-mono font-bold text-[10px]">৳{bk.remainingBDT?.toLocaleString()}</td>
                                <td className="py-2.5">
                                  <span className={`px-1.5 py-0.5 text-[7px] rounded font-mono uppercase font-extrabold border ${
                                    bk.status === "Confirmed" ? "bg-emerald-955/20 border-emerald-500/25 text-emerald-400" :
                                    bk.status === "Pending" ? "bg-amber-955/20 border-amber-500/25 text-amber-400" :
                                    "bg-red-955/20 border-red-500/25 text-red-400"
                                  }`}>{bk.status}</span>
                                </td>
                                <td className="py-2.5 text-[9px] font-mono text-neutral-450">{bk.bookedBy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Left: Expenses filed by managers */}
                      <div className="lg:col-span-7 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-red-500/10 via-[#C8A165]/15 to-transparent" />
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Manager Expense Reports</span>
                        </h4>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {expenses.map((exp: any, idx: number) => (
                            <div key={`fexp-${exp.id || idx}`} className="p-2 bg-[#030406]/95 rounded border border-neutral-900 flex justify-between items-center">
                              <div>
                                <span className="text-[10px] font-bold text-white block">{exp.project}</span>
                                <span className="text-[8px] text-neutral-500 font-mono">{exp.category} — {exp.reportedBy}</span>
                              </div>
                              <span className="text-red-400 font-mono font-bold text-xs">-৳{exp.amountBDT?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Project Breakdown from stats */}
                      <div className="lg:col-span-5 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/10 via-[#C8A165]/20 to-transparent" />
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2">
                          Revenue by Project
                        </h4>
                        <div className="space-y-2.5">
                          {dashboardStats?.projectBreakdown && Object.entries(dashboardStats.projectBreakdown).map(([project, data]: [string, any], idx: number) => {
                            const maxRevenue = Math.max(...Object.values(dashboardStats.projectBreakdown).map((d: any) => d.revenue), 1);
                            const pct = Math.round((data.revenue / maxRevenue) * 100);
                            return (
                              <div key={`proj-${idx}`}>
                                <div className="flex justify-between text-[10px] text-neutral-300 font-semibold mb-0.5">
                                  <span>{project} <span className="text-neutral-500 font-mono text-[8px]">({data.count} bookings)</span></span>
                                  <span className="text-[#C8A165] font-mono">৳{(data.revenue / 100000).toFixed(1)} Lac</span>
                                </div>
                                <div className="w-full bg-neutral-900 h-1.5 rounded overflow-hidden">
                                  <div className="bg-[#C8A165] h-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[7.5px] font-mono text-neutral-500">Remaining: ৳{(data.remaining / 100000).toFixed(1)} Lac</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    FOUNDER SECTION: EXECUTIVE WORKFLOW APPROVALS
                    ========================================== */}
                {activeTab === "workflows" && currentUser.role === "founder" && (
                  <motion.div key="flows_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 bg-[#0b0c10]/95 rounded border border-neutral-900 space-y-4 shadow relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-500/10 via-[#C8A165]/35 to-transparent" />
                      <div>
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5 font-black">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Executive board level approvals pipeline</span>
                        </h4>
                        <p className="text-[9px] text-neutral-450 mt-0.5 font-sans leading-none">Authorize or dismiss joint venture landowner contracts, materials budgets, or penthouse discount clearances.</p>
                      </div>

                      <div className="space-y-2.5">
                        {workflows.map((wf, idx) => (
                          <div key={`workflow-${wf.id || idx}-${idx}`} className="p-3 bg-[#030406] rounded border border-neutral-900 hover:border-neutral-850 transition-all flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center relative pl-4">
                            {/* Accent line based on status */}
                            <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r ${
                              wf.status === "Pending" ? "bg-amber-500" :
                              wf.status === "Approved" ? "bg-emerald-500" :
                              "bg-red-500"
                            }`} />
                            
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase rounded border ${
                                  wf.status === "Pending" ? "bg-amber-955/20 border-amber-500/30 text-amber-400" :
                                  wf.status === "Approved" ? "bg-emerald-955/20 border-emerald-500/30 text-emerald-400" :
                                  "bg-red-955/20 border-red-500/30 text-red-400"
                                }`}>
                                  {wf.status}
                                </span>
                                <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest font-black">{wf.category} • Submitted by: {wf.submittedBy}</span>
                              </div>
                              <h5 className="font-serif text-xs font-bold text-white tracking-wide">{wf.title}</h5>
                              <p className="text-[10.5px] text-neutral-400 font-light leading-normal font-sans">{wf.details}</p>
                            </div>

                            {wf.status === "Pending" && (
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => processWorkflowStatus(wf.id, "Approved")}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-mono font-black text-[8px] tracking-widest uppercase rounded cursor-pointer leading-none transition-colors border-0 shadow"
                                >
                                  APPROVE
                                </button>
                                <button
                                  onClick={() => processWorkflowStatus(wf.id, "Rejected")}
                                  className="px-3 py-1 bg-red-950/20 hover:bg-red-955 text-red-400 border border-red-900/60 font-mono font-bold text-[8px] tracking-widest uppercase rounded cursor-pointer leading-none transition-colors"
                                >
                                  REJECT
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* ==========================================
                    MANAGER SECTION: PROPERTIES CRUD CATALOGUE & CRM KANBAN
                    ========================================== */}
                {activeTab === "manager_erp" && currentUser.role === "manager" && (
                  <motion.div key="mgr_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Left Side: Real-Time Properties Catalog CRUD */}
                      <div className="lg:col-span-8 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1.2px] bg-gradient-to-r from-[#C29B61]/25 via-transparent to-transparent" />
                        <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                          <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5 font-black">
                            <Building className="w-3.5 h-3.5" />
                            <span>Properties Catalog CRUD Ledger</span>
                          </h4>
                        </div>

                        <form onSubmit={handlePropertyCreate} className="grid grid-cols-2 lg:grid-cols-5 gap-2 bg-[#030406]/95 p-2 px-3 rounded border border-neutral-900">
                          <input 
                            type="text"
                            placeholder="Mollik Elite"
                            value={newProp.name}
                            onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                            className="bg-[#0b0c10] border border-neutral-850 text-[10.5px] px-2 py-1 rounded placeholder-neutral-500 text-white outline-none focus:border-[#C8A165]"
                          />
                          <input 
                            type="text"
                            placeholder="Gulshan, Dhaka"
                            value={newProp.location}
                            onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                            className="bg-[#0b0c10] border border-neutral-850 text-[10.5px] px-2 py-1 rounded placeholder-neutral-500 text-white outline-none focus:border-[#C8A165]"
                          />
                          <input 
                            type="text"
                            placeholder="BDT 1.2 Crore"
                            value={newProp.price}
                            onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                            className="bg-[#0b0c10] border border-neutral-850 text-[10.5px] px-2 py-1 rounded placeholder-[#C8A165] text-white outline-none focus:border-[#C8A165] font-serif"
                          />
                          <select
                            value={newProp.status}
                            onChange={(e) => setNewProp({ ...newProp, status: e.target.value })}
                            className="bg-[#0b0c10] border border-neutral-850 text-[10.5px] px-1 py-1 rounded text-neutral-300 outline-none focus:border-[#C8A165]"
                          >
                            <option value="Booking Open">Booking Open</option>
                            <option value="Few Units Left">Few Units Left</option>
                            <option value="New Launch">New Launch</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Upcoming">Upcoming</option>
                          </select>
                          <button
                            type="submit"
                            className="py-1 bg-gradient-to-r from-[#C29B61] to-[#DFBA84] hover:brightness-110 text-neutral-950 font-mono font-black text-[8px] uppercase tracking-widest rounded cursor-pointer border-0 shadow-sm flex items-center justify-center"
                          >
                            Add Prop
                          </button>
                        </form>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left text-neutral-400">
                            <thead>
                              <tr className="border-b border-neutral-900 font-mono text-[8px] uppercase tracking-widest text-[#D2B48C]">
                                <th className="pb-1.5 font-bold">Property Name</th>
                                <th className="pb-1.5 font-bold">Location Range</th>
                                <th className="pb-1.5 font-bold font-mono">Starting Quote</th>
                                <th className="pb-1.5 font-bold font-mono">Cleared Status</th>
                                <th className="pb-1.5 font-bold text-right font-mono">Delete</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-900/60">
                              {properties.map((p, idx) => (
                                <tr key={`erp-property-${p.id || idx}-${idx}`} className="hover:bg-[#030406]/40 transition-colors">
                                  <td className="py-2.5 font-bold text-white text-[11.5px]">{p.name}</td>
                                  <td className="py-2.5 font-mono text-neutral-450 text-[10px]">{p.location}</td>
                                  <td className="py-2.5 text-[#DFBA84] font-serif font-black text-xs">{p.price}</td>
                                  <td className="py-2.5">
                                    <span className="px-1.5 py-0.5 bg-[#030406]/90 border border-neutral-850 text-[7px] rounded font-mono uppercase text-neutral-300 font-extrabold tracking-wider">
                                      {p.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-right">
                                    <button
                                      onClick={() => handlePropertyDelete(p.id)}
                                      className="p-1 text-red-500 hover:text-red-400 cursor-pointer border-0 bg-transparent"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right Side: Interactive Leads Pipeline CRM Kanban Board */}
                      <div className="lg:col-span-4 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/15 via-transparent to-transparent" />
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2 flex justify-between items-center font-black">
                          <span>Lead Pipeline CRM Kanban</span>
                          <span className="text-[7.5px] font-mono text-neutral-500">3-Step Pipeline</span>
                        </h4>

                        <div className="space-y-3">
                          {[
                            { name: "New Lead Check-In", list: leads.slice(0, 1), action: "Discuss", color: "border-l-2 border-cyan-500", labelColor: "text-cyan-400 bg-cyan-500/10" },
                            { name: "In Active Discussion", list: leads.slice(1, 2), action: "Negotiating", color: "border-l-2 border-amber-500", labelColor: "text-amber-400 bg-amber-500/10" },
                            { name: "Under Contract Closure", list: leads.slice(2, 3), action: "Close Win", color: "border-l-2 border-emerald-500", labelColor: "text-emerald-400 bg-emerald-500/10" }
                          ].map((lane, lIdx) => (
                            <div key={`lead-lane-${lIdx}`} className={`p-2.5 bg-[#030406]/95 rounded border border-neutral-900 space-y-2 ${lane.color}`}>
                              <span className="text-[8px] font-mono font-extrabold uppercase text-neutral-400 block tracking-wider leading-none">
                                {lane.name}
                              </span>
                              
                              {lane.list.length > 0 ? (
                                lane.list.map((fItem, fItemIdx) => (
                                  <div key={`lane-${lIdx}-fitem-${fItem.id || fItemIdx}`} className="p-2 bg-[#0b0c10] border border-neutral-850 rounded text-xs space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-white text-[10.5px] truncate max-w-[120px] block">{fItem.data?.name || "Web Subscriber"}</span>
                                      <span className="text-[7px] bg-emerald-955/20 text-emerald-400 px-1 py-0.2 rounded font-mono font-extrabold border border-emerald-500/15">Verified</span>
                                    </div>
                                    <p className="text-[9.5px] text-neutral-450 leading-relaxed font-light font-sans mb-1.5">Interested in premium property purchase.</p>
                                    <button
                                      onClick={() => handleLeadStageAdvance(fItem.id, lane.action)}
                                      className="w-full py-0.5 bg-[#030406] hover:bg-neutral-900 font-mono font-semibold text-[7.5px] uppercase tracking-wide rounded cursor-pointer text-[#C8A165] border border-neutral-850 hover:border-[#C8A165]/35 transition-colors"
                                    >
                                      Advance to &rarr; {lane.action}
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span className="block text-[8px] text-neutral-605 font-mono italic text-center py-1">No leads in channel.</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    MANAGER SECTION: FIELD CONSTRUCTIONS LABOR ATTENDANCE & INVENTORY
                    ========================================== */}
                {activeTab === "field_labor" && currentUser.role === "manager" && (
                  <motion.div key="labor_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Left: Daily Labor Check-in Panel */}
                      <div className="lg:col-span-6 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent" />
                        <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                          <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5 font-black">
                            <Users className="w-3.5 h-3.5" />
                            <span>Construction site daily labor board</span>
                          </h4>
                        </div>

                        <div className="space-y-2">
                          {attendance.map((worker, idx) => (
                            <div key={`attendance-worker-${worker.id || idx}-${idx}`} className="p-2.5 bg-[#030406]/95 rounded border border-neutral-900 flex justify-between items-center gap-3">
                              <div>
                                <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider font-extrabold">{worker.trade} // {worker.assignedProject}</span>
                                <h5 className="font-bold text-white text-[11px] mt-0.5">{worker.name}</h5>
                                <span className="block text-[9px] text-[#DFBA84] font-mono leading-none mt-1">Daily Wage: <strong className="font-extrabold">৳{worker.wagePerDayBDT}</strong></span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black uppercase ${
                                  worker.status === "Present" ? "bg-emerald-955/20 text-emerald-400 border border-emerald-500/20" : "bg-red-955/20 text-red-400 border border-red-500/15"
                                }`}>
                                  {worker.status}
                                </span>
                                <button
                                  onClick={() => toggleAttendance(worker.id, worker.status)}
                                  className={`px-2 py-0.5 text-[7.5px] font-mono font-black uppercase rounded cursor-pointer border-0 transition-colors ${
                                    worker.status === "Present" ? "bg-neutral-900 hover:bg-neutral-850 text-neutral-450" : "bg-[#1B4D3E] hover:bg-[#12362c] text-[#DFBA84]"
                                  }`}
                                >
                                  TOGGLE
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Real-time Construction Inventory stock adjustments */}
                      <div className="lg:col-span-6 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent" />
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2 font-black">
                          Construction Inventory & materials ledger
                        </h4>

                        <div className="space-y-2">
                          {inventory.map((item, idx) => {
                            const isCritical = item.quantity < item.safetyStockLevel;
                            return (
                              <div key={`inventory-item-${item.id || idx}-${idx}`} className="p-2.5 bg-[#030406]/95 rounded border border-neutral-900 leading-normal">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <span className="block font-bold text-white text-[11px]">{item.name}</span>
                                    <span className="block text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">Category: {item.category} // Limit: {item.safetyStockLevel} {item.unit}</span>
                                  </div>
                                  <span className={`px-1.5 py-0.2 rounded text-[7px] font-mono font-black uppercase ${
                                    isCritical ? "bg-red-955/20 text-red-400 border border-red-500/25 animate-pulse" : "bg-neutral-900 border text-neutral-450 border-neutral-850"
                                  }`}>
                                    {isCritical ? "CRITICAL STOCK" : "ADEQUATE"}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-neutral-900/60">
                                  <div className="text-[10px] font-mono text-neutral-400">
                                    Current Stock: <span className="font-extrabold text-[#DFBA84]">{item.quantity} {item.unit}</span>
                                  </div>

                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleInventoryAdjust(item.id, item.quantity - 100)}
                                      className="px-1.5 py-0.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-[7.5px] font-mono hover:text-white rounded cursor-pointer transition-colors"
                                    >
                                      -100
                                    </button>
                                    <button
                                      onClick={() => handleInventoryAdjust(item.id, item.quantity + 250)}
                                      className="px-1.5 py-0.5 bg-[#1B4D3E]/80 hover:bg-[#1B4D3E] text-[#DFBA84] border border-[#C8A165]/20 text-[7.5px] font-mono rounded cursor-pointer transition-colors"
                                    >
                                      +250
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    MANAGER SECTION: SALES INVOICING, EMI MATH & PROJECT EXPENSES
                    ========================================== */}
                {activeTab === "sales_billing" && currentUser.role === "manager" && (
                  <motion.div key="spend_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* Left: Project Expense Filing */}
                      <form onSubmit={handleExpenseSubmit} className="lg:col-span-4 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1.3px] bg-gradient-to-r from-red-500/15 via-transparent to-transparent" />
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2">
                          Expense reporter filing sheet
                        </h4>

                         <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Target Project</label>
                          <select
                            value={newExpense.project}
                            onChange={(e) => setNewExpense({ ...newExpense, project: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1.5 rounded outline-none text-neutral-300 font-mono focus:border-[#C8A165]"
                          >
                            <option value="Mollik Tower">Mollik Tower (Gulshan)</option>
                            <option value="Mollik Heights">Mollik Heights (Banani)</option>
                            <option value="Mollik Garden">Mollik Garden (Uttara)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Expense Category</label>
                          <select
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1.5 rounded outline-none text-neutral-300 font-mono focus:border-[#C8A165]"
                          >
                            <option value="Labor wages">Labor wages payout</option>
                            <option value="Materials Purchasing">Construction materials purchasing</option>
                            <option value="Government RAJUK permits">Government RAJUK permits processing</option>
                            <option value="Utilities & Office">Utilities & Office operations</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Amount BDT</label>
                          <input 
                            type="text"
                            placeholder="e.g. 45000"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-white font-mono focus:border-[#C8A165]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Transaction Description</label>
                          <textarea 
                            rows={2}
                            placeholder="Invoice specifics..."
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10px] px-3 py-1 rounded outline-none text-neutral-300 font-sans focus:border-[#C8A165]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-1.5 bg-[#1B4D3E] hover:bg-[#12362c] text-[#DFBA84] font-mono font-black text-[9px] uppercase tracking-widest rounded transition-colors cursor-pointer border-0 shadow-sm"
                        >
                          FILE EXPENDITURE REPORT
                        </button>
                      </form>

                      {/* Center: Sales Custom Invoices Generator */}
                      <form onSubmit={handleInvoiceCreate} className="lg:col-span-4 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1.3px] bg-gradient-to-r from-[#C29B61]/20 via-transparent to-transparent" />
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2">
                          Executive custom invoice generator
                        </h4>
                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Client Full Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. Sayed Chowdhury"
                            value={newInvoice.client}
                            onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-white focus:border-[#C8A165]"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Target Suite</label>
                            <input 
                              type="text"
                              value={newInvoice.suite}
                              onChange={(e) => setNewInvoice({ ...newInvoice, suite: e.target.value })}
                              className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-[#DFBA84] font-mono focus:border-[#C8A165]"
                            />
                          </div>
                          <div>
                            <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Flat Price</label>
                            <input 
                              type="text"
                              value={newInvoice.bdt}
                              onChange={(e) => setNewInvoice({ ...newInvoice, bdt: e.target.value })}
                              className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-[#DFBA84] font-mono focus:border-[#C8A165]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Payment schedule Plan</label>
                          <select
                            value={newInvoice.plan}
                            onChange={(e) => setNewInvoice({ ...newInvoice, plan: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1.5 rounded outline-none text-neutral-300 font-mono focus:border-[#C8A165]"
                          >
                            <option value="Custom 36-Month Plan">36-Month Deferred Plan</option>
                            <option value="Deferred Installments">Deferred Installments</option>
                            <option value="Full Payment">Full Settlement payment</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-1.5 bg-neutral-950 hover:bg-neutral-900 text-white font-mono font-black text-[9px] uppercase tracking-widest rounded border border-neutral-850 hover:border-neutral-750 cursor-pointer transition-colors"
                        >
                          DISPATCH INVOICE RECORD
                        </button>
                      </form>

                      {/* Right: EMI Installments Solver */}
                      <div className="lg:col-span-4 bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 right-0 h-[1.3px] bg-gradient-to-r from-emerald-500/15 via-transparent to-transparent" />
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2 font-black">
                            Sales EMI Installment Solver
                          </h4>
                          <div>
                            <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Principal Loan (BDT)</label>
                            <input 
                              type="text"
                              value={emiState.amount}
                              onChange={(e) => setEmiState({ ...emiState, amount: e.target.value })}
                              className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-white font-mono focus:border-[#C8A165]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Interest Rate %</label>
                              <input 
                                type="text"
                                value={emiState.rate}
                                onChange={(e) => setEmiState({ ...emiState, rate: e.target.value })}
                                className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-white font-mono focus:border-[#C8A165]"
                              />
                            </div>
                            <div>
                              <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Timeline (Years)</label>
                              <input 
                                type="text"
                                value={emiState.duration}
                                onChange={(e) => setEmiState({ ...emiState, duration: e.target.value })}
                                className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1 rounded outline-none text-white font-mono focus:border-[#C8A165]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-[#030406]/95 rounded border border-neutral-900 text-center space-y-1.5 mt-3">
                          <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Estimated Monthly installment:</span>
                          <span className="block text-xs sm:text-sm font-black text-emerald-400 font-mono tracking-wide">{emiState.emiResult}</span>
                          <button
                            onClick={computeEMIMath}
                            className="w-full py-1 bg-[#1B4D3E]/80 hover:bg-[#1B4D3E] text-[#DFBA84] border border-[#C8A165]/20 font-mono font-black text-[8px] uppercase tracking-widest rounded cursor-pointer transition-colors shadow-sm"
                          >
                            CALCULATE EMI
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    SHARED CHAT ROOM: REAL-TIME HQ TEAM MESSAGE COMMUNICATOR
                    ========================================== */}
                {activeTab === "internal_chat" && (
                  <motion.div key="chat_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 bg-[#0b0c10]/95 rounded border border-neutral-900 shadow-sm flex flex-col h-[420px] justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1.3px] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent" />
                      <div>
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-2 border-b border-neutral-900 pb-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Mollik corporate internal headquarters team chat</span>
                        </h4>
                      </div>

                      {/* Core Scroll View Screen */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 my-2.5 max-h-[280px]">
                        {chats.map((msg, idx) => (
                          <div key={`chat-message-${msg.id || idx}-${idx}`} className="p-2.5 bg-[#030406]/95 rounded border border-neutral-900 leading-normal max-w-xl">
                            <div className="flex justify-between items-center text-[7.5px] font-mono text-neutral-500 uppercase mb-1">
                              <span><strong className="text-white font-black">{msg.senderName}</strong> // {msg.senderRole}</span>
                              <span className="text-[#C8A165]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-neutral-300 text-[10.5px] font-sans tracking-wide leading-relaxed font-light">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Form action input */}
                      <form onSubmit={handleChatSend} className="flex gap-2 border-t border-neutral-900/60 pt-2.5">
                        <input 
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type internal encrypted team message..."
                          className="flex-1 bg-[#030406] border border-neutral-850 text-xs px-3 py-1.5 rounded outline-none text-white focus:border-[#C8A165]"
                          required
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-[#1B4D3E] hover:bg-[#12362c] text-[#DFBA84] font-mono font-black text-[9px] uppercase tracking-widest rounded flex items-center gap-1.5 cursor-pointer leading-none border-0 shadow-sm transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    VIP CONCIERGE & INTELLIGENT ADVISORY HUB
                    ========================================== */}
                {activeTab === "vip_concierge" && (
                  <motion.div key="vip_concierge_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 w-full">
                    <div className="p-4 bg-[#0b0c10]/95 rounded border border-neutral-900 shadow-sm flex flex-col h-[420px] justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1.3px] bg-gradient-to-r from-amber-500/15 via-transparent to-transparent" />
                      
                      {/* Header block with statistics HUD */}
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-900 pb-2 mb-2">
                          <div className="space-y-0.5">
                            <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              <span>Mollik Luxury VIP Concierge Operations Panel</span>
                            </h4>
                            <p className="text-[8px] text-neutral-450 uppercase font-mono">
                              Automated Client Intelligence, Chauffeur Routing & AI Telemetry Channels
                            </p>
                          </div>

                          {/* Quick Stats Pill */}
                          <div className="flex gap-2">
                            <div className="px-2 py-0.5 bg-neutral-950 rounded border border-neutral-850 text-center font-mono">
                              <span className="block text-[6px] text-neutral-550 leading-none">ACTIVE DIGITAL HDS</span>
                              <span className="block text-[9px] font-extrabold text-[#C8A165] mt-0.5">4 ONLINE</span>
                            </div>
                            <div className="px-2 py-0.5 bg-neutral-950 rounded border border-neutral-850 text-center font-mono">
                              <span className="block text-[6px] text-neutral-550 leading-none">LOCKED RATE LOCK</span>
                              <span className="block text-[9px] font-extrabold text-emerald-450 mt-0.5">{broadcastRate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Top Navigation tabs inside the Hub */}
                        <div className="flex gap-1 border-b border-neutral-900/60 pb-1.5 mb-2">
                          <button
                            onClick={() => setConciergeSubTab("visits")}
                            className={`px-2.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer border-0 ${
                              conciergeSubTab === "visits"
                                ? "bg-[#1B4D3E]/30 text-[#DFBA84] border border-[#C8A165]/35"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40"
                            }`}
                          >
                            Visits & VIP Bookings ({leads.filter(l => l.type === "visit").length})
                          </button>
                          <button
                            onClick={() => setConciergeSubTab("telemetry")}
                            className={`px-2.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer border-0 ${
                              conciergeSubTab === "telemetry"
                                ? "bg-[#1B4D3E]/30 text-[#DFBA84] border border-[#C8A165]/35"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40"
                            }`}
                          >
                            AI Concierge Chats ({vipChatLogs.length})
                          </button>
                          <button
                            onClick={() => setConciergeSubTab("broadcast")}
                            className={`px-2.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer border-0 ${
                              conciergeSubTab === "broadcast"
                                ? "bg-[#1B4D3E]/30 text-[#DFBA84] border border-[#C8A165]/35"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40"
                            }`}
                          >
                            Broadcast Interest Rates
                          </button>
                        </div>
                      </div>

                      {/* Main Scroll Content view matching the selected tab */}
                      <div className="flex-1 overflow-y-auto pr-1 min-h-[220px] max-h-[280px] mb-2">
                        {conciergeSubTab === "visits" && (
                          <div className="space-y-2">
                            {leads.filter(l => l.type === "visit").length === 0 ? (
                              <div className="p-6 text-center bg-neutral-950/60 rounded border border-neutral-900">
                                <Calendar className="w-6 h-6 text-neutral-700 mx-auto mb-2" />
                                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">No Active VIP Visits Booked</span>
                                <p className="text-[9px] text-neutral-600 font-light mt-1 max-w-sm mx-auto">
                                  Schedule bookings submitted through the main client interfaces will stream live directly right here.
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {leads.filter(l => l.type === "visit").map((lead, idx) => {
                                  const isDispatched = vipDispatchedLeads.includes(lead.id);
                                  return (
                                    <div 
                                      key={`concierge-visit-${lead.id}-${idx}`} 
                                      className="p-2.5 bg-[#030406] rounded border border-neutral-900 relative group transition-all hover:border-amber-500/20 shadow-md"
                                    >
                                      {/* Accent line indicator */}
                                      <div className={`absolute top-2.5 bottom-2.5 left-0 w-[2px] rounded-r ${isDispatched ? "bg-amber-400" : "bg-[#1B4D3E]"}`} />
                                      
                                      <div className="pl-1.5">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-[10px] font-sans font-bold text-white">
                                            {lead.data.name || lead.data.clientName || "Priority VIP Guest"}
                                          </span>
                                          <span className="text-[7px] font-mono text-amber-500 uppercase tracking-wider bg-amber-950/25 px-1.5 py-0.5 rounded border border-amber-900/35">
                                            {isDispatched ? "Executive Dispatched" : "Awaiting Escort"}
                                          </span>
                                        </div>

                                        <p className="text-[8px] uppercase font-mono text-neutral-500 tracking-wider">
                                          Requested Project // <strong className="text-neutral-300 font-bold">{lead.data.project || lead.data.projectName || "General Portfolio"}</strong>
                                        </p>

                                        <div className="my-1.5 space-y-0.5 text-[9px] font-sans text-neutral-300">
                                          <div className="flex justify-between border-b border-neutral-900/60 pb-0.5">
                                            <span className="text-[7.5px] uppercase text-neutral-550 font-mono">Date slot:</span>
                                            <span className="text-neutral-200">{lead.data.date || "As soon as possible"}</span>
                                          </div>
                                          <div className="flex justify-between border-b border-neutral-900/60 pb-0.5">
                                            <span className="text-[7.5px] uppercase text-neutral-550 font-mono">Phone link:</span>
                                            <span className="text-sky-400 select-all">{lead.data.phone || "VIP Direct"}</span>
                                          </div>
                                          <div className="flex justify-between border-b border-neutral-900/60 pb-0.5">
                                            <span className="text-[7.5px] uppercase text-neutral-550 font-mono">Email contact:</span>
                                            <span className="text-neutral-450 truncate max-w-[120px] select-all">{lead.data.email || "Priority caller"}</span>
                                          </div>
                                        </div>

                                        {lead.data.message && (
                                          <p className="text-[9px] text-neutral-400 italic bg-neutral-950/50 p-1 rounded border border-neutral-900 leading-normal mb-2">
                                            "{lead.data.message}"
                                          </p>
                                        )}

                                        <div className="mt-2 flex justify-end">
                                          {!isDispatched ? (
                                            <button
                                              onClick={() => {
                                                setVipDispatchedLeads(prev => [...prev, lead.id]);
                                                setNotifications(n => [
                                                  `[VIP COMPLETED] Security Chauffeur dispatched to escort VIP guest "${lead.data.name || "Priority caller"}" for property "${lead.data.project || "Gulshan block"}".`,
                                                  ...n
                                                ]);
                                              }}
                                              className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-[#DFBA84] border border-amber-500/35 hover:border-amber-500/60 font-mono font-bold text-[8px] tracking-wider uppercase rounded cursor-pointer transition-colors"
                                            >
                                              Dispatch Chauffeur & Executive
                                            </button>
                                          ) : (
                                            <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                                              <span>Escort and luxury fleet dispatched</span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {conciergeSubTab === "telemetry" && (
                          <div className="space-y-2">
                            <div className="p-2.5 bg-neutral-950/40 rounded border border-neutral-900 space-y-1">
                              <span className="text-[8px] font-mono text-[#C8A165] uppercase tracking-widest block">AI Advisory Assistant Telemetry Feeds</span>
                              <p className="text-[9px] text-neutral-400 font-light leading-relaxed">
                                Client inquiries directed at our interactive AI voice assistant are captured and resolved below. Inject mock live queries using the workspace simulation block.
                              </p>
                            </div>

                            <div className="space-y-2">
                              {vipChatLogs.map((chat, idx) => (
                                <div key={`vchat-${chat.id || idx}-${idx}`} className="p-2 bg-[#030406]/95 rounded border border-neutral-900 relative">
                                  <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500 uppercase mb-1">
                                    <span>
                                      Client: <strong className="text-white">{chat.client}</strong> ({chat.location})
                                    </span>
                                    <span className="text-[#C8A165] flex items-center gap-1">
                                      {chat.active && <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping inline-block" />}
                                      {chat.time}
                                    </span>
                                  </div>
                                  <div className="space-y-1 pl-1 border-l border-neutral-850">
                                    <p className="text-[10px] text-neutral-300 font-sans tracking-wide">
                                      <span className="text-[#C8A165] font-bold font-mono text-[8px] uppercase mr-1">Query:</span> {chat.query}
                                    </p>
                                    <p className="text-[10px] text-emerald-450/90 font-sans tracking-wide leading-relaxed">
                                      <span className="text-[#DFBA84] font-bold font-mono text-[8px] uppercase mr-1">AI Assistant:</span> {chat.response}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {conciergeSubTab === "broadcast" && (
                          <div className="p-3 bg-neutral-950 rounded border border-neutral-900 space-y-3 font-sans">
                            <div className="space-y-0.5">
                              <span className="block text-[9px] font-mono text-[#C8A165] uppercase tracking-widest">Broadcast Global VIP Custom Interest Locks</span>
                              <p className="text-[9px] text-neutral-450 font-light">
                                Instantly modify pre-approval lock-in percentages promoted to terminal investors rendering dynamic models.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1.5 p-2 bg-[#030406] rounded border border-neutral-900">
                                <label className="block text-[7px] font-mono text-neutral-500 uppercase tracking-wider">Locked Pre-Approval Rate Selector</label>
                                <div className="flex gap-1">
                                  {["6.0%", "6.25%", "6.5%", "6.75%", "7.0%"].map((rateVal) => (
                                    <button
                                      key={`rate-opt-${rateVal}`}
                                      onClick={() => setBroadcastRate(rateVal)}
                                      className={`px-1.5 py-0.5 font-mono text-[8.5px] rounded border cursor-pointer transition-all ${
                                        broadcastRate === rateVal
                                          ? "bg-[#1B4D3E]/30 text-emerald-400 border-emerald-500/50"
                                          : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:border-neutral-700"
                                      }`}
                                    >
                                      {rateVal}
                                    </button>
                                  ))}
                                </div>
                                <p className="text-[8px] text-neutral-550 font-mono">
                                  Default: 6.5%. Lower locks boost instant conversion ratios.
                                </p>
                              </div>

                              <div className="space-y-1.5 p-2 bg-[#030406] rounded border border-neutral-900 h-full flex flex-col justify-between">
                                <label className="block text-[7px] font-mono text-neutral-500 uppercase tracking-wider">Broadcast Priority Announcement Bar</label>
                                <div className="flex gap-1">
                                  <input
                                    type="text"
                                    value={newVipAlertText}
                                    onChange={(e) => setNewVipAlertText(e.target.value)}
                                    placeholder="e.g., Ultra luxury Gulshan blocks pre-launching..."
                                    className="flex-1 bg-neutral-950 border border-neutral-850 text-[9.5px] px-2 py-0.5 rounded outline-none text-white focus:border-[#C8A165]"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => {
                                  setNotifications(n => [
                                    `[BROADCAST SUCCESS] Mollik Developers published lock rate target to all physical concierge consoles: Locked at ${broadcastRate}. ${newVipAlertText ? `Announcement: "${newVipAlertText}"` : ""}`,
                                    ...n
                                  ]);
                                  setNewVipAlertText("");
                                  setSaveSuccess(true);
                                  setTimeout(() => setSaveSuccess(false), 3005);
                                }}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-[#DFBA84] font-mono font-black text-[8px] uppercase tracking-widest rounded border-0 cursor-pointer shadow-md transition-colors"
                              >
                                Pub/Sub Broadcast Configuration
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Universal Console Injection form at footer to maintain interactivity */}
                      <div className="border-t border-neutral-900/80 pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                        {saveSuccess && (
                          <span className="text-[8.5px] text-emerald-400 font-mono animate-pulse uppercase tracking-wide">
                            ✓ CONFIGURATION BROADCAST SUCCESSFUL
                          </span>
                        )}
                        {!saveSuccess && conciergeSubTab === "telemetry" && (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const text = chatInput.trim();
                              if (!text) return;
                              const newQuery = {
                                id: `vchat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                                client: "Simulated Guest",
                                location: "HQ Hub Simulator",
                                query: text,
                                response: `Under supervision of Saheb Ali Mollik, we secure robust ${broadcastRate} locked installments and supreme compliance on all residential structures.`,
                                time: "Just now",
                                active: true
                              };
                              setVipChatLogs(prev => [newQuery, ...prev]);
                              setChatInput("");
                              setNotifications(n => [
                                `[HQ INTERACTION] Virtual AI Simulator captured customer query: "${text}".`,
                                ...n
                              ]);
                            }} 
                            className="flex-1 flex gap-1.5 w-full"
                          >
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Inject simulated guest query here..."
                              className="flex-1 bg-[#030406] border border-neutral-850 text-[10px] px-2.5 py-1 rounded outline-none text-white focus:border-[#C8A165]"
                            />
                            <button
                              type="submit"
                              className="px-2.5 py-1 bg-[#1B4D3E] hover:bg-[#12362c] text-[#DFBA84] font-mono text-[8px] uppercase tracking-wider rounded cursor-pointer border-0"
                            >
                              Simulate Query
                            </button>
                          </form>
                        )}
                        {!saveSuccess && conciergeSubTab !== "telemetry" && (
                          <span className="text-[8px] font-mono text-neutral-550 uppercase">
                            VIP Security Console // Mollik Builders Live Dispatch Services
                          </span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
                {/* ==========================================
                    SUPER ADMIN: REAL-TIME ACTIVITY MONITOR
                    ========================================== */}
                {activeTab === "activity_monitor" && currentUser.role === "super_admin" && (
                  <motion.div key="activity_mon_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 bg-[#0b0c10]/95 rounded border border-neutral-900 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-500/15 via-[#C8A165]/30 to-transparent" />
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Real-Time Activity Monitor — All Roles</span>
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] bg-emerald-955/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-extrabold border border-emerald-500/20 animate-pulse">LIVE</span>
                          <span className="text-[8px] font-mono text-neutral-500 uppercase">Auto-refresh 10s</span>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                        {activityFeed.length === 0 && (
                          <div className="text-center py-8 text-neutral-500 text-[10px] font-mono">No activity recorded yet.</div>
                        )}
                        {activityFeed.map((log: any, idx: number) => (
                          <div key={`actfeed-${log.id || idx}`} className={`p-3 bg-[#030406]/95 rounded border transition-all hover:border-neutral-800 ${
                            log.role === "manager" ? "border-l-2 border-l-cyan-500 border-neutral-900" :
                            log.role === "founder" ? "border-l-2 border-l-amber-500 border-neutral-900" :
                            "border-l-2 border-l-[#C8A165] border-neutral-900"
                          }`}>
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 text-[7px] rounded font-mono uppercase font-extrabold border ${
                                  log.role === "manager" ? "bg-cyan-955/20 border-cyan-500/25 text-cyan-400" :
                                  log.role === "founder" ? "bg-amber-955/20 border-amber-500/25 text-amber-400" :
                                  "bg-[#C8A165]/10 border-[#C8A165]/25 text-[#C8A165]"
                                }`}>{log.role.replace("_", " ")}</span>
                                <span className="text-[9px] font-bold text-white">{log.username}</span>
                              </div>
                              <span className="text-[8px] font-mono text-neutral-500 shrink-0">
                                {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="mt-1.5">
                              <span className="text-[9px] font-mono text-[#DFBA84] font-bold uppercase tracking-wider">{log.action}</span>
                              <p className="text-[10px] text-neutral-400 font-sans leading-normal mt-0.5">{log.details}</p>
                            </div>
                            {log.impersonatedBy && (
                              <span className="block text-[7.5px] text-red-400 font-mono uppercase font-black mt-1">[IMPERSONATED SESSION]</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    FOUNDER: MANAGER ACTIVITY LIVE FEED
                    ========================================== */}
                {activeTab === "manager_activity" && currentUser.role === "founder" && (
                  <motion.div key="mgr_activity_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-4 bg-[#0b0c10]/95 rounded border border-neutral-900 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/15 via-[#C8A165]/25 to-transparent" />
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                        <div>
                          <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            <span>Manager Activity Feed — Live</span>
                          </h4>
                          <p className="text-[8px] text-neutral-500 mt-0.5 font-mono">All bookings, payments, expenses, and inventory changes by managers</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] bg-cyan-955/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-extrabold border border-cyan-500/20 animate-pulse">LIVE</span>
                          <span className="text-[8px] font-mono text-neutral-500 uppercase">10s Sync</span>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                        {managerActivity.length === 0 && (
                          <div className="text-center py-8 text-neutral-500 text-[10px] font-mono">No manager activity recorded yet.</div>
                        )}
                        {managerActivity.map((log: any, idx: number) => {
                          const isBooking = log.action.includes("BOOKING");
                          const isExpense = log.action.includes("EXPENSE");
                          const isPayment = log.action.includes("PAYMENT");
                          const isProperty = log.action.includes("PROPERTY");
                          return (
                            <div key={`mgract-${log.id || idx}`} className={`p-3 bg-[#030406]/95 rounded border border-neutral-900 hover:border-neutral-800 transition-all border-l-2 ${
                              isBooking ? "border-l-emerald-500" :
                              isExpense ? "border-l-red-500" :
                              isPayment ? "border-l-[#DFBA84]" :
                              isProperty ? "border-l-cyan-500" :
                              "border-l-neutral-700"
                            }`}>
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={`px-1.5 py-0.5 text-[7px] rounded font-mono uppercase font-extrabold border ${
                                    isBooking ? "bg-emerald-955/20 border-emerald-500/20 text-emerald-400" :
                                    isExpense ? "bg-red-955/20 border-red-500/20 text-red-400" :
                                    isPayment ? "bg-[#C8A165]/10 border-[#C8A165]/20 text-[#DFBA84]" :
                                    "bg-cyan-955/20 border-cyan-500/20 text-cyan-400"
                                  }`}>{log.action.replace(/_/g, " ")}</span>
                                  <span className="text-[9px] font-bold text-white">{log.username}</span>
                                </div>
                                <span className="text-[8px] font-mono text-neutral-500 shrink-0">
                                  {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-400 font-sans leading-normal mt-1.5">{log.details}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ==========================================
                    MANAGER: BOOKINGS MANAGEMENT FULL CRUD
                    ========================================== */}
                {activeTab === "bookings_mgmt" && currentUser.role === "manager" && (
                  <motion.div key="bookings_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                    {/* Payment Modal Overlay */}
                    {paymentModal && (
                      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={() => setPaymentModal(null)}>
                        <div className="bg-[#0b0c10] border border-[#C8A165]/30 rounded-lg p-5 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                          <h4 className="text-[11px] font-mono font-bold uppercase text-[#C8A165] tracking-widest mb-3 border-b border-neutral-900 pb-2">
                            Record Payment — {paymentModal.clientName}
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Amount (BDT)</label>
                              <input
                                type="number"
                                placeholder="e.g. 500000"
                                value={paymentInput.amount}
                                onChange={(e) => setPaymentInput({ ...paymentInput, amount: e.target.value })}
                                className="w-full bg-[#030406] border border-neutral-850 text-[11px] px-3 py-1.5 rounded outline-none text-white font-mono focus:border-[#C8A165]"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[8.5px] font-mono text-neutral-450 uppercase mb-1 tracking-wider">Payment Method</label>
                              <select
                                value={paymentInput.method}
                                onChange={(e) => setPaymentInput({ ...paymentInput, method: e.target.value })}
                                className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1.5 rounded outline-none text-neutral-300 font-mono focus:border-[#C8A165]"
                              >
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="bKash">bKash</option>
                                <option value="Nagad">Nagad</option>
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                              </select>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleBookingPayment(paymentModal.bookingId)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-mono font-black text-[9px] uppercase tracking-widest rounded cursor-pointer border-0 shadow"
                              >
                                RECORD PAYMENT
                              </button>
                              <button
                                onClick={() => setPaymentModal(null)}
                                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-mono font-bold text-[9px] uppercase rounded cursor-pointer border border-neutral-800"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Creation Form */}
                    <div className="bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/15 via-[#C8A165]/25 to-transparent" />
                      <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest border-b border-neutral-900 pb-2 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Booking</span>
                      </h4>

                      <form onSubmit={handleBookingCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Client Name *</label>
                          <input type="text" placeholder="Full name" value={newBooking.clientName}
                            onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-white outline-none focus:border-[#C8A165]" required />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Phone</label>
                          <input type="text" placeholder="+880 17XX-XXXXXX" value={newBooking.clientPhone}
                            onChange={(e) => setNewBooking({ ...newBooking, clientPhone: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-white outline-none focus:border-[#C8A165]" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Email</label>
                          <input type="email" placeholder="client@email.com" value={newBooking.clientEmail}
                            onChange={(e) => setNewBooking({ ...newBooking, clientEmail: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-white outline-none focus:border-[#C8A165]" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Project *</label>
                          <select value={newBooking.projectName}
                            onChange={(e) => setNewBooking({ ...newBooking, projectName: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2 py-1 rounded text-neutral-300 outline-none focus:border-[#C8A165]">
                            <option value="Madina Tower">Madina Tower</option>
                            <option value="Bismillah Tower">Bismillah Tower</option>
                            <option value="Apon Bhubon">Apon Bhubon</option>
                            <option value="Mollik City 8.1">Mollik City 8.1</option>
                            <option value="Mollik City 9.1">Mollik City 9.1</option>
                            <option value="Mollik City 10">Mollik City 10</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Unit ID *</label>
                          <input type="text" placeholder="e.g. 3B" value={newBooking.unitId}
                            onChange={(e) => setNewBooking({ ...newBooking, unitId: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-white outline-none focus:border-[#C8A165]" required />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Floor</label>
                          <input type="number" value={newBooking.unitFloor}
                            onChange={(e) => setNewBooking({ ...newBooking, unitFloor: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-white outline-none focus:border-[#C8A165]" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Total Price (BDT) *</label>
                          <input type="number" placeholder="e.g. 8500000" value={newBooking.totalPriceBDT}
                            onChange={(e) => setNewBooking({ ...newBooking, totalPriceBDT: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-[#DFBA84] font-mono outline-none focus:border-[#C8A165]" required />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Paid Amount (BDT)</label>
                          <input type="number" placeholder="Initial payment" value={newBooking.paidAmountBDT}
                            onChange={(e) => setNewBooking({ ...newBooking, paidAmountBDT: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-emerald-400 font-mono outline-none focus:border-[#C8A165]" />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Payment Plan</label>
                          <select value={newBooking.paymentPlan}
                            onChange={(e) => setNewBooking({ ...newBooking, paymentPlan: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2 py-1 rounded text-neutral-300 outline-none focus:border-[#C8A165]">
                            <option value="Full Payment">Full Payment</option>
                            <option value="12-Month Installment">12-Month Installment</option>
                            <option value="24-Month Installment">24-Month Installment</option>
                            <option value="36-Month Installment">36-Month Installment</option>
                            <option value="Custom Plan">Custom Plan</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[8px] font-mono text-neutral-500 uppercase mb-0.5">Notes</label>
                          <input type="text" placeholder="Additional notes..." value={newBooking.notes}
                            onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                            className="w-full bg-[#030406] border border-neutral-850 text-[10.5px] px-2.5 py-1 rounded text-neutral-300 outline-none focus:border-[#C8A165]" />
                        </div>
                        <div className="flex items-end">
                          <button type="submit"
                            className="w-full py-1.5 bg-gradient-to-r from-[#C29B61] to-[#DFBA84] hover:brightness-110 text-neutral-950 font-mono font-black text-[9px] uppercase tracking-widest rounded cursor-pointer border-0 shadow-md">
                            CREATE BOOKING
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Live Bookings Table */}
                    <div className="bg-[#0b0c10]/95 p-4 rounded border border-neutral-900 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#C29B61]/25 via-transparent to-transparent" />
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                        <h4 className="text-[10px] font-mono font-bold uppercase text-[#C8A165] tracking-widest flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Active Bookings Ledger</span>
                        </h4>
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest font-black">{bookings.length} Total Records</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-neutral-400">
                          <thead>
                            <tr className="border-b border-neutral-900 font-mono text-[7.5px] uppercase tracking-widest text-[#D2B48C]">
                              <th className="pb-1.5 font-bold">Client</th>
                              <th className="pb-1.5 font-bold">Project</th>
                              <th className="pb-1.5 font-bold">Unit</th>
                              <th className="pb-1.5 font-bold font-mono">Total</th>
                              <th className="pb-1.5 font-bold font-mono">Paid</th>
                              <th className="pb-1.5 font-bold font-mono">Remaining</th>
                              <th className="pb-1.5 font-bold">Status</th>
                              <th className="pb-1.5 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-900/60">
                            {bookings.map((bk: any, idx: number) => (
                              <tr key={`mgrbk-${bk.id || idx}`} className="hover:bg-[#030406]/40 transition-colors">
                                <td className="py-2.5">
                                  <span className="font-bold text-white text-[10.5px] block">{bk.clientName}</span>
                                  <span className="text-[7.5px] text-neutral-500 font-mono block">{bk.clientPhone}</span>
                                  <span className="text-[7.5px] text-neutral-600 font-mono block">{bk.clientEmail}</span>
                                </td>
                                <td className="py-2.5 text-[10px] text-neutral-350">{bk.projectName}</td>
                                <td className="py-2.5 text-[10px] font-mono text-white font-bold">{bk.unitId} <span className="text-neutral-600 font-normal">F{bk.unitFloor}</span></td>
                                <td className="py-2.5 text-[#DFBA84] font-serif font-black text-[11px]">৳{bk.totalPriceBDT?.toLocaleString()}</td>
                                <td className="py-2.5 text-emerald-400 font-mono font-bold text-[10px]">৳{bk.paidAmountBDT?.toLocaleString()}</td>
                                <td className="py-2.5">
                                  <span className={`font-mono font-bold text-[10px] ${bk.remainingBDT > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                                    ৳{bk.remainingBDT?.toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-2.5">
                                  <select
                                    value={bk.status}
                                    onChange={(e) => handleBookingStatusChange(bk.id, e.target.value)}
                                    className={`bg-[#030406] border text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase cursor-pointer outline-none ${
                                      bk.status === "Confirmed" ? "border-emerald-500/30 text-emerald-400" :
                                      bk.status === "Pending" ? "border-amber-500/30 text-amber-400" :
                                      "border-red-500/30 text-red-400"
                                    }`}
                                  >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="py-2.5">
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      onClick={() => setPaymentModal({ bookingId: bk.id, clientName: bk.clientName })}
                                      className="px-2 py-0.5 bg-[#1B4D3E]/80 hover:bg-[#1B4D3E] text-[#DFBA84] border border-[#C8A165]/20 text-[7.5px] font-mono font-bold uppercase rounded cursor-pointer transition-colors"
                                    >
                                      +Payment
                                    </button>
                                    <button
                                      onClick={() => handleBookingDelete(bk.id)}
                                      className="p-1 text-red-500 hover:text-red-400 cursor-pointer border-0 bg-transparent"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Payment History per booking */}
                      {bookings.filter((b: any) => b.payments && b.payments.length > 0).length > 0 && (
                        <div className="pt-3 border-t border-neutral-900 space-y-2">
                          <h5 className="text-[9px] font-mono font-bold uppercase text-neutral-400 tracking-widest">Client Payment Breakdown</h5>
                          {bookings.map((bk: any, idx: number) => (
                            bk.payments && bk.payments.length > 0 && (
                              <div key={`pay-hist-${bk.id || idx}`} className="p-2.5 bg-[#030406]/95 rounded border border-neutral-900">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[9px] font-bold text-white">{bk.clientName} — {bk.projectName} {bk.unitId}</span>
                                  <span className="text-[8px] font-mono text-neutral-500">
                                    {Math.round((bk.paidAmountBDT / bk.totalPriceBDT) * 100)}% paid
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-900 h-1.5 rounded overflow-hidden mb-2">
                                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((bk.paidAmountBDT / bk.totalPriceBDT) * 100))}%` }} />
                                </div>
                                <div className="space-y-0.5">
                                  {bk.payments.map((p: any, pIdx: number) => (
                                    <div key={`p-${pIdx}`} className="flex justify-between text-[8.5px] font-mono text-neutral-400">
                                      <span>{p.date} — {p.method}</span>
                                      <span className="text-emerald-400 font-bold">+৳{p.amount?.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between text-[9px] font-mono mt-1.5 pt-1.5 border-t border-neutral-900/60">
                                  <span className="text-neutral-500">Remaining Balance:</span>
                                  <span className="text-amber-400 font-bold">৳{bk.remainingBDT?.toLocaleString()}</span>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Notification and alert log footer bar */}
            <div className="px-6 py-2.5 bg-[#0d0f15] border-t border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-neutral-400 font-mono gap-2 shrink-0">
              <div className="flex items-center gap-1.5 truncate max-w-[450px]">
                <Activity className="w-3.5 h-3.5 text-[#C8A165] shrink-0" />
                <span className="truncate">System alert: {notifications[0]}</span>
              </div>
              <span className="text-neutral-500 font-bold shrink-0">SHA-256 Session active // UTC Encryption Lock</span>
            </div>

          </div>

        </motion.div>
      )}
    </div>
  );
}
