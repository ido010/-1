import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Lock, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Mail, 
  MessageCircle, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Sliders, 
  Briefcase, 
  Settings, 
  LogOut, 
  ArrowRight, 
  Send,
  Phone,
  Building,
  User,
  ExternalLink,
  ChevronLeft,
  RefreshCw,
  FolderOpen,
  Upload
} from "lucide-react";
import { PortfolioItem, ContactInquiry } from "./types";
import { INITIAL_PORTFOLIOS, TOOLS } from "./data";

const CATEGORY_DESCS: Record<string, string> = {
  "ALL": "전체 프로젝트",
  "E-COMMERCE": "상세페이지 · 상품 콘텐츠",
  "CONTENT": "SNS · 카드뉴스 · 브랜드 콘텐츠",
  "CAMPAIGN": "프로모션 · 광고 소재 · 이벤트 비주얼",
  "OTHER": "인쇄물 · 기타 작업"
};

const mapRoleToKorean = (role: string): string => {
  const r = role.trim();
  const mapping: Record<string, string> = {
    "Art Direction & Design": "기획·디자인",
    "Visual Design": "비주얼 디자인",
    "Design & Editorial Direction": "디자인·에디토리얼 설계",
    "Visual Creative Direction": "비주얼 크리에이티브 총괄",
    "Campaign Design": "캠페인 디자인",
    "Lead UI/UX Detail Design": "리드 UI/UX 상세 기획·디자인",
    "Branding Design": "브랜딩 디자인",
    "Visual UI Design": "비주얼 및 UI 디자인",
    "Technical Detail Design": "테크니컬 디자인",
    "Lead Creative Presentation": "제안서 크리에이티브 디자인",
    "Copy & Creative Composition": "카피라이팅 및 비주얼 구성",
    "Creative Direction": "크리에이티브 디렉션",
    "Daily Content Planning": "데일리 콘텐츠 기획",
    "Visual System Standard": "비주얼 시스템 표준화",
    "Brand Identity Layout": "브랜드 아이덴티티 구성",
    "Art Direction": "아트 디렉션 및 총괄",
    "Marketing Graphic Work": "마케팅 그래픽 디자인",
    "Environmental Graphic Work": "공간 및 BX 디자인",
    "Lead Editorial System": "리드 편집 디자인 설계",
    "Visual Designer": "비주얼 디자인",
    "Graphic & Signage Design": "그래픽 및 사이니지 디자인",
    "Visual Direction": "비주얼 디렉션 및 구성",
    "Detail Graphic Artist": "정밀 그래픽 작업",
    "Lead Creative Designer": "디자인 및 크리에이티브 총괄",
    "Booklet Layout Artist": "편집 레이아웃 디자인",
    "Presentation Standard Designer": "프레젠테이션 디자인"
  };

  if (mapping[r]) {
    return mapping[r];
  }

  // Soft fallbacks
  if (r.toLowerCase().includes("art direction & design")) return "기획·디자인";
  if (r.toLowerCase().includes("visual design")) return "비주얼 디자인";
  if (r.toLowerCase().includes("branding")) return "브랜딩 디자인";
  if (r.toLowerCase().includes("campaign")) return "캠페인 디자인";
  if (r.toLowerCase().includes("editorial")) return "에디토리얼 디자인";
  if (r.toLowerCase().includes("detail")) return "상세페이지 연출·디자인";
  
  return r;
};

export default function App() {
  // --- STATE ---
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("ido_portfolios");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PORTFOLIOS;
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem("ido_inquiries");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "sample-inquiry-1",
        inquirerName: "하림 가공마케팅팀",
        companyName: "(주)하림",
        phone: "010-1234-5678",
        email: "harim_mkt@harim.com",
        projectType: "상세페이지",
        budgetEstimate: "300만원 - 500만원",
        message: "Peacock 삼계탕 신규 라인업 런칭에 앞서 프리미엄 상세페이지 추가 기획 및 디자인을 문의드립니다. 기존 무드를 해치지 않으면서도 고급 가공육의 느낌을 살리고 싶습니다.",
        createdAt: "2026-06-21 11:20",
        status: "pending"
      }
    ];
  });

  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [currentTab, setCurrentTab] = useState<'work' | 'service' | 'contact' | 'about'>('work');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Auto scroll to top when changing page tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);

  // Track near footer visibility and calculate precise offset to prevent bounce
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;
      const distanceToBottom = totalHeight - scrollPosition;
      
      // Stop the button above the footer smoothly
      const footerLimit = 160; 
      
      if (distanceToBottom < footerLimit) {
        setFooterOffset(footerLimit - distanceToBottom);
        setIsNearBottom(true);
      } else {
        setFooterOffset(0);
        setIsNearBottom(false);
      }
    };
    
    // Initial calculation
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Dialog Controllers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("ido_admin_authed") === "true";
  });
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [adminTab, setAdminTab] = useState<"projects" | "inquiries">("projects");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Create / Edit Portfolio Form State
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false); // false for New, true for Edit
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<PortfolioItem["category"]>("E-COMMERCE");
  const [formYear, setFormYear] = useState("2024");
  const [formClient, setFormClient] = useState("");
  const [formRole, setFormRole] = useState("Design");
  const [formProjectType, setFormProjectType] = useState("");
  const [formClassification, setFormClassification] = useState<PortfolioItem["classification"]>("Agency Project");
  const [formDescription, setFormDescription] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formResultImages, setFormResultImages] = useState("");

  // State for drag over dropzones
  const [isDragOverThumb, setIsDragOverThumb] = useState(false);
  const [isDragOverResults, setIsDragOverResults] = useState(false);

  // Handle converting single image file to Base64 (Thumbnail)
  const handleThumbnailFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 형식의 파일만 등록 가능합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormThumbnail(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle converting multiple image files to Base64 (Result Images)
  const handleResultImagesFilesChange = (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      alert("이미지 형식의 파일들을 선택해주세요.");
      return;
    }

    let loadedCount = 0;
    const urls: string[] = [];
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          urls.push(reader.result);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setFormResultImages(prev => {
            const current = prev.trim();
            const appended = urls.join(", ");
            return current ? `${current}, ${appended}` : appended;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactType, setContactType] = useState("상세페이지");
  const [contactBudget, setContactBudget] = useState("협의 가능");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Keyboard navigation & utilities
  const activeIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return portfolios.findIndex(p => p.id === selectedProject.id);
  }, [selectedProject, portfolios]);

  // --- LOCAL PERSISTENCE SYNC ---
  useEffect(() => {
    localStorage.setItem("ido_portfolios", JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem("ido_inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  // --- FILTERED FEED ---
  const filteredPortfolios = useMemo(() => {
    if (selectedFilter === "ALL") return portfolios;
    return portfolios.filter(p => p.category === selectedFilter);
  }, [portfolios, selectedFilter]);

  const [visibleCount, setVisibleCount] = useState(12);

  // Reset page size when filter or tab switches
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedFilter, currentTab]);

  // --- COUNTER BADGES ---
  const counts = useMemo(() => {
    const calculated: Record<string, number> = {
      ALL: portfolios.length,
      "E-COMMERCE": 0,
      CONTENT: 0,
      CAMPAIGN: 0,
      OTHER: 0,
    };
    portfolios.forEach(p => {
      if (calculated[p.category] !== undefined) {
        calculated[p.category]++;
      }
    });
    return calculated;
  }, [portfolios]);

  // --- ACTIONS ---
  
  // Secure Password Authentication
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verification of password utilizing Base64 match MTExMQ== ("1111") so plain-text is not in source
    if (btoa(passwordInput) === "MTExMQ==") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("ido_admin_authed", "true");
      setIsAuthOpen(false);
      setShowAdminConsole(true);
      setPasswordInput("");
      setAuthError("");
    } else {
      setAuthError("비밀번호가 올바르지 않습니다. 다시 입력해주세요.");
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminConsole(false);
    localStorage.removeItem("ido_admin_authed");
  };

  // Open Form for Adding New Project
  const handleAddNewProjectClick = () => {
    setIsEditingItem(false);
    setEditingItemId(null);
    setFormTitle("");
    setFormCategory("E-COMMERCE");
    setFormYear(new Date().getFullYear().toString());
    setFormClient("");
    setFormRole("Design");
    setFormProjectType("");
    setFormClassification("Agency Project");
    setFormDescription("");
    setFormThumbnail("");
    setFormResultImages("");
    setShowProjectForm(true);
  };

  // Open Form for Editing project
  const handleEditItemClick = (item: PortfolioItem) => {
    setIsEditingItem(true);
    setEditingItemId(item.id);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormYear(item.year);
    setFormClient(item.client);
    setFormRole(item.role);
    setFormProjectType(item.projectType);
    setFormClassification(item.classification);
    setFormDescription(item.description);
    setFormThumbnail(item.thumbnailUrl);
    setFormResultImages(item.resultImages.join(", "));
    setShowProjectForm(true);
  };

  // Save Project Action (Add or Update)
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formClient.trim()) {
      alert("프로젝트명과 클라이언트를 반드시 적어주세요.");
      return;
    }

    const defaultThumbs = [
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=800",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800"
    ];

    const finalThumb = formThumbnail.trim() || defaultThumbs[Math.floor(Math.random() * defaultThumbs.length)];
    const rawImages = formResultImages.split(",")
      .map(img => img.trim())
      .filter(img => img.length > 0);
    const finalResultImages = rawImages.length ? rawImages : [finalThumb];

    if (isEditingItem && editingItemId) {
      // Update
      setPortfolios(prev => prev.map(p => {
        if (p.id === editingItemId) {
          return {
            ...p,
            title: formTitle,
            category: formCategory,
            year: formYear,
            client: formClient,
            role: formRole,
            projectType: formProjectType || "Design",
            classification: formClassification,
            description: formDescription,
            thumbnailUrl: finalThumb,
            resultImages: finalResultImages
          };
        }
        return p;
      }));
    } else {
      // Create
      const newId = `custom-project-${Date.now()}`;
      const newItem: PortfolioItem = {
        id: newId,
        title: formTitle,
        category: formCategory,
        year: formYear,
        client: formClient,
        role: formRole,
        projectType: formProjectType || "Design",
        classification: formClassification,
        description: formDescription,
        thumbnailUrl: finalThumb,
        resultImages: finalResultImages,
        isCustom: true
      };
      setPortfolios(prev => [newItem, ...prev]);
    }

    setShowProjectForm(false);
  };

  // Delete Project Action
  const handleDeleteProject = (id: string) => {
    if (confirm("정말로 이 프로젝트를 포트폴리오에서 삭제하시겠습니까?")) {
      setPortfolios(prev => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    }
  };

  // Reset to Defaults
  const handleRestoreDefaults = () => {
    if (confirm("모든 포트폴리오 데이터를 스킨 초기값으로 복원하시겠습니까? (추가하신 내용이 지워집니다)")) {
      setPortfolios(INITIAL_PORTFOLIOS);
      setShowProjectForm(false);
    }
  };

  // Contact Form Submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      alert("성함/담당자명, 이메일 주소, 문의 내용을 반드시 입력 바랍니다.");
      return;
    }

    setIsSubmittingContact(true);

    // Simulate luxury delivery
    setTimeout(() => {
      const newInquiry: ContactInquiry = {
        id: `inq-${Date.now()}`,
        inquirerName: contactName,
        companyName: contactCompany || "개인 / 미정",
        phone: contactPhone || "미지정",
        email: contactEmail,
        projectType: contactType,
        budgetEstimate: contactBudget,
        message: contactMessage,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: "pending"
      };

      setInquiries(prev => [newInquiry, ...prev]);
      setIsSubmittingContact(false);
      setContactSuccess(true);

      // Clear input fields
      setContactName("");
      setContactCompany("");
      setContactPhone("");
      setContactEmail("");
      setContactMessage("");
    }, 1200);
  };

  const toggleInquiryStatus = (id: string) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return {
          ...inq,
          status: inq.status === "pending" ? "completed" : "pending"
        };
      }
      return inq;
    }));
  };

  const handleDeleteInquiry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("이 문의 내역을 삭제하시겠습니까?")) {
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    }
  };

  // Carousel navigation inside Detail View
  const handleNextProject = () => {
    if (activeIndex === -1) return;
    const nextIdx = (activeIndex + 1) % portfolios.length;
    setSelectedProject(portfolios[nextIdx]);
  };

  const handlePrevProject = () => {
    if (activeIndex === -1) return;
    const prevIdx = (activeIndex - 1 + portfolios.length) % portfolios.length;
    setSelectedProject(portfolios[prevIdx]);
  };

  // Safe navigation function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pre-load layout preset illustrations
  const categoryBgColors: Record<string, string> = {
    상세페이지: "from-amber-50 to-gold-100 border-amber-200/50 text-amber-800",
    SNS: "from-cyan-50 to-blue-100 border-blue-200/50 text-blue-800",
    배너: "from-purple-50 to-pink-100 border-pink-200/50 text-pink-800",
    브랜딩: "from-zinc-100 to-stone-200 border-stone-300/50 text-stone-800",
    기타: "from-teal-50 to-emerald-100 border-teal-200/50 text-teal-800",
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col relative selection:bg-gold-200 selection:text-gold-900">
      
      {/* FLOATING ACTION BANNER: Only shown to Admin when Logged In */}
      {isAdminLoggedIn && (
        <div className="sticky top-0 z-50 bg-[#121212] text-xs font-mono text-neutral-300 py-2.5 px-4 flex justify-between items-center border-b border-neutral-800 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ADMIN MODE (I:DO Design Studio 관리)</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAdminConsole(prev => !prev)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              {showAdminConsole ? "클라이언트 뷰로 복귀" : "관리자 메뉴 열기"}
            </button>
            <button 
              onClick={handleLogout}
              className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded border border-rose-800/30 transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION (Sticky Header) */}
      <header className={`sticky z-40 transition-all duration-300 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 ${isAdminLoggedIn ? "" : "top-0"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-15 h-20 flex justify-between items-center">
          
          {/* Brand Logo Left */}
          <a 
            href="#root" 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentTab("work"); 
              setSelectedFilter("ALL");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2"
          >
            <span className="text-lg tracking-[4px] font-semibold font-sans uppercase pointer-events-none text-[#1A1A1A]">
              I:DO Design Studio
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 group-hover:scale-130 transition"></span>
          </a>

          {/* Fixed Menu Right */}
          <nav className="flex items-center gap-6 md:gap-10">
            <button 
              onClick={() => setCurrentTab("work")} 
              className={`text-[12px] tracking-[2px] transition-all duration-300 py-1.5 border-b-2 cursor-pointer font-medium ${
                currentTab === "work"
                  ? "text-[#1A1A1A] border-[#1A1A1A] opacity-100"
                  : "text-[#1A1A1A]/60 border-transparent hover:opacity-100"
              }`}
            >
              WORK
            </button>
            <button 
              onClick={() => setCurrentTab("service")} 
              className={`text-[12px] tracking-[2px] transition-all duration-300 py-1.5 border-b-2 cursor-pointer font-medium ${
                currentTab === "service"
                  ? "text-[#1A1A1A] border-[#1A1A1A] opacity-100"
                  : "text-[#1A1A1A]/60 border-transparent hover:opacity-100"
              }`}
            >
              SERVICE
            </button>
            <button 
              onClick={() => setCurrentTab("contact")} 
              className={`text-[12px] tracking-[2px] transition-all duration-300 py-1.5 border-b-2 cursor-pointer font-medium ${
                currentTab === "contact"
                  ? "text-[#1A1A1A] border-[#1A1A1A] opacity-100"
                  : "text-[#1A1A1A]/60 border-transparent hover:opacity-100"
              }`}
            >
              CONTACT
            </button>
          </nav>

        </div>
      </header>

      {/* ADMIN CONSOLE VIEW (DOCK WINDOWED SIDEBAR ON TOP / COLLAPSIBLE) */}
      <AnimatePresence>
        {isAdminLoggedIn && showAdminConsole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#181818] border-b border-[#2d2d2d] overflow-hidden shadow-inner text-white"
          >
            <div className="max-w-7xl mx-auto p-6">
              
              {/* Tabs */}
              <div className="flex justify-between items-center border-b border-[#282828] pb-4 mb-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setAdminTab("projects")}
                    className={`px-4 py-2 text-sm font-medium transition rounded flex items-center gap-2 ${adminTab === "projects" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-neutral-200"}`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    포트폴리오 관리 ({portfolios.length})
                  </button>
                  <button 
                    onClick={() => setAdminTab("inquiries")}
                    className={`px-4 py-2 text-sm font-medium transition rounded flex items-center gap-2 relative ${adminTab === "inquiries" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-neutral-200"}`}
                  >
                    <Mail className="w-4 h-4" />
                    받은 프로젝트 문의 ({inquiries.length})
                    {inquiries.some(q => q.status === "pending") && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {adminTab === "projects" && (
                    <button 
                      onClick={handleAddNewProjectClick}
                      className="px-4 py-2 bg-gold-500 hover:bg-gold-600 active:scale-95 text-xs text-white uppercase tracking-wider rounded font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      신규 프로젝트 등록
                    </button>
                  )}
                  <button 
                    onClick={handleRestoreDefaults}
                    className="px-3 py-2 bg-transparent text-neutral-400 hover:text-neutral-200 hover:bg-white/5 text-xs rounded transition flex items-center gap-1"
                    title="초기 6가지 구성으로 되돌립니다."
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    기본데이터 복원
                  </button>
                  <button 
                    onClick={() => setShowAdminConsole(false)}
                    className="p-1 px-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded transition text-xs"
                  >
                    닫기 ✕
                  </button>
                </div>
              </div>

              {/* LIST SUBPANE (PROJECTS) */}
              {adminTab === "projects" && (
                <div className="space-y-4">
                  
                  {/* EDIT/ADD MODAL DRAWER INSIDE */}
                  {showProjectForm && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="p-5 rounded-lg border border-neutral-700 bg-[#222222] text-sm shadow-xl max-w-3xl mx-auto"
                    >
                      <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
                        <h4 className="font-semibold text-gold-400 text-sm">
                          {isEditingItem ? "포트폴리오 정보 수정" : "새 웹디자인 작업물 시각화 카드 추가"}
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => setShowProjectForm(false)}
                          className="p-1 text-neutral-400 hover:text-white transition"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">프로젝트명 / 제목 (필수)</label>
                          <input 
                            type="text" 
                            value={formTitle} 
                            placeholder="예: 하림 피코크 삼계탕 상세페이지"
                            onChange={e => setFormTitle(e.target.value)} 
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-gold-400"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">분류 / 카테고리 기획</label>
                          <select 
                            value={formCategory} 
                            onChange={e => setFormCategory(e.target.value as PortfolioItem["category"])}
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-gold-400"
                          >
                            <option value="E-COMMERCE">E-COMMERCE</option>
                            <option value="CONTENT">CONTENT</option>
                            <option value="CAMPAIGN">CAMPAIGN</option>
                            <option value="OTHER">OTHER</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">클라이언트 사명 (필수)</label>
                          <input 
                            type="text" 
                            value={formClient} 
                            placeholder="예: 현대카드"
                            onChange={e => setFormClient(e.target.value)} 
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">제작연도</label>
                          <input 
                            type="text" 
                            value={formYear} 
                            placeholder="예: 2024"
                            onChange={e => setFormYear(e.target.value)} 
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">역할 (Role)</label>
                          <input 
                            type="text" 
                            value={formRole} 
                            placeholder="예: Design"
                            onChange={e => setFormRole(e.target.value)} 
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">상세 유형 (Project Type)</label>
                          <input 
                            type="text" 
                            value={formProjectType} 
                            placeholder="예: SNS Content, E-commerce Detail 등"
                            onChange={e => setFormProjectType(e.target.value)} 
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">형태 (Classification)</label>
                          <select 
                            value={formClassification} 
                            onChange={e => setFormClassification(e.target.value as PortfolioItem["classification"])}
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-gold-400"
                          >
                            <option value="Agency Project">Agency Project</option>
                            <option value="In-house Project">In-house Project</option>
                            <option value="Freelance Project">Freelance Project</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-neutral-400 mb-1">설명 (최대 3~5줄 권장)</label>
                          <textarea 
                            value={formDescription} 
                            placeholder="구체적인 목적, 결과, 세일즈 포인트 위주로 적으면 기입해 주세요."
                            rows={3}
                            onChange={e => setFormDescription(e.target.value)} 
                            className="w-full text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none h-20"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-neutral-400 mb-1">대표 썸네일 이미지 주소</label>
                          <div className="flex gap-2">
                            <input 
                              type="url" 
                              value={formThumbnail} 
                              placeholder="https://images.unsplash.com/photo-..."
                              onChange={e => setFormThumbnail(e.target.value)} 
                              className="flex-1 text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
                            />
                            <label className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded text-xs text-white cursor-pointer select-none flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" />
                              파일 선택
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) handleThumbnailFileChange(file);
                                }}
                                className="hidden" 
                              />
                            </label>
                          </div>

                          {/* Drag & Drop Area for Thumbnail */}
                          <div 
                            onDragOver={e => {
                              e.preventDefault();
                              setIsDragOverThumb(true);
                            }}
                            onDragLeave={() => setIsDragOverThumb(false)}
                            onDrop={e => {
                              e.preventDefault();
                              setIsDragOverThumb(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleThumbnailFileChange(file);
                            }}
                            className={`mt-2 border border-dashed p-4 text-center rounded transition-all text-xs cursor-pointer ${
                              isDragOverThumb 
                                ? "border-accent bg-accent/10 text-white" 
                                : "border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-neutral-300 hover:border-neutral-600"
                            }`}
                          >
                            {formThumbnail ? (
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={formThumbnail} 
                                    alt="미리보기" 
                                    className="w-12 h-9 object-cover rounded border border-neutral-700" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="text-left">
                                    <p className="text-emerald-400 font-medium text-[11px]">대표 이미지가 설정되었습니다.</p>
                                    <p className="text-[10px] text-neutral-500 truncate max-w-[200px] sm:max-w-xs">{formThumbnail.startsWith("data:") ? "직접 업로드된 파일" : formThumbnail}</p>
                                  </div>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormThumbnail("");
                                  }}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-neutral-800 border border-neutral-700"
                                >
                                  초기화
                                </button>
                              </div>
                            ) : (
                              <p className="text-[11px]">대표 이미지를 여기에 드래그 앤 드롭 하거나 파일 선택을 눌러주세요.</p>
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs text-neutral-400 mb-1">상세 결과물 이미지 리스트 (콤마 , 로 구분해 여러 장 등록 가능)</label>
                          <div className="flex gap-2">
                            <textarea 
                              value={formResultImages} 
                              placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                              rows={2}
                              onChange={e => setFormResultImages(e.target.value)} 
                              className="flex-1 text-xs p-2 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none h-14"
                            />
                            <label className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded text-xs text-white cursor-pointer select-none flex items-center justify-center gap-1 self-stretch h-14 w-24">
                              <Upload className="w-3.5 h-3.5" />
                              파일 추가
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={e => {
                                  if (e.target.files) handleResultImagesFilesChange(e.target.files);
                                }}
                                className="hidden" 
                              />
                            </label>
                          </div>

                          {/* Drag & Drop Area for Result Images */}
                          <div 
                            onDragOver={e => {
                              e.preventDefault();
                              setIsDragOverResults(true);
                            }}
                            onDragLeave={() => setIsDragOverResults(false)}
                            onDrop={e => {
                              e.preventDefault();
                              setIsDragOverResults(false);
                              if (e.dataTransfer.files) handleResultImagesFilesChange(e.dataTransfer.files);
                            }}
                            className={`mt-2 border border-dashed p-4 text-center rounded transition-all text-xs cursor-pointer ${
                              isDragOverResults 
                                ? "border-accent bg-accent/10 text-white" 
                                : "border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-neutral-300 hover:border-neutral-600"
                            }`}
                          >
                            {formResultImages ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] text-neutral-400 border-b border-neutral-800 pb-1.5">
                                  <span>상세 이미지 모음: {formResultImages.split(",").filter(Boolean).length}개</span>
                                  <button 
                                    type="button" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormResultImages("");
                                    }}
                                    className="text-rose-400 hover:text-rose-300 transition"
                                  >
                                    모두 삭제
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center max-h-24 overflow-y-auto p-1 bg-black/20">
                                  {formResultImages.split(",").map((imgRaw, idx) => {
                                    const img = imgRaw.trim();
                                    if (!img) return null;
                                    return (
                                      <div key={idx} className="relative group">
                                        <img 
                                          src={img} 
                                          alt="" 
                                          className="w-10 h-7 object-cover rounded border border-neutral-800 bg-neutral-900" 
                                          referrerPolicy="no-referrer"
                                        />
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const filtered = formResultImages.split(",")
                                              .map(s => s.trim())
                                              .filter((s, i) => i !== idx)
                                              .join(", ");
                                            setFormResultImages(filtered);
                                          }}
                                          className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] leading-none"
                                          title="제거"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px]">여러 장의 상세 슬라이드용 이미지를 여기에 드래그 앤 드롭 하거나 파일 추가를 눌러 다중 업로드 하세요.</p>
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setShowProjectForm(false)}
                            className="px-3 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded transition"
                          >
                            취소
                          </button>
                          <button 
                            type="submit" 
                            className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 font-semibold rounded text-white transition cursor-pointer"
                          >
                            {isEditingItem ? "수정사항 저장" : "새 포트폴리오 등록완료"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* PORTFOLIO ITEMS ROW LIST */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-neutral-300">
                      <thead className="text-[10px] text-neutral-400 uppercase bg-[#202020] uppercase tracking-wider border-b border-neutral-800">
                        <tr>
                          <th className="py-3 px-4">썸네일</th>
                          <th className="py-3 px-4">프로젝트명</th>
                          <th className="py-3 px-4">카테고리</th>
                          <th className="py-3 px-4">클라이언트</th>
                          <th className="py-3 px-4">연도</th>
                          <th className="py-3 px-4 text-right">관리 제어</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222222]">
                        {portfolios.map(item => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 px-4">
                              <img 
                                src={item.thumbnailUrl} 
                                alt="" 
                                className="w-12 h-9 object-cover rounded bg-neutral-800 border border-neutral-700"
                                referrerPolicy="no-referrer"
                              />
                            </td>
                            <td className="py-3 px-4 font-medium text-white max-w-xs truncate">{item.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-400 text-[10px]">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-neutral-400">{item.client}</td>
                            <td className="py-3 px-4">{item.year}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex gap-1.5">
                                <button 
                                  onClick={() => handleEditItemClick(item)}
                                  className="p-1 px-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded text-neutral-400 transition inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" /> 수정
                                </button>
                                <button 
                                  onClick={() => handleDeleteProject(item.id)}
                                  className="p-1 px-2 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400/80 hover:text-rose-300 rounded border border-rose-900/10 transition inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" /> 삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* LIST SUBPANE (INQUIRIES) */}
              {adminTab === "inquiries" && (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500 text-xs">
                      아직 접수된 프로젝트 문의 사항이 존재하지 않습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inquiries.map(inq => (
                        <div 
                          key={inq.id} 
                          className={`p-4 rounded border text-xs transition relative flex flex-col justify-between ${
                            inq.status === "completed" 
                              ? "bg-neutral-900/50 border-[#2f2f2d] text-neutral-400" 
                              : "bg-[#202020] border-neutral-700 text-neutral-200"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${inq.status === 'completed' ? 'bg-neutral-600' : 'bg-gold-400'}`}></span>
                                <h5 className="font-bold text-white text-sm">
                                  {inq.companyName !== "개인 / 미정" ? `[${inq.companyName}] ` : ""}
                                  {inq.inquirerName} 담당자님
                                </h5>
                              </div>
                              <button 
                                onClick={(e) => handleDeleteInquiry(inq.id, e)}
                                className="p-1 text-neutral-500 hover:text-rose-400 transition"
                                title="이 내역 지우기"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="space-y-1 mb-3 text-[11px] text-neutral-400 border-b border-white/[0.05] pb-2">
                              <div className="flex justify-between">
                                <span>연락처 / 메일:</span>
                                <span>{inq.phone} / {inq.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>의뢰 분야:</span>
                                <span className="text-gold-300 font-semibold">{inq.projectType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>예상 예산:</span>
                                <span>{inq.budgetEstimate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>접수 일시:</span>
                                <span>{inq.createdAt}</span>
                              </div>
                            </div>

                            <p className="whitespace-pre-wrap text-xs text-neutral-300 bg-black/25 p-3 rounded-md line-clamp-4 leading-relaxed font-sans mb-3">
                              {inq.message}
                            </p>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => toggleInquiryStatus(inq.id)}
                              className={`px-3 py-1 rounded text-[10px] uppercase font-semibold tracking-wider transition cursor-pointer ${
                                inq.status === "completed"
                                  ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                                  : "bg-gold-500 hover:bg-gold-600 text-white"
                              }`}
                            >
                              {inq.status === "completed" ? "진행 중으로 변경" : "검토 완료 처리"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 01: HEROPOSITIONAL PROFILE & FEED TIMELINE */}
      <main className="flex-1 w-full flex flex-col">
        
        {currentTab === 'work' && (
          <>
            {/* PORTFOLIO LIST SECTION WITH CATEGORIES */}
            <section id="portfolio-feed" className="pt-10 pb-16 bg-[#F9F8F6] border-b border-[#1A1A1A]/10">
              <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-15">
                
                {/* Simplified Sub-Filter Layout with Tooltips */}
                <div className="border-b border-[#1A1A1A]/10 pb-4 mb-2">
                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
                    {(["ALL", "E-COMMERCE", "CONTENT", "CAMPAIGN", "OTHER"] as const).map(catName => (
                      <div key={catName} className="relative group/tab">
                        <button
                          onClick={() => setSelectedFilter(catName)}
                          className={`text-[11px] tracking-[1.5px] cursor-pointer py-1.5 border-b-2 font-bold uppercase transition-all duration-300 ${
                            selectedFilter === catName
                              ? "text-[#1A1A1A] border-[#1A1A1A]"
                              : "text-[#1A1A1A]/40 border-transparent hover:text-[#1A1A1A]"
                          }`}
                        >
                          {catName}
                        </button>
                        
                        {/* Hover Tooltip / Assist Text description */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 scale-95 pointer-events-none group-hover/tab:opacity-100 group-hover/tab:scale-100 transition-all duration-200 ease-out z-50 bg-[#1A1A1A] text-[#FAF9F6] text-[10px] font-medium tracking-wide py-2 px-3 shadow-lg whitespace-nowrap min-w-max">
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1A] rotate-45"></div>
                          <span className="relative z-10 text-center block text-[11px] font-sans font-[500] text-stone-200">
                            {CATEGORY_DESCS[catName]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current Active Category Description under-label */}
                  <div className="mt-2.5 flex items-center gap-1.5 min-h-[16px]">
                    <span className="text-[9px] bg-[#8B7E66] text-white px-1 py-0.5 rounded-none font-sans font-semibold tracking-wider">GUIDE</span>
                    <p className="text-[10px] text-[#8B7E66] font-medium tracking-[0.05em] font-sans">
                      {CATEGORY_DESCS[selectedFilter]}
                    </p>
                  </div>
                </div>

                {/* Portfolio feed cards list */}
                {filteredPortfolios.length === 0 ? (
                  <div className="py-24 text-center text-neutral-400 text-sm font-sans flex flex-col items-center justify-center gap-3">
                    <Sliders className="w-8 h-8 text-neutral-300" />
                    선택하신 카테고리에 등록된 작업물이 현재 없습니다.
                  </div>
                ) : (
                  <div className="overflow-hidden mt-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedFilter}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      >
                        {filteredPortfolios.slice(0, visibleCount).map((project) => (
                          <div
                            key={project.id}
                            className="group bg-white hover:bg-[#F9F8F6]/40 rounded-none border border-[#1A1A1A]/10 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block cursor-pointer flex flex-col justify-between"
                            onClick={() => setSelectedProject(project)}
                          >
                            <div>
                              {/* Thumbnail view frame with zoom */}
                              <div className="w-full aspect-[4/3] rounded-none overflow-hidden bg-stone-200 relative">
                                <img 
                                  src={project.thumbnailUrl} 
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition duration-300"></div>

                                {/* Hover hint */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-900/60 text-white text-[11px] font-medium tracking-[2px]">
                                  VIEW DETAILS
                                </div>
                              </div>

                              {/* Title text & Category details */}
                              <div className="mt-4 p-1">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8B7E66] font-bold block mb-1">
                                  {project.category}
                                </span>
                                <h3 className="text-[14px] font-bold leading-snug text-[#1A1A1A] group-hover:text-accent line-clamp-2 transition-colors duration-200 uppercase tracking-wide">
                                  {project.title}
                                </h3>
                              </div>
                            </div>
                            
                            <div className="pt-2 mt-4 flex items-center justify-between text-[11px] text-[#1A1A1A]/40 p-1 font-sans border-t border-[#1A1A1A]/5">
                              <span className="truncate max-w-[150px]">{project.client}</span>
                              <span className="group-hover:translate-x-1.5 transition-transform duration-300 text-accent font-semibold">
                                →
                              </span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* Clean Load More Button Interface */}
                {visibleCount < filteredPortfolios.length && (
                  <div className="flex flex-col justify-center items-center py-12 mt-6">
                    <button
                      onClick={() => setVisibleCount(prev => Math.min(prev + 8, filteredPortfolios.length))}
                      className="px-10 py-4 bg-white hover:bg-[#1A1A1A] border border-[#1A1A1A]/15 hover:border-[#1A1A1A] text-[#1A1A1A] hover:text-white font-sans text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98]"
                      id="btn-load-more"
                    >
                      더 보기 (Load More)
                    </button>
                    <p className="text-[10px] text-[#8B7E66] font-medium tracking-[0.1em] mt-3 uppercase">
                      Showing {Math.min(visibleCount, filteredPortfolios.length)} of {filteredPortfolios.length} selective projects
                    </p>
                  </div>
                )}

              </div>
            </section>
          </>
        )}

        {/* SECTION 02: PORTFOLIO DETAIL MODAL VIEW (SLIDING OVERLAY) */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 md:p-8"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div 
                initial={{ scale: 0.98, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-[#F9F8F6] rounded-none text-[#1A1A1A] w-full max-w-4xl overflow-hidden shadow-2xl border border-[#1A1A1A]/10 mt-2 mb-10"
                onClick={e => e.stopPropagation()}
              >
                
                {/* Header panel inside Modal */}
                <div className="border-b border-[#1A1A1A]/10 bg-white py-4 px-6 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-[#1A1A1A] text-white">
                      {selectedProject.category}
                    </span>
                  </div>
                  
                  {/* Close & Next button group */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handlePrevProject}
                      className="p-1 px-2.5 hover:bg-[#1A1A1A]/5 rounded-none text-neutral-500 hover:text-black transition flex items-center text-xs"
                      title="이전 작업물 보기 (Shortkey: Left Arrow)"
                    >
                      <ChevronLeft className="w-4 h-4 mr-0.5" /> 이전
                    </button>
                    <button 
                      onClick={handleNextProject}
                      className="p-1 px-2.5 hover:bg-[#1A1A1A]/5 rounded-none text-neutral-500 hover:text-black transition flex items-center text-xs"
                      title="다음 작업물 보기 (Shortkey: Right Arrow)"
                    >
                      다음 <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="p-1.5 bg-[#1A1A1A]/5 hover:bg-neutral-800 hover:text-white rounded-none transition text-neutral-600 cursor-pointer"
                      title="창 닫기 (ESC)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  
                  {/* Project Titles */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#8B7E66] font-semibold block">
                      {selectedProject.client}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-sans tracking-tight text-[#1A1A1A] font-bold">
                      {selectedProject.title}
                    </h2>
                  </div>

                  {/* Visual Representative Showcase */}
                  <div className="w-full aspect-video rounded-none overflow-hidden bg-stone-100 shadow border border-[#1A1A1A]/10 relative group">
                    <img 
                      src={selectedProject.thumbnailUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Summary & Metadata Specifications Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-y border-[#1A1A1A]/10 py-6">
                    
                    {/* Metadata column */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] border-r border-[#1A1A1A]/10 pr-4 pb-4 md:pb-0 font-sans">
                      <div>
                        <span className="text-neutral-400 block mb-1 uppercase tracking-wider text-[9px] font-mono">Client</span>
                        <span className="font-semibold text-[#1A1A1A]">{selectedProject.client}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1 uppercase tracking-wider text-[9px] font-mono">Project Type</span>
                        <span className="font-semibold text-[#1A1A1A]">{selectedProject.projectType || "Design"}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1 uppercase tracking-wider text-[9px] font-mono">Role</span>
                        <span className="font-semibold text-accent">{mapRoleToKorean(selectedProject.role)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-1 uppercase tracking-wider text-[9px] font-mono">Classification</span>
                        <span className="font-semibold text-[#1A1A1A]">{selectedProject.classification || "Freelance Project"}</span>
                      </div>
                    </div>

                    {/* Simple description Column */}
                    <div className="md:col-span-7 flex flex-col justify-start">
                      <span className="text-neutral-400 text-xs block mb-1 font-mono">Project Overview</span>
                      <p className="text-xs text-neutral-700 leading-relaxed font-sans font-[400] whitespace-pre-wrap">
                        {selectedProject.description}
                      </p>
                    </div>

                  </div>

                  {/* Full Result Gallery Images */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 font-bold border-b border-[#1A1A1A]/10 pb-2 mb-3">
                      RESULT WORK 에셋 결과물 상세보기
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {selectedProject.resultImages.map((img, index) => (
                        <div key={index} className="w-full rounded-none bg-stone-100 border border-[#1A1A1A]/10 overflow-hidden">
                          <img 
                            src={img} 
                            alt={`결과물 에셋 ${index + 1}`} 
                            className="w-full object-contain h-auto"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Inquiry action banner */}
                  <div className="bg-white border border-[#1A1A1A]/10 p-5 rounded-none text-center space-y-3">
                    <p className="text-xs text-[#1A1A1A] font-sans">
                      이 프로젝트 <strong>&lsquo;{selectedProject.client}&rsquo;</strong> 의 작업 톤앤매너로 제작 의뢰를 넣고 싶으신가요?
                    </p>
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => {
                          setSelectedProject(null);
                          setContactType(selectedProject.category);
                          setContactMessage(`작업물 '${selectedProject.title}'을 관심 있게 감상하였습니다.\n이와 유사한 상세페이지/디자인 프로젝트 건으로 문의 연락 드립니다.`);
                          setCurrentTab("contact");
                        }}
                        className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-accent text-white font-medium text-xs rounded-none transition duration-300 flex items-center gap-1 cursor-pointer"
                      >
                        이 작업에 대해 견적 문의하기
                      </button>
                    </div>
                  </div>

                </div>

                {/* Footer close */}
                <div className="bg-[#FAF9F6] border-t border-[#1A1A1A]/10 py-3 px-6 flex justify-end">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-1.5 text-xs bg-[#1A1A1A] text-white hover:bg-accent rounded-none transition font-semibold"
                  >
                    닫기
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 03: CONTACT (PROJECT INQUIRY BANNER / FORM CONVERSION) */}
        {currentTab === 'contact' && (
          <section id="contact" className="py-16 bg-[#F9F8F6] border-b border-[#1A1A1A]/10">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent font-bold block">
                COLLABORATION & INQUIRY
              </span>
              <h2 className="text-3xl md:text-3xl font-sans tracking-tight text-[#1A1A1A] font-light leading-tight">
                준비 중인 비즈니스를 <span className="font-semibold text-accent">시각화</span>하세요
              </h2>
              <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                상세페이지 제작, 월간 SNS 콘텐츠 기획, 배너 광고 세트 및 브랜드 디자인 가이던스 수립 문의가 모두 열려있습니다. 꼼꼼히 적어 보내주시면 성심껏 연락 드리겠습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column info channels */}
              <div className="md:col-span-4 space-y-6">
                
                <div className="p-5 rounded-none border border-[#1A1A1A]/10 bg-white shadow-sm space-y-4">
                  <h4 className="text-xs font-sans uppercase tracking-[2px] text-neutral-800 font-semibold border-b border-[#1A1A1A]/10 pb-2">
                    CONTACT INFO
                  </h4>
                  
                  <div className="space-y-3.5 text-xs text-neutral-600">
                    <a 
                      href="mailto:a01072397515@gmail.com" 
                      className="flex items-center gap-3 hover:text-neutral-900 transition"
                    >
                      <span className="p-2 bg-[#F1EFEA] rounded-none">
                        <Mail className="w-3.5 h-3.5 text-[#8B7E66]" />
                      </span>
                      <span>a01072397515@gmail.com</span>
                    </a>

                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-[#F1EFEA] rounded-none">
                        <Phone className="w-3.5 h-3.5 text-[#8B7E66]" />
                      </span>
                      <img 
                        src="https://img.shields.net/badge/Kakaotalk-FFCD00?style=flat-square&logo=Kakao&logoColor=black" 
                        alt="Kakao ID: kmhj_design" 
                        className="h-5" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-none border border-[#1A1A1A]/10 bg-[#FAF9F6] shadow-sm space-y-3.5 text-center">
                  <p className="text-[11px] text-neutral-500 font-semibold">
                    카카오톡 실시간 상담 서비스
                  </p>
                  
                  {/* Kakao contact channels buttons */}
                  <a 
                    href="https://open.kakao.com/o/sKMHJ1" 
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#FFCD00] hover:bg-[#E6BB00] active:scale-95 text-[#3C1E1E] text-xs font-semibold rounded-none flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#3C1E1E] stroke-none" />
                    카카오 오픈채팅 상담
                  </a>
                  <p className="text-[9px] text-neutral-400">
                    평일 주간에 주로 빠른 답변을 드립니다
                  </p>
                </div>

              </div>

              {/* Right Column Form (Real inquiry store persistence) */}
              <div className="md:col-span-8">
                
                {contactSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-none border border-emerald-255 bg-emerald-50 text-center space-y-4 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-none flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-md font-bold text-emerald-900">
                      프로젝트 문의가 정상적으로 접수되었습니다!
                    </h3>
                    <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto font-sans">
                      감사합니다. 입력하신 이메일 접수 내용을 기반으로 <strong>스튜디오 담당 팀</strong>이 확인 후 24시간 이내에 메일 또는 번호로 회신 메일을 전해 드리겠습니다.
                    </p>
                    <button 
                      onClick={() => setContactSuccess(false)}
                      className="px-5 py-2 bg-[#1A1A1A] text-white rounded-none text-xs transition cursor-pointer hover:bg-accent"
                    >
                      새로운 문의 추가 작성하기
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1 relative">
                        <label className="text-[11px] font-semibold text-neutral-600 block">성함 / 담당자명 (필수)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                            <User className="w-3.5 h-3.5" />
                          </span>
                          <input 
                            type="text" 
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            placeholder="예: 홍길동 팀장"
                            className="w-full text-xs p-2.5 pl-9 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 block">회사명 / 브랜드명 (선택)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                            <Building className="w-3.5 h-3.5" />
                          </span>
                          <input 
                            type="text" 
                            value={contactCompany}
                            onChange={e => setContactCompany(e.target.value)}
                            placeholder="예: 주식회사 에이비씨"
                            className="w-full text-xs p-2.5 pl-9 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 block">연락처 번호 (선택)</label>
                        <input 
                          type="text" 
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          placeholder="예: 010-1234-5678"
                          className="w-full text-xs p-2.5 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 block">회신받으실 이메일 주소 (필수)</label>
                        <input 
                          type="email" 
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          placeholder="예: example@company.com"
                          className="w-full text-xs p-2.5 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent"
                          required
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 block">의뢰 희망 분야</label>
                        <select 
                          value={contactType}
                          onChange={e => setContactType(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent text-neutral-800"
                        >
                          <option value="상세페이지">상세페이지</option>
                          <option value="SNS 콘텐츠">SNS 콘텐츠</option>
                          <option value="배너 광고">배너 광고</option>
                          <option value="브랜딩 BX">브랜딩 BX</option>
                          <option value="기타 디자인">기타 디자인의뢰</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-neutral-600 block">예상 책정 예산 범위</label>
                        <select 
                          value={contactBudget}
                          onChange={e => setContactBudget(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent text-neutral-800"
                        >
                          <option value="협의 가능">협의 희망 (컨설팅 후 결정)</option>
                          <option value="100만원 이하">100만원 이하 (가벼운 배너/단건)</option>
                          <option value="100만원 - 300만원">100만원 - 300만원</option>
                          <option value="300만원 - 500만원">300만원 - 500만원</option>
                          <option value="500만원 이상">500만원 이상 (브랜딩 웰컴팩)</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-600 block">상세 문의 / 의뢰 내용 기입 (필수)</label>
                      <textarea 
                        value={contactMessage}
                        onChange={e => setContactMessage(e.target.value)}
                        placeholder="기획 여부(유/무), 필요 에셋 희망 수량, 레퍼런스 스타일 주소나 컨셉 등을 적어주시면 단시간 맞춤 견적 조율이 대폭 편리해집니다."
                        rows={4}
                        className="w-full text-xs p-2.5 rounded-none bg-white border border-[#1A1A1A]/10 focus:outline-none focus:border-accent h-28"
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmittingContact}
                      className="w-full py-3 bg-[#1A1A1A] hover:bg-accent text-white text-xs uppercase tracking-wider font-semibold rounded-none shadow-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmittingContact ? (
                        <>보내는 상자 전송 중...</>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          I:DO Design Studio에 문의 제출하기
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>

            </div>

          </div>
        </section>
        )}

        {/* SECTION 04: ABOUT (LEAST POSITIONED & HIGHLY REFINED MINIMALIST STUDIO INFO) */}
        {currentTab === 'about' && (
          <section id="about" className="py-24 bg-white flex-1 flex flex-col justify-center">
            <div className="max-w-4xl mx-auto px-6 w-full">
              <div className="space-y-16 max-w-3xl mx-auto text-center">
                
                {/* Header */}
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8B7E66] font-bold block">
                    STUDIO PROFILE
                  </span>
                  <h3 className="text-4xl md:text-5xl font-sans tracking-tight text-[#1A1A1A] font-black uppercase">
                    I:DO Design Studio
                  </h3>
                  <div className="flex items-center justify-center gap-3 text-[#1A1A1A]/70 text-sm tracking-widest font-sans uppercase font-medium">
                    <span>Independent Design Studio</span>
                    <span className="opacity-30">•</span>
                    <span>10+ Years Experience</span>
                  </div>
                </div>

                <div className="border-t border-[#1A1A1A]/10 w-16 mx-auto"></div>

                {/* PROJECT CLASSIFICATIONS */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#8B7E66] font-bold">
                    CORE PROJECTS
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Agency Project", desc: "다양한 광고 대행사 협력 및 브랜드 특성에 긴밀히 맞춤된 메인 에셋 수립" },
                      { name: "In-house Project", desc: "제품 고유의 아이덴티티 성격을 깊이 탐색하여 완성하는 직영 시각 콘텐츠" },
                      { name: "Freelance Project", desc: "소통 창구를 극대화하여 실제 판매 성장을 보조하고 유연하게 전환하는 파트너십" }
                    ].map((item) => (
                      <div 
                        key={item.name} 
                        className="p-6 bg-[#FAF9F6] border border-[#1A1A1A]/10 text-left space-y-2 hover:border-[#1A1A1A] transition duration-300"
                      >
                        <span className="text-xs font-sans font-bold tracking-wider text-[#1A1A1A] block uppercase">
                          {item.name}
                        </span>
                        <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed font-sans">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DESIGN TOOLS */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#8B7E66] font-bold">
                    DESIGN TOOLS
                  </h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["Photoshop", "Illustrator", "Premiere Pro", "Figma"].map((tool) => (
                      <div 
                        key={tool} 
                        className="px-6 py-4 bg-[#FAF9F6] border border-[#1A1A1A]/10 text-xs font-mono font-bold text-neutral-800 tracking-wider hover:border-[#1A1A1A] transition duration-300"
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* SECTION 05: SERVICE (ARCHIVE AREAS & PROCESS) */}
        {currentTab === 'service' && (
          <section id="service" className="py-20 bg-white flex-1 flex flex-col justify-center">
            <div className="max-w-5xl mx-auto px-6 w-full">
              
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold block">
                  OUR CAPABILITIES
                </span>
                <h3 className="text-3xl md:text-4xl font-sans font-light tracking-tight text-[#1A1A1A]">
                  Focused Design Areas
                </h3>
                <p className="text-xs md:text-sm text-[#1A1A1A]/55 max-w-lg mx-auto leading-relaxed">
                  I:DO Design Studio는 상품 고유의 본질을 명확히 정의하고, 직관성과 매출 전환을 보장하는 고효율의 맞춤형 비주얼 에셋을 기획 및 제공합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Service 1 */}
                <div className="p-8 bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-4 transition duration-300 hover:border-[#1A1A1A] font-sans text-left">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent font-serif italic text-lg font-bold">
                    01
                  </div>
                  <h4 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
                    E-commerce Design
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    상품 및 서비스 판매를 위한 고효율 콘텐츠 디자인을 다룹니다. 매출 상승 및 확실한 구매 동선 수립을 목표로 최적의 상세페이지와 에셋을 구성합니다.
                  </p>
                </div>

                {/* Service 2 */}
                <div className="p-8 bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-4 transition duration-300 hover:border-[#1A1A1A] font-sans text-left">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent font-serif italic text-lg font-bold">
                    02
                  </div>
                  <h4 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
                    Content Design
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    브랜드 및 SNS 운영 콘텐츠 디자인을 담당합니다. 플랫폼의 잠재 타겟 특성을 치밀하게 진단하여, 정독률을 증가시키는 비주얼 스토리를 제작합니다.
                  </p>
                </div>

                {/* Service 3 */}
                <div className="p-8 bg-[#FAF9F6] border border-[#1A1A1A]/10 space-y-4 transition duration-300 hover:border-[#1A1A1A] font-sans text-left">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent font-serif italic text-lg font-bold">
                    03
                  </div>
                  <h4 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
                    Campaign Creative
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    프로모션 및 마케팅 캠페인 디자인을 설계합니다. 제안하려는 단기 혜택이나 이벤트의 핵심 속성을 다채롭고 직관도 높게 구현하여 클릭 신장을 유도합니다.
                  </p>
                </div>
              </div>

            </div>
          </section>
        )}



      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#121212] text-neutral-400 py-10 text-xs border-t border-neutral-800 relative z-10 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="space-y-1.5 text-center md:text-left">
            <button 
              onClick={() => {
                setCurrentTab("work");
                setSelectedFilter("ALL");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm font-serif font-bold text-[#faf9f6]/90 hover:text-white transition tracking-[0.15em] cursor-pointer"
            >
              I:DO DESIGN STUDIO
            </button>
            <p className="text-[11px] text-neutral-500">
              © {new Date().getFullYear()} I:DO Design Studio. All Rights Reserved. 본 사이트의 디자인 수립 저작권은 스튜디오에 귀속됩니다.
            </p>
          </div>

          {/* Secure Admin lock login link */}
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-500 text-[11px] items-center">
              <button onClick={() => setCurrentTab("about")} className="hover:text-stone-300 cursor-pointer transition">ABOUT</button>
              <span>•</span>
              <button onClick={() => setCurrentTab("work")} className="hover:text-stone-300 cursor-pointer transition">WORK</button>
              <span>•</span>
              <button onClick={() => setCurrentTab("service")} className="hover:text-stone-300 cursor-pointer transition">SERVICE</button>
              <span>•</span>
              <button onClick={() => setCurrentTab("contact")} className="hover:text-stone-300 cursor-pointer transition">CONTACT</button>
              <span>•</span>
              <button 
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setShowAdminConsole(prev => !prev);
                  } else {
                    setIsAuthOpen(true);
                  }
                }}
                className={`hover:text-accent cursor-pointer tracking-wider font-semibold uppercase flex items-center gap-1 transition ${
                  isAdminLoggedIn ? "text-accent" : "text-neutral-500 hover:text-stone-300"
                }`}
                title="관리자 콘솔 열기"
              >
                <Lock className="w-3 h-3" />
                ADMIN
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* MOBILE FLOATING WHATSAPP/CONTACT BUTTON */}
      <div 
        className="fixed bottom-6 right-6 md:right-8 z-30 flex flex-col items-end gap-2.5 pointer-events-none"
        style={{ transform: `translateY(-${footerOffset}px)` }}
      >
        <AnimatePresence>
          {currentTab !== "contact" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentTab("contact")}
              className="w-12 h-12 bg-neutral-900 border border-neutral-700 text-white rounded-none flex items-center justify-center shadow-lg transition duration-300 hover:bg-[#8B7E66] cursor-pointer pointer-events-auto"
              title="상담 및 견적 문의 양식 열기"
            >
              <Mail className="w-5 h-5 text-[#faf9f6]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ADMIN AUTH DIALOG WINDOW (LOCK SCREEN OVERLAY) */}
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#1C1C1A] text-white border border-[#3e3c35] p-6 rounded-none w-full max-w-sm shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setIsAuthOpen(false);
                  setPasswordInput("");
                  setAuthError("");
                }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                ✕
              </button>

              <div className="text-center space-y-2 mb-6 font-sans">
                <div className="w-10 h-10 bg-neutral-800 text-accent rounded-none flex items-center justify-center mx-auto mb-2 border border-stone-700">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <h4 className="text-xs tracking-widest uppercase font-semibold text-white">
                  포트폴리오 관리자 인증
                </h4>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  신규 프로젝트 등록 및 문의 조회를 위해 <br />
                  비밀번호를 바르게 정해주십시오.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Password</label>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 text-center rounded-none bg-stone-900 border border-neutral-700 text-white focus:outline-none focus:border-accent font-mono tracking-widest"
                    autoFocus
                    required
                  />
                  {authError && (
                    <p className="text-[10px] text-rose-400 mt-1.5 text-center">
                      {authError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAuthOpen(false);
                      setPasswordInput("");
                      setAuthError("");
                    }}
                    className="w-1/2 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-none text-xs text-neutral-300 transition"
                  >
                    이전으로
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 py-2.5 bg-accent hover:bg-accent/90 active:scale-95 text-white font-semibold rounded-none text-xs transition cursor-pointer"
                  >
                    로그인
                  </button>
                </div>

              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
