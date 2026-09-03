import { createFileRoute, useBlocker } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Save, Plus, Trash2, Sliders, Image, Sparkles, ChevronDown, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { apiClient, API_BASE_URL } from "@/lib/api";
import { cn, getImageUrl } from "@/lib/utils";

// Extracted Config subcomponents
import { HeroSlidesConfig } from "@/components/admin/HeroSlidesConfig";
import { CategoryBannersConfig } from "@/components/admin/CategoryBannersConfig";
import { CollectionsConfig } from "@/components/admin/CollectionsConfig";
import { CollageConfig } from "@/components/admin/CollageConfig";
import { AuthConfig } from "@/components/admin/AuthConfig";
import { AdvertisementsConfig } from "@/components/admin/AdvertisementsConfig";
import { AnnouncementBarConfig } from "@/components/admin/AnnouncementBarConfig";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Global Settings — MOCS Admin" },
    ],
  }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth Page Customizations State
  const [authSettings, setAuthSettings] = useState<any>({
    slides: [
      { image: "", title: "Discover Your Style", subtitle: "Explore premium MOCS collections tailored just for you." },
      { image: "", title: "Create Your Vision", subtitle: "Join our community to unlock custom footwear and personalized styles." },
      { image: "", title: "Crafted For Comfort", subtitle: "Every pair is built for active lifestyles and durable comfort." }
    ]
  });
  const [originalAuthSettings, setOriginalAuthSettings] = useState<any>({
    slides: [
      { image: "", title: "Discover Your Style", subtitle: "Explore premium MOCS collections tailored just for you." },
      { image: "", title: "Create Your Vision", subtitle: "Join our community to unlock custom footwear and personalized styles." },
      { image: "", title: "Crafted For Comfort", subtitle: "Every pair is built for active lifestyles and durable comfort." }
    ]
  });

  // Hero Slides state
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [originalSlides, setOriginalSlides] = useState<any[]>([]);
  const [openFocusIdx, setOpenFocusIdx] = useState<number | null>(null);

  // Categories Section Banners
  const [categoriesBanners, setCategoriesBanners] = useState<any[]>([
    {
      key: "main",
      title: "We Are MOCS",
      desc: "Awesome, clean & creative footwear collections engineered for everyday agility, comfort, and style.",
      cta: "Purchase Now!",
      to: "/shop",
      bg: ""
    },
    {
      key: "women",
      title: "Women",
      desc: "Best Footwear For Women",
      cta: "Discover More",
      to: "/shop",
      search: { category: "Women" },
      bg: ""
    },
    {
      key: "men",
      title: "Men",
      desc: "Best Collections For Men",
      cta: "Discover More",
      to: "/shop",
      search: { category: "Men" },
      bg: ""
    },
    {
      key: "kids",
      title: "Kids",
      desc: "Best Shoes For Kids",
      cta: "Discover More",
      to: "/shop",
      search: { category: "Kids" },
      bg: ""
    },
    {
      key: "trending",
      title: "Trending",
      desc: "Best Trend Collections",
      cta: "Discover More",
      to: "/shop",
      search: { collection: "Trending" },
      bg: ""
    }
  ]);

  const [originalCategoriesBanners, setOriginalCategoriesBanners] = useState<any[]>([
    {
      key: "main",
      title: "We Are MOCS",
      desc: "Awesome, clean & creative footwear collections engineered for everyday agility, comfort, and style.",
      cta: "Purchase Now!",
      to: "/shop",
      bg: ""
    },
    {
      key: "women",
      title: "Women",
      desc: "Best Footwear For Women",
      cta: "Discover More",
      to: "/shop",
      search: { category: "Women" },
      bg: ""
    },
    {
      key: "men",
      title: "Men",
      desc: "Best Collections For Men",
      cta: "Discover More",
      to: "/shop",
      search: { category: "Men" },
      bg: ""
    },
    {
      key: "kids",
      title: "Kids",
      desc: "Best Shoes For Kids",
      cta: "Discover More",
      to: "/shop",
      search: { category: "Kids" },
      bg: ""
    },
    {
      key: "trending",
      title: "Trending",
      desc: "Best Trend Collections",
      cta: "Discover More",
      to: "/shop",
      search: { collection: "Trending" },
      bg: ""
    }
  ]);

  // Collections Section Banners
  const [collectionsBanners, setCollectionsBanners] = useState<any[]>([
    { key: "sports", title: "Sports", bg: "" },
    { key: "casual", title: "Casual", bg: "" },
    { key: "formal", title: "Formal", bg: "" }
  ]);

  const [originalCollectionsBanners, setOriginalCollectionsBanners] = useState<any[]>([
    { key: "sports", title: "Sports", bg: "" },
    { key: "casual", title: "Casual", bg: "" },
    { key: "formal", title: "Formal", bg: "" }
  ]);

  //  Collage Section Banners
  const [promiseCollage, setPromiseCollage] = useState<any[]>([]);
  const [originalPromiseCollage, setOriginalPromiseCollage] = useState<any[]>([]);
  const [selectedPromiseIdx, setSelectedPromiseIdx] = useState(0);

  const [advertisements, setAdvertisements] = useState<string[]>([]);
  const [originalAdvertisements, setOriginalAdvertisements] = useState<string[]>([]);

  // Announcement Bar state
  type AnnouncementItem = { id: number; text: string };
  const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
    { id: 1, text: "Free shipping above ₹500" },
    { id: 2, text: "Flat 15% OFF on first order • Use code: MOCS15" },
    { id: 3, text: "3-day easy returns & exchange guarantee" },
    { id: 4, text: "100% Authentic Handcrafted Comfort Footwear" },
  ];
  const [announcementBar, setAnnouncementBar] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  const [originalAnnouncementBar, setOriginalAnnouncementBar] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);

  const [selectedBannerIdx, setSelectedBannerIdx] = useState(0);
  const [selectedCollectionIdx, setSelectedCollectionIdx] = useState(0);

  const [activeSection, setActiveSection] = useState("announcement-bar");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140; // sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" }
    );

    const sections = ["announcement-bar", "hero-slideshow", "promo-banner", "collections-banners", "promise-collage", "auth-page", "advertisements"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  const isDirty =
    JSON.stringify(heroSlides) !== JSON.stringify(originalSlides) ||
    JSON.stringify(categoriesBanners) !== JSON.stringify(originalCategoriesBanners) ||
    JSON.stringify(collectionsBanners) !== JSON.stringify(originalCollectionsBanners) ||
    JSON.stringify(promiseCollage) !== JSON.stringify(originalPromiseCollage) ||
    JSON.stringify(authSettings) !== JSON.stringify(originalAuthSettings) ||
    JSON.stringify(advertisements) !== JSON.stringify(originalAdvertisements) ||
    JSON.stringify(announcementBar) !== JSON.stringify(originalAnnouncementBar);

  const blocker = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes in settings.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const heroRes = await apiClient.settings.get("hero_slides").catch(() => null);
        const bannerRes = await apiClient.settings.get("categories_banners").catch(() => null);
        const collectionsRes = await apiClient.settings.get("collections_banners").catch(() => null);

        const promiseRes = await apiClient.settings.get("promise_collage").catch(() => null);
        const authRes = await apiClient.settings.get("auth_settings").catch(() => null);
        const adsRes = await apiClient.settings.get("advertisements").catch(() => null);
        const announcementRes = await apiClient.settings.get("announcement_bar").catch(() => null);

        if (heroRes && Array.isArray(heroRes.value)) {
          setHeroSlides(heroRes.value);
          setOriginalSlides(JSON.parse(JSON.stringify(heroRes.value)));
        } else {
          const fallbacks = [
            {
              bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920",
              to: "/shop",
            }
          ];
          setHeroSlides(fallbacks);
          setOriginalSlides(JSON.parse(JSON.stringify(fallbacks)));
        }

        if (bannerRes && bannerRes.value && Array.isArray(bannerRes.value) && bannerRes.value.length === 5) {
          setCategoriesBanners(bannerRes.value);
          setOriginalCategoriesBanners(JSON.parse(JSON.stringify(bannerRes.value)));
        }

        const defaultCollections = [
          { key: "sports", title: "SPORTS", bg: "https://images.unsplash.com/photo-1517649763962-0c623066013b", to: "/shop", search: { collection: "Sports" } },
          { key: "casual", title: "CASUAL", bg: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77", to: "/shop", search: { collection: "Casual" } },
          { key: "formal", title: "FORMAL", bg: "https://images.unsplash.com/photo-1486308512493-ae6a625e368a", to: "/shop", search: { collection: "Formal" } }
        ];
        if (collectionsRes && collectionsRes.value && Array.isArray(collectionsRes.value)) {
          setCollectionsBanners(collectionsRes.value);
          setOriginalCollectionsBanners(JSON.parse(JSON.stringify(collectionsRes.value)));
        } else {
          setCollectionsBanners(defaultCollections);
          setOriginalCollectionsBanners(JSON.parse(JSON.stringify(defaultCollections)));
        }

        const defaultPromiseCollage = [
          {
            key: "top-left",
            title: "Top Left Image",
            to: "/shop",
            bg: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800"
          },
          {
            key: "bottom-left",
            subtitle: "CONFIDENCE",
            title: "Feoro Woman Power",
            desc: "Bold heels & elegant flats for the woman who leads.",
            cta: "Explore",
            to: "/shop",
            bg: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800"
          },
          {
            key: "right",
            title: "Right Side Image",
            to: "/shop",
            bg: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800"
          }
        ];
        if (promiseRes && promiseRes.value && Array.isArray(promiseRes.value) && promiseRes.value.length > 0) {
          setPromiseCollage(promiseRes.value);
          setOriginalPromiseCollage(JSON.parse(JSON.stringify(promiseRes.value)));
        } else {
          setPromiseCollage(defaultPromiseCollage);
          setOriginalPromiseCollage(JSON.parse(JSON.stringify(defaultPromiseCollage)));
        }

        if (authRes && authRes.value) {
          let val = authRes.value;
          if (!val.slides) {
            val = {
              slides: [
                { image: val.loginImage || "", title: val.loginTitle || "Discover Your Style", subtitle: val.loginSubtitle || "Explore premium MOCS collections tailored just for you." },
                { image: val.signupImage || "", title: val.signupTitle || "Create Your Vision", subtitle: val.signupSubtitle || "Join our community to unlock custom footwear and personalized styles." },
                { image: "", title: "Crafted For Comfort", subtitle: "Every pair is built for active lifestyles and durable comfort." }
              ]
            };
          }
          setAuthSettings(val);
          setOriginalAuthSettings(JSON.parse(JSON.stringify(val)));
        }

        if (adsRes && adsRes.value && Array.isArray(adsRes.value)) {
          setAdvertisements(adsRes.value);
          setOriginalAdvertisements(JSON.parse(JSON.stringify(adsRes.value)));
        } else {
          setAdvertisements([]);
          setOriginalAdvertisements([]);
        }

        if (announcementRes && announcementRes.value && Array.isArray(announcementRes.value) && announcementRes.value.length > 0) {
          const loaded = announcementRes.value.map((item: any, i: number) => ({
            id: i + 1,
            text: typeof item === "string" ? item : (item.text || ""),
          }));
          setAnnouncementBar(loaded);
          setOriginalAnnouncementBar(JSON.parse(JSON.stringify(loaded)));
        }
      } catch (err: any) {
        toast.error("Failed to load settings from server", { id: "load-settings-error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await apiClient.settings.update("hero_slides", heroSlides);
      await apiClient.settings.update("categories_banners", categoriesBanners);
      await apiClient.settings.update("collections_banners", collectionsBanners);
      await apiClient.settings.update("promise_collage", promiseCollage);
      await apiClient.settings.update("auth_settings", authSettings);
      await apiClient.settings.update("advertisements", advertisements);
      await apiClient.settings.update("announcement_bar", announcementBar);
      setOriginalSlides(JSON.parse(JSON.stringify(heroSlides)));
      setOriginalCategoriesBanners(JSON.parse(JSON.stringify(categoriesBanners)));
      setOriginalCollectionsBanners(JSON.parse(JSON.stringify(collectionsBanners)));
      setOriginalPromiseCollage(JSON.parse(JSON.stringify(promiseCollage)));
      setOriginalAuthSettings(JSON.parse(JSON.stringify(authSettings)));
      setOriginalAdvertisements(JSON.parse(JSON.stringify(advertisements)));
      setOriginalAnnouncementBar(JSON.parse(JSON.stringify(announcementBar)));
      toast.success("Settings updated successfully!");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setHeroSlides(JSON.parse(JSON.stringify(originalSlides)));
    setCategoriesBanners(JSON.parse(JSON.stringify(originalCategoriesBanners)));
    setCollectionsBanners(JSON.parse(JSON.stringify(originalCollectionsBanners)));
    setPromiseCollage(JSON.parse(JSON.stringify(originalPromiseCollage)));
    setAuthSettings(JSON.parse(JSON.stringify(originalAuthSettings)));
    setAdvertisements(JSON.parse(JSON.stringify(originalAdvertisements)));
    setAnnouncementBar(JSON.parse(JSON.stringify(originalAnnouncementBar)));
    toast.info("Unsaved changes discarded");
  };

  const addPromiseBanner = () => {
    setPromiseCollage([
      ...promiseCollage,
      {
        key: `promise-${Date.now()}`,
        title: "New Collage Card",
        bg: "",
        to: "/shop"
      }
    ]);
    setSelectedPromiseIdx(promiseCollage.length);
  };

  const removePromiseBanner = (idx: number) => {
    const nextList = promiseCollage.filter((_, i) => i !== idx);
    setPromiseCollage(nextList);
    setSelectedPromiseIdx(Math.max(0, idx - 1));
  };

  const updatePromiseField = (idx: number, field: string, value: any) => {
    setPromiseCollage(
      promiseCollage.map((b, i) => (i === idx ? { ...b, [field]: value } : b))
    );
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    toastMsg: string,
    toastId: string,
    onSuccess: (url: string) => void,
    type?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    if (type) formData.append("type", type);

    try {
      toast.loading(toastMsg, { id: toastId });
      const token = localStorage.getItem("mocs_token");
      const urlQuery = type ? `?type=${encodeURIComponent(type)}` : "";
      const res = await fetch(`${API_BASE_URL}/api/products/upload${urlQuery}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onSuccess(data.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Failed to upload image", { id: toastId });
    }
  };

  const handlePromiseFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    handleFileUpload(e, "Uploading image...", `promise-upload-${idx}`, (url) => updatePromiseField(idx, "bg", url), "promise");
  };

  const addAdsImageByUrl = (url: string) => {
    setAdvertisements((prev) => [...prev, url]);
  };

  const removeAdsImage = (idx: number) => {
    setAdvertisements((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(
      e,
      "Uploading advertisement image...",
      `ad-upload-${Date.now()}`,
      (url) => setAdvertisements((prev) => [...prev, url]),
      "advertisement"
    );
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    handleFileUpload(e, "Uploading background image...", `banner-upload-${idx}`, (url) => updateBannerField(idx, "bg", url), "banner");
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    handleFileUpload(e, "Uploading desktop hero image...", `hero-upload-${idx}`, (url) => updateHeroSlideField(idx, "bg", url), "hero-banner");
  };

  const handleHeroMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    handleFileUpload(e, "Uploading mobile hero image...", `hero-mobile-upload-${idx}`, (url) => updateHeroSlideField(idx, "mobileBg", url), "hero-mobile-banner");
  };

  const handleCollectionFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    handleFileUpload(e, "Uploading background image...", `collection-upload-${idx}`, (url) => updateCollectionField(idx, "bg", url), "collection-banner");
  };

  const handleAuthFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    handleFileUpload(e, `Uploading slide ${idx + 1}...`, `auth-upload-${idx}`, (url) => {
      setAuthSettings((prev: any) => {
        const newSlides = [...prev.slides];
        newSlides[idx] = { ...newSlides[idx], image: url };
        return { ...prev, slides: newSlides };
      });
    }, "auth-slide");
  };

  const updateBannerField = (idx: number, field: string, value: any) => {
    setCategoriesBanners(
      categoriesBanners.map((b, i) => (i === idx ? { ...b, [field]: value } : b))
    );
  };

  const updateCollectionField = (idx: number, field: string, value: any) => {
    setCollectionsBanners(
      collectionsBanners.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const addCollectionBanner = () => {
    setCollectionsBanners([
      ...collectionsBanners,
      {
        key: `collection-${Date.now()}`,
        title: "NEW COLLECTION",
        bg: "",
        to: "/shop",
        search: { collection: "" }
      }
    ]);
    setSelectedCollectionIdx(collectionsBanners.length);
  };

  const removeCollectionBanner = (idx: number) => {
    const nextList = collectionsBanners.filter((_, i) => i !== idx);
    setCollectionsBanners(nextList);
    setSelectedCollectionIdx(Math.max(0, idx - 1));
  };

  const addHeroSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        bg: "",
        to: "/shop",
      }
    ]);
  };

  const removeHeroSlide = (idx: number) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== idx));
  };

  const updateHeroSlideField = (idx: number, field: string, value: string) => {
    setHeroSlides(
      heroSlides.map((slide, i) => (i === idx ? { ...slide, [field]: value } : slide))
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-left relative pb-28 sm:pb-32">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Global Configurations</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Manage Hero slideshow assets and category banners.</p>
      </div>

      {/* Sticky Sub-Navigation Tabs */}
      <div className="sticky top-[58px] sm:top-[70px] z-30 bg-background/90 backdrop-blur-md border-b border-border py-3 flex gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => scrollToSection("announcement-bar")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "announcement-bar"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Announcement Bar
        </button>
        <button
          onClick={() => scrollToSection("hero-slideshow")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "hero-slideshow"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Hero Slideshow
        </button>
        <button
          onClick={() => scrollToSection("promo-banner")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "promo-banner"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Category Banners
        </button>
        <button
          onClick={() => scrollToSection("collections-banners")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "collections-banners"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Collections Section
        </button>
        <button
          onClick={() => scrollToSection("promise-collage")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "promise-collage"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
           Collage
        </button>
        <button
          onClick={() => scrollToSection("auth-page")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "auth-page"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Login images
        </button>
        <button
          onClick={() => scrollToSection("advertisements")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap",
            activeSection === "advertisements"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Advertisements
        </button>
      </div>

      <div className="space-y-20">
        {/* Announcement Bar section */}
        <AnnouncementBarConfig
          announcements={announcementBar}
          setAnnouncements={setAnnouncementBar}
        />

        <HeroSlidesConfig
          heroSlides={heroSlides}
          updateHeroSlideField={updateHeroSlideField}
          addHeroSlide={addHeroSlide}
          removeHeroSlide={removeHeroSlide}
          handleHeroFileChange={handleHeroFileChange}
          handleHeroMobileFileChange={handleHeroMobileFileChange}
          openFocusIdx={openFocusIdx}
          setOpenFocusIdx={setOpenFocusIdx}
        />

        <CategoryBannersConfig
          categoriesBanners={categoriesBanners}
          selectedBannerIdx={selectedBannerIdx}
          setSelectedBannerIdx={setSelectedBannerIdx}
          updateBannerField={updateBannerField}
          handleBannerFileChange={handleBannerFileChange}
          getImageUrl={getImageUrl}
        />

        <CollectionsConfig
          collectionsBanners={collectionsBanners}
          selectedCollectionIdx={selectedCollectionIdx}
          setSelectedCollectionIdx={setSelectedCollectionIdx}
          updateCollectionField={updateCollectionField}
          addCollectionBanner={addCollectionBanner}
          removeCollectionBanner={removeCollectionBanner}
          handleCollectionFileChange={handleCollectionFileChange}
          getImageUrl={getImageUrl}
        />

        <CollageConfig
          promiseCollage={promiseCollage}
          selectedPromiseIdx={selectedPromiseIdx}
          setSelectedPromiseIdx={setSelectedPromiseIdx}
          updatePromiseField={updatePromiseField}
          addPromiseBanner={addPromiseBanner}
          removePromiseBanner={removePromiseBanner}
          handlePromiseFileChange={handlePromiseFileChange}
          getImageUrl={getImageUrl}
        />

        <AuthConfig
          authSettings={authSettings}
          setAuthSettings={setAuthSettings}
          handleAuthFileChange={handleAuthFileChange}
          getImageUrl={getImageUrl}
        />

        <AdvertisementsConfig
          advertisements={advertisements}
          addAdsImageByUrl={addAdsImageByUrl}
          removeAdsImage={removeAdsImage}
          handleAdsFileChange={handleAdsFileChange}
          getImageUrl={getImageUrl}
        />

      </div>

      {/* Floating Save Changes Pill / Action Bar (Portaled directly to document.body) */}
      {(() => {
        const floatingBar = (
          <div
            className={cn(
              "fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-50 pointer-events-auto transition-all duration-300",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 sm:gap-2.5 rounded-full p-1.5 sm:p-2 backdrop-blur-xl border shadow-2xl transition-all duration-300",
                isDirty
                  ? "bg-card/95 border-primary/50 ring-4 ring-primary/20 shadow-[0_12px_40px_-8px_rgba(244,106,30,0.5)]"
                  : "bg-card/90 border-border/70 hover:border-border shadow-xl shadow-black/10"
              )}
            >
              {isDirty ? (
                <>
                  <div className="flex items-center gap-2 pl-3 pr-1 text-xs select-none">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                    </span>
                    <span className="font-semibold text-foreground hidden md:inline">Unsaved Changes</span>
                  </div>

                  <button
                    onClick={handleDiscardChanges}
                    disabled={saving}
                    type="button"
                    aria-label="Discard unsaved changes"
                    title="Discard unsaved changes"
                    className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Discard</span>
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    type="button"
                    aria-label="Save settings changes"
                    className="group relative flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#f46a1e] to-[#e0580c] hover:brightness-110 shadow-lg shadow-[#f46a1e]/35 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 pl-3 pr-2 text-xs text-muted-foreground font-medium select-none hidden sm:flex">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80">Saved</span>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    type="button"
                    aria-label="Save settings changes"
                    className="group relative flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-glow shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    {saving ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        );

        return mounted && typeof document !== "undefined"
          ? createPortal(floatingBar, document.body)
          : floatingBar;
      })()}

      {/* Centered Route Leave Blocker Modal */}
      {blocker.status === "blocked" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-card space-y-4 text-left">
            <h3 className="font-display text-lg font-bold text-foreground">Unsaved Changes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have modified global configuration parameters. Would you like to save these changes before leaving the page?
            </p>
            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  blocker.reset();
                }}
                className="rounded-full border border-border bg-background px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setHeroSlides(originalSlides);
                  setCategoriesBanners(originalCategoriesBanners);
                  setCollectionsBanners(originalCollectionsBanners);
                  setPromiseCollage(originalPromiseCollage);
                  setAuthSettings(originalAuthSettings);
                  setAdvertisements(originalAdvertisements);
                  setAnnouncementBar(originalAnnouncementBar);
                  blocker.proceed();
                }}
                className="rounded-full border border-destructive/30 bg-destructive/10 text-destructive px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-destructive/20 cursor-pointer"
              >
                Discard & Leave
              </button>
              <button
                onClick={async () => {
                  const saved = await handleSaveSettings();
                  if (saved) {
                    blocker.proceed();
                  } else {
                    blocker.reset();
                  }
                }}
                className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-primary-glow cursor-pointer"
              >
                Save & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
