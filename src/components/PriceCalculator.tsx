"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { persistWebsiteForm, submitLead } from "@/lib/api";

type SelectOption = {
  label: string;
  price: number;
  multiplier?: number;
};

type SelectGroup = {
  key: string;
  label: string;
  options: SelectOption[];
};

type NumberGroup = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  included: number;
  pricePerUnit: number;
};

type FeatureOption = {
  label: string;
  price: number;
};

type CalculatorCategory = {
  id: string;
  label: string;
  basePrice: number;
  selectGroups: SelectGroup[];
  numberGroups: NumberGroup[];
  featureLabel: string;
  features: FeatureOption[];
  multiplierGroup: SelectGroup;
};

type Estimate = {
  id: string;
  date: string;
  submittedAt: string;
};

type CustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  notes: string;
};

type BreakdownItem = {
  label: string;
  value: string;
  price: number;
};

type Currency = "INR" | "USD";
type ExchangeRateStatus = "loading" | "live" | "fallback";

const SAFE_USD_INR_RATE = 85;
const PRIMARY_USD_INR_API = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR";
const FALLBACK_USD_INR_API = "https://open.er-api.com/v6/latest/USD";
const currencyOptions: Array<{ label: string; symbol: string; value: Currency }> = [
  { label: "INR", symbol: "₹", value: "INR" },
  { label: "USD", symbol: "$", value: "USD" },
];

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const inputClass =
  "rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none shadow-sm shadow-blue-100/30 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const primaryPanelClass =
  "rounded-[2rem] border border-blue-100/80 bg-white/82 shadow-[0_25px_80px_rgba(37,99,235,0.10)] ring-1 ring-white/70 backdrop-blur-xl";

const timelineOptions: SelectOption[] = [
  { label: "Standard", price: 0, multiplier: 1 },
  { label: "Fast", price: 0, multiplier: 1.2 },
  { label: "Urgent", price: 0, multiplier: 1.4 },
];

const durationOptions: SelectOption[] = [
  { label: "1 month", price: 0, multiplier: 1 },
  { label: "3 months", price: 0, multiplier: 2.7 },
  { label: "6 months", price: 0, multiplier: 5 },
  { label: "12 months", price: 0, multiplier: 9.5 },
];

const adDurationOptions: SelectOption[] = durationOptions.slice(0, 3);

const categories: CalculatorCategory[] = [
  {
    id: "website",
    label: "Website Development",
    basePrice: 25000,
    selectGroups: [
      {
        key: "level",
        label: "Website level",
        options: [
          { label: "Small Business", price: 0 },
          { label: "Growth", price: 25000 },
          { label: "Enterprise", price: 70000 },
        ],
      },
      {
        key: "design",
        label: "Design type",
        options: [
          { label: "Basic", price: 0 },
          { label: "Premium", price: 18000 },
          { label: "Custom UI/UX", price: 45000 },
        ],
      },
    ],
    numberGroups: [
      {
        key: "pages",
        label: "Number of pages",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 6,
        unit: "pages",
        included: 5,
        pricePerUnit: 3500,
      },
    ],
    featureLabel: "Features",
    features: [
      { label: "Contact form", price: 4000 },
      { label: "Blog", price: 9000 },
      { label: "Payment gateway", price: 18000 },
      { label: "Admin panel", price: 35000 },
      { label: "SEO setup", price: 10000 },
      { label: "Speed optimization", price: 9000 },
    ],
    multiplierGroup: { key: "timeline", label: "Timeline", options: timelineOptions },
  },
  {
    id: "mobile-app",
    label: "Mobile App Development",
    basePrice: 85000,
    selectGroups: [
      {
        key: "level",
        label: "App level",
        options: [
          { label: "MVP", price: 0 },
          { label: "Business App", price: 65000 },
          { label: "Enterprise App", price: 160000 },
        ],
      },
      {
        key: "platforms",
        label: "Platforms",
        options: [
          { label: "Android", price: 0 },
          { label: "iOS", price: 20000 },
          { label: "Android + iOS", price: 55000 },
        ],
      },
    ],
    numberGroups: [
      {
        key: "screens",
        label: "Screens count",
        min: 5,
        max: 80,
        step: 1,
        defaultValue: 12,
        unit: "screens",
        included: 10,
        pricePerUnit: 4500,
      },
    ],
    featureLabel: "Features",
    features: [
      { label: "Login/Auth", price: 18000 },
      { label: "Payment gateway", price: 25000 },
      { label: "Admin dashboard", price: 45000 },
      { label: "Push notifications", price: 14000 },
      { label: "Chat", price: 35000 },
      { label: "Analytics", price: 18000 },
    ],
    multiplierGroup: { key: "timeline", label: "Timeline", options: timelineOptions },
  },
  {
    id: "software",
    label: "Software Development",
    basePrice: 90000,
    selectGroups: [
      {
        key: "level",
        label: "Level",
        options: [
          { label: "Internal Tool", price: 0 },
          { label: "Business Software", price: 75000 },
          { label: "Enterprise System", price: 200000 },
        ],
      },
      {
        key: "users",
        label: "Users range",
        options: [
          { label: "1-10 users", price: 0 },
          { label: "11-50 users", price: 25000 },
          { label: "51-200 users", price: 70000 },
          { label: "200+ users", price: 140000 },
        ],
      },
    ],
    numberGroups: [
      {
        key: "modules",
        label: "Modules count",
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 4,
        unit: "modules",
        included: 3,
        pricePerUnit: 22000,
      },
    ],
    featureLabel: "Features",
    features: [
      { label: "Dashboard", price: 18000 },
      { label: "Roles & permissions", price: 24000 },
      { label: "Reports", price: 22000 },
      { label: "API integration", price: 30000 },
      { label: "Automation", price: 35000 },
      { label: "Cloud deployment", price: 16000 },
    ],
    multiplierGroup: { key: "timeline", label: "Timeline", options: timelineOptions },
  },
  {
    id: "saas",
    label: "SaaS Product Development",
    basePrice: 120000,
    selectGroups: [
      {
        key: "level",
        label: "Level",
        options: [
          { label: "MVP SaaS", price: 0 },
          { label: "Growth SaaS", price: 110000 },
          { label: "Enterprise SaaS", price: 280000 },
        ],
      },
      {
        key: "tenant",
        label: "Tenant support",
        options: [
          { label: "Single tenant", price: 0 },
          { label: "Multi tenant", price: 90000 },
        ],
      },
    ],
    numberGroups: [
      {
        key: "modules",
        label: "Modules count",
        min: 2,
        max: 30,
        step: 1,
        defaultValue: 5,
        unit: "modules",
        included: 4,
        pricePerUnit: 28000,
      },
    ],
    featureLabel: "Features",
    features: [
      { label: "Subscription billing", price: 45000 },
      { label: "User management", price: 28000 },
      { label: "Admin dashboard", price: 42000 },
      { label: "API", price: 35000 },
      { label: "Analytics", price: 26000 },
      { label: "Email notifications", price: 12000 },
    ],
    multiplierGroup: { key: "timeline", label: "Timeline", options: timelineOptions },
  },
  {
    id: "ai-automation",
    label: "AI Automation",
    basePrice: 35000,
    selectGroups: [
      {
        key: "level",
        label: "Level",
        options: [
          { label: "Basic Automation", price: 0 },
          { label: "Business Workflow", price: 40000 },
          { label: "Advanced AI System", price: 120000 },
        ],
      },
    ],
    numberGroups: [
      {
        key: "automations",
        label: "Automations count",
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 3,
        unit: "automations",
        included: 2,
        pricePerUnit: 12000,
      },
    ],
    featureLabel: "Features",
    features: [
      { label: "Lead automation", price: 14000 },
      { label: "Email automation", price: 10000 },
      { label: "WhatsApp workflow", price: 18000 },
      { label: "AI chatbot", price: 45000 },
      { label: "CRM integration", price: 30000 },
      { label: "Reports", price: 12000 },
    ],
    multiplierGroup: { key: "timeline", label: "Timeline", options: timelineOptions },
  },
  {
    id: "seo",
    label: "SEO Services",
    basePrice: 12000,
    selectGroups: [
      {
        key: "plan",
        label: "Plan",
        options: [
          { label: "Starter", price: 0 },
          { label: "Growth", price: 15000 },
          { label: "Advanced", price: 35000 },
        ],
      },
    ],
    numberGroups: [
      {
        key: "keywords",
        label: "Pages/keywords count",
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 15,
        unit: "pages or keywords",
        included: 10,
        pricePerUnit: 900,
      },
    ],
    featureLabel: "Services",
    features: [
      { label: "Technical SEO", price: 6000 },
      { label: "On-page SEO", price: 7000 },
      { label: "Local SEO", price: 6000 },
      { label: "Content strategy", price: 9000 },
      { label: "Monthly report", price: 3000 },
    ],
    multiplierGroup: { key: "duration", label: "Duration", options: durationOptions },
  },
  {
    id: "google-ads",
    label: "Google Ads Management",
    basePrice: 10000,
    selectGroups: [
      {
        key: "plan",
        label: "Plan",
        options: [
          { label: "Starter", price: 0 },
          { label: "Growth", price: 12000 },
          { label: "Scale", price: 28000 },
        ],
      },
      {
        key: "budget",
        label: "Monthly ad budget range",
        options: [
          { label: "Under Rs 50,000", price: 0 },
          { label: "Rs 50,000 - Rs 1,50,000", price: 8000 },
          { label: "Rs 1,50,000 - Rs 5,00,000", price: 22000 },
          { label: "Rs 5,00,000+", price: 45000 },
        ],
      },
    ],
    numberGroups: [],
    featureLabel: "Services",
    features: [
      { label: "Campaign setup", price: 7000 },
      { label: "Keyword research", price: 5000 },
      { label: "Landing page suggestions", price: 6000 },
      { label: "Conversion tracking", price: 7000 },
      { label: "Monthly reporting", price: 3000 },
    ],
    multiplierGroup: { key: "duration", label: "Duration", options: adDurationOptions },
  },
  {
    id: "meta-ads",
    label: "Meta Ads Management",
    basePrice: 10000,
    selectGroups: [
      {
        key: "plan",
        label: "Plan",
        options: [
          { label: "Starter", price: 0 },
          { label: "Growth", price: 12000 },
          { label: "Scale", price: 28000 },
        ],
      },
      {
        key: "budget",
        label: "Monthly ad budget range",
        options: [
          { label: "Under Rs 50,000", price: 0 },
          { label: "Rs 50,000 - Rs 1,50,000", price: 8000 },
          { label: "Rs 1,50,000 - Rs 5,00,000", price: 22000 },
          { label: "Rs 5,00,000+", price: 45000 },
        ],
      },
    ],
    numberGroups: [],
    featureLabel: "Services",
    features: [
      { label: "Campaign setup", price: 7000 },
      { label: "Creative suggestions", price: 5000 },
      { label: "Audience setup", price: 5000 },
      { label: "Pixel setup", price: 7000 },
      { label: "Monthly reporting", price: 3000 },
    ],
    multiplierGroup: { key: "duration", label: "Duration", options: adDurationOptions },
  },
  {
    id: "gmb",
    label: "GMB Reputation Management",
    basePrice: 8000,
    selectGroups: [
      {
        key: "plan",
        label: "Plan",
        options: [
          { label: "Basic", price: 0 },
          { label: "Growth", price: 10000 },
          { label: "Premium", price: 24000 },
        ],
      },
      {
        key: "volume",
        label: "Review outreach volume",
        options: [
          { label: "25", price: 0 },
          { label: "50", price: 5000 },
          { label: "100", price: 12000 },
          { label: "250", price: 30000 },
        ],
      },
    ],
    numberGroups: [],
    featureLabel: "Services",
    features: [
      { label: "GMB profile audit", price: 4000 },
      { label: "Review request campaign", price: 6000 },
      { label: "Customer feedback collection", price: 7000 },
      { label: "Reputation report", price: 3000 },
      { label: "Profile optimization suggestions", price: 5000 },
    ],
    multiplierGroup: { key: "duration", label: "Duration", options: adDurationOptions },
  },
];

function getValidRate(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function formatMoney(valueInInr: number, currency: Currency, usdInrRate: number) {
  if (currency === "USD") {
    return usdFormatter.format(valueInInr / usdInrRate);
  }

  return inrFormatter.format(Math.round(valueInInr));
}

function createEstimateId(date: Date) {
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `GRW-${date.getFullYear()}-${suffix}`;
}

function getInitialSelections(category: CalculatorCategory) {
  const selectValues = Object.fromEntries(
    [...category.selectGroups, category.multiplierGroup].map((group) => [
      group.key,
      group.options[0]?.label ?? "",
    ]),
  );
  const numberValues = Object.fromEntries(
    category.numberGroups.map((group) => [group.key, group.defaultValue]),
  );

  return { selectValues, numberValues, featureValues: [] as string[] };
}

export default function PriceCalculator() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id);
  const selectedCategory = categories.find((item) => item.id === selectedCategoryId) ?? categories[0];
  const initialSelections = getInitialSelections(selectedCategory);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [usdInrRate, setUsdInrRate] = useState(SAFE_USD_INR_RATE);
  const [exchangeRateStatus, setExchangeRateStatus] = useState<ExchangeRateStatus>("loading");
  const [selectValues, setSelectValues] = useState<Record<string, string>>(initialSelections.selectValues);
  const [numberValues, setNumberValues] = useState<Record<string, number>>(initialSelections.numberValues);
  const [featureValues, setFeatureValues] = useState<string[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    notes: "",
  });
  const [validationMessage, setValidationMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const submittingRef = useRef(false);
  const submissionKeyRef = useRef("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchUsdInrRate() {
      try {
        const primaryResponse = await fetch(PRIMARY_USD_INR_API);

        if (!primaryResponse.ok) {
          throw new Error("Primary exchange rate request failed.");
        }

        const primaryData = (await primaryResponse.json()) as { rates?: { INR?: unknown } };
        const primaryRate = getValidRate(primaryData.rates?.INR);

        if (!primaryRate) {
          throw new Error("Primary exchange rate was invalid.");
        }

        if (isActive) {
          setUsdInrRate(primaryRate);
          setExchangeRateStatus("live");
        }
      } catch {
        try {
          const fallbackResponse = await fetch(FALLBACK_USD_INR_API);

          if (!fallbackResponse.ok) {
            throw new Error("Fallback exchange rate request failed.");
          }

          const fallbackData = (await fallbackResponse.json()) as { rates?: { INR?: unknown } };
          const fallbackRate = getValidRate(fallbackData.rates?.INR);

          if (!fallbackRate) {
            throw new Error("Fallback exchange rate was invalid.");
          }

          if (isActive) {
            setUsdInrRate(fallbackRate);
            setExchangeRateStatus("live");
          }
        } catch {
          if (isActive) {
            setUsdInrRate(SAFE_USD_INR_RATE);
            setExchangeRateStatus("fallback");
          }
        }
      }
    }

    fetchUsdInrRate();

    return () => {
      isActive = false;
    };
  }, []);

  function updateCustomerDetails(field: keyof CustomerDetails, value: string) {
    setCustomerDetails((current) => ({ ...current, [field]: value }));
    setValidationMessage("");
    setSubmitStatus("idle");
    setSubmitMessage("");
    setEstimate(null);
  }

  function updateCategory(categoryId: string) {
    const nextCategory = categories.find((item) => item.id === categoryId) ?? categories[0];
    const nextSelections = getInitialSelections(nextCategory);

    setSelectedCategoryId(categoryId);
    setSelectValues(nextSelections.selectValues);
    setNumberValues(nextSelections.numberValues);
    setFeatureValues([]);
    setEstimate(null);
    setSubmitStatus("idle");
    setSubmitMessage("");
  }

  const result = useMemo(() => {
    let subtotal = selectedCategory.basePrice;
    const selectedOptions: string[] = [
      `Base estimate: ${formatMoney(selectedCategory.basePrice, currency, usdInrRate)}`,
    ];
    const breakdownItems: BreakdownItem[] = [
      { label: "Base price", value: selectedCategory.label, price: selectedCategory.basePrice },
    ];

    selectedCategory.selectGroups.forEach((group) => {
      const option = group.options.find((item) => item.label === selectValues[group.key]) ?? group.options[0];
      if (!option) return;
      subtotal += option.price;
      selectedOptions.push(`${group.label}: ${option.label}`);
      breakdownItems.push({
        label: group.label,
        value: option.label,
        price: option.price,
      });
    });

    selectedCategory.numberGroups.forEach((group) => {
      const value = numberValues[group.key] ?? group.defaultValue;
      const billableUnits = Math.max(0, value - group.included);
      const price = billableUnits * group.pricePerUnit;
      subtotal += price;
      selectedOptions.push(`${group.label}: ${value} ${group.unit}`);
      breakdownItems.push({
        label: group.label,
        value: `${value} ${group.unit} (${billableUnits} additional)`,
        price,
      });
    });

    selectedCategory.features.forEach((feature) => {
      if (featureValues.includes(feature.label)) {
        subtotal += feature.price;
        selectedOptions.push(`${selectedCategory.featureLabel}: ${feature.label}`);
        breakdownItems.push({
          label: selectedCategory.featureLabel,
          value: feature.label,
          price: feature.price,
        });
      }
    });

    const multiplierOption =
      selectedCategory.multiplierGroup.options.find(
        (item) => item.label === selectValues[selectedCategory.multiplierGroup.key],
      ) ?? selectedCategory.multiplierGroup.options[0];
    const multiplier = multiplierOption?.multiplier ?? 1;
    const total = subtotal * multiplier;

    if (multiplierOption) {
      selectedOptions.push(`${selectedCategory.multiplierGroup.label}: ${multiplierOption.label}`);
    }

    return {
      subtotal,
      multiplier,
      multiplierLabel: multiplierOption?.label ?? "Standard",
      total,
      selectedOptions,
      breakdownItems,
    };
  }, [currency, featureValues, numberValues, selectValues, selectedCategory, usdInrRate]);

  function toggleFeature(feature: string) {
    setEstimate(null);
    setSubmitStatus("idle");
    setSubmitMessage("");
    setFeatureValues((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    );
  }

  function validateCustomerDetails() {
    if (!customerDetails.fullName.trim()) {
      return "Please enter your full name before generating the estimate.";
    }

    return "";
  }

  function generateEstimate() {
    const message = validateCustomerDetails();

    if (message) {
      setValidationMessage(message);
      setEstimate(null);
      return;
    }

    const date = new Date();
    submissionKeyRef.current = "";
    setValidationMessage("");
    setSubmitStatus("idle");
    setSubmitMessage("");
    setEstimate({
      id: createEstimateId(date),
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      submittedAt: date.toISOString(),
    });
  }

  async function sendEstimateRequest() {
    if (!estimate || submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setSubmitStatus("loading");
    setSubmitMessage("");

    const selectedOptionsText = result.selectedOptions.join("\n");
    const breakdownText = result.breakdownItems
      .map((item) => `${item.label}: ${item.value} - ${formatMoney(item.price, currency, usdInrRate)}`)
      .join("\n");
    const website = honeypotRef.current?.value.trim() || "";
    const requirements = [
      customerDetails.notes.trim(),
      `Estimate ID: ${estimate.id}`,
      `Company: ${customerDetails.company || ""}`,
      `Location: ${customerDetails.location || ""}`,
      `Currency: ${currency}`,
      `Conversion rate: 1 USD = Rs ${usdInrRate.toFixed(2)}`,
      `Selected options:\n${selectedOptionsText}`,
      `Pricing breakdown:\n${breakdownText}`,
      `Base price: ${formatMoney(selectedCategory.basePrice, currency, usdInrRate)}`,
      `Subtotal: ${formatMoney(result.subtotal, currency, usdInrRate)}`,
      `Multiplier: ${result.multiplier.toFixed(2)}x (${result.multiplierLabel})`,
      `Estimated total: ${formatMoney(result.total, currency, usdInrRate)}`,
      `Estimated total INR: ${formatMoney(result.total, "INR", usdInrRate)}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      submissionKeyRef.current ||= crypto.randomUUID();

      await persistWebsiteForm("/api/quote-requests/", {
        submissionKey: submissionKeyRef.current,
        name: customerDetails.fullName.trim(),
        email: customerDetails.email.trim() || undefined,
        phone: customerDetails.phone.trim() || undefined,
        company: customerDetails.company.trim() || undefined,
        location: customerDetails.location.trim() || undefined,
        service: selectedCategory.label,
        budget: formatMoney(result.total, currency, usdInrRate),
        requirements,
        calculatorData: {
          estimateId: estimate.id,
          submittedAt: estimate.submittedAt,
          category: selectedCategory.label,
          currency,
          conversionRate: usdInrRate,
          selectedOptions: result.selectedOptions,
          breakdownItems: result.breakdownItems,
          basePrice: selectedCategory.basePrice,
          subtotal: result.subtotal,
          multiplier: result.multiplier,
          multiplierLabel: result.multiplierLabel,
          total: result.total,
        },
        source: "price-calculator",
        website,
      });

      if (!website) {
        await submitLead("/leads/contact", {
          name: customerDetails.fullName.trim(),
          email: customerDetails.email.trim() || undefined,
          phone: customerDetails.phone.trim() || undefined,
          service: selectedCategory.label,
          budget: formatMoney(result.total, currency, usdInrRate),
          message: requirements,
          source: "price-calculator",
        });
      }

      setSubmitStatus("success");
      setSubmitMessage("Thanks, our team will contact you soon.");
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="calculator-website">Website</label>
        <input
          ref={honeypotRef}
          id="calculator-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:54px_54px] opacity-50 [mask-image:radial-gradient(circle_at_50%_15%,black,transparent_72%)]" />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_0.72fr] lg:items-start">
        <section className={`${primaryPanelClass} p-4 sm:p-6`}>
        <div className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
              Step 01 / Select service
            </p>
            <div className="flex flex-col gap-1 sm:items-end">
              <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/78 p-1 shadow-lg shadow-blue-100/40 backdrop-blur-xl">
                <span className="pl-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                  Currency
                </span>
                <div className="flex rounded-full bg-blue-50/70 p-1">
                  {currencyOptions.map((option) => {
                    const isActive = currency === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCurrency(option.value)}
                        className={`min-h-9 rounded-full px-3 text-xs font-black transition ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-600 hover:bg-white hover:text-blue-700"
                        }`}
                        aria-pressed={isActive}
                      >
                        {option.label} {option.symbol}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="px-1 text-xs font-bold text-slate-500">
                {exchangeRateStatus === "loading"
                  ? "Fetching live rate..."
                  : `Live rate: ₹${usdInrRate.toFixed(2)} / USD`}
              </p>
              {exchangeRateStatus === "fallback" ? (
                <p className="px-1 text-xs font-bold text-amber-700">
                  Using fallback exchange rate.
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => updateCategory(category.id)}
                className={`relative overflow-hidden rounded-[1.35rem] border px-4 py-4 text-left text-sm font-black leading-5 transition duration-300 hover:-translate-y-1 ${
                  selectedCategory.id === category.id
                    ? "border-blue-500 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/25 ring-1 ring-blue-300/50"
                    : "border-blue-100 bg-white/86 text-slate-700 shadow-sm shadow-blue-100/40 backdrop-blur-xl hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-lg hover:shadow-blue-100/60"
                }`}
              >
                {selectedCategory.id === category.id ? (
                  <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.28),transparent_34%)]" />
                ) : null}
                <span className="relative">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-blue-100/80 bg-[#fbfdff]/82 p-4 shadow-inner shadow-blue-100/40 ring-1 ring-white/70 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                Step 02 / Configure
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {selectedCategory.label}
              </h2>
            </div>
            <p className="w-fit rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/50">
              Starts at {formatMoney(selectedCategory.basePrice, currency, usdInrRate)}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {selectedCategory.selectGroups.map((group) => (
              <label key={group.key} className="grid gap-2 text-sm font-black text-slate-700">
                {group.label}
                <select
                  value={selectValues[group.key] ?? group.options[0]?.label}
                  onChange={(event) => {
                    setEstimate(null);
                    setSelectValues((current) => ({
                      ...current,
                      [group.key]: event.target.value,
                    }));
                  }}
                  className={inputClass}
                >
                  {group.options.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            {selectedCategory.numberGroups.map((group) => (
              <label key={group.key} className="grid gap-2 text-sm font-black text-slate-700">
                <span className="flex items-center justify-between gap-3">
                  {group.label}
                  <span className="text-xs text-blue-700">
                    {numberValues[group.key] ?? group.defaultValue} {group.unit}
                  </span>
                </span>
                <input
                  type="range"
                  min={group.min}
                  max={group.max}
                  step={group.step}
                  value={numberValues[group.key] ?? group.defaultValue}
                  onChange={(event) => {
                    setEstimate(null);
                    setNumberValues((current) => ({
                      ...current,
                      [group.key]: Number(event.target.value),
                    }));
                  }}
                  className="h-2 cursor-pointer accent-blue-600"
                />
                <span className="text-xs font-bold text-slate-500">
                  Includes {group.included} {group.unit}; additional {formatMoney(group.pricePerUnit, currency, usdInrRate)} each
                </span>
              </label>
            ))}

            <label className="grid gap-2 text-sm font-black text-slate-700">
              {selectedCategory.multiplierGroup.label}
              <select
                value={
                  selectValues[selectedCategory.multiplierGroup.key] ??
                  selectedCategory.multiplierGroup.options[0]?.label
                }
                onChange={(event) => {
                  setEstimate(null);
                  setSelectValues((current) => ({
                    ...current,
                    [selectedCategory.multiplierGroup.key]: event.target.value,
                  }));
                }}
                className={inputClass}
              >
                {selectedCategory.multiplierGroup.options.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-black text-slate-700">
              {selectedCategory.featureLabel}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {selectedCategory.features.map((feature) => (
                <button
                  key={feature.label}
                  type="button"
                  onClick={() => toggleFeature(feature.label)}
                  className={`rounded-[1.35rem] border px-4 py-3 text-left text-sm font-black transition duration-300 hover:-translate-y-0.5 ${
                    featureValues.includes(feature.label)
                      ? "border-blue-500 bg-blue-50/95 text-blue-700 shadow-lg shadow-blue-100 ring-1 ring-blue-100"
                      : "border-blue-100 bg-white/86 text-slate-700 shadow-sm shadow-blue-100/30 hover:border-blue-300 hover:bg-white hover:shadow-lg hover:shadow-blue-100/50"
                  }`}
                >
                  <span className="block">{feature.label}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">
                    + {formatMoney(feature.price, currency, usdInrRate)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        </section>

        <aside className={`sticky top-28 ${primaryPanelClass} p-4 sm:p-6 print:static print:border-0 print:p-0 print:shadow-none`}>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
          Step 03 / Your details
        </p>

        <div className="mt-5 grid gap-4 print:hidden">
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Full name *
            <input
              type="text"
              value={customerDetails.fullName}
              onChange={(event) => updateCustomerDetails("fullName", event.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Email *
              <input
                type="email"
                value={customerDetails.email}
                onChange={(event) => updateCustomerDetails("email", event.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Phone *
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(event) => updateCustomerDetails("phone", event.target.value)}
                className={inputClass}
                placeholder="+91..."
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Business / Company name
            <input
              type="text"
              value={customerDetails.company}
              onChange={(event) => updateCustomerDetails("company", event.target.value)}
              className={inputClass}
              placeholder="Company name"
            />
          </label>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            City / Country
            <input
              type="text"
              value={customerDetails.location}
              onChange={(event) => updateCustomerDetails("location", event.target.value)}
              className={inputClass}
              placeholder="City, Country"
            />
          </label>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            Project notes / requirements
            <textarea
              value={customerDetails.notes}
              onChange={(event) => updateCustomerDetails("notes", event.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Share goals, timelines, integrations, or anything important."
            />
          </label>
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-blue-700 print:hidden">
          Step 04 / Estimate
        </p>
        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm shadow-blue-100/40">
            <span>Subtotal</span>
            <span>{formatMoney(result.subtotal, currency, usdInrRate)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 text-sm font-black text-slate-700 shadow-sm shadow-blue-100/35">
            <span>{selectedCategory.multiplierGroup.label} multiplier</span>
            <span>{result.multiplier.toFixed(2)}x</span>
          </div>
          <div className="relative overflow-hidden rounded-[1.65rem] bg-slate-950 p-5 text-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.36),transparent_38%),radial-gradient(circle_at_92%_28%,rgba(6,182,212,0.22),transparent_32%)]" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Estimated total
              </p>
              <p className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                {formatMoney(result.total, currency, usdInrRate)}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold leading-6 text-slate-500">
            Final pricing may vary after project discussion.
          </p>
          {validationMessage ? (
            <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {validationMessage}
            </p>
          ) : null}
          <button
            type="button"
            onClick={generateEstimate}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-slate-950 hover:shadow-slate-950/20 print:hidden"
          >
            Generate Estimate
          </button>
        </div>

        {estimate && (
          <div className="mt-6 overflow-hidden rounded-[1.85rem] border border-blue-100/80 bg-[#fbfdff]/92 shadow-xl shadow-blue-100/45 ring-1 ring-white/70 print:fixed print:inset-0 print:z-[9999] print:m-0 print:h-auto print:overflow-visible print:rounded-none print:border-0 print:bg-white print:p-8 print:shadow-none">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white print:rounded-2xl print:bg-none print:text-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.3),transparent_34%)] print:hidden" />
              <div className="relative flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-blue-950/10 print:border print:border-blue-100">
                  <Image
                    src="/images/brand/growblic-logo.png"
                    alt="Growblic"
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="text-3xl font-black">Growblic</p>
                  <p className="mt-1 text-sm font-semibold text-white/85 print:text-slate-600">
                    Website: www.growblic.com
                  </p>
                  <p className="text-sm font-semibold text-white/85 print:text-slate-600">
                    Email: hello@growblic.com
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5">
              <div className="grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2 print:grid-cols-2">
                <p>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                    Estimate ID
                  </span>
                  {estimate.id}
                </p>
                <p>
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">
                    Date
                  </span>
                  {estimate.date}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-white/90 p-5 shadow-sm shadow-blue-100/40 print:break-inside-avoid">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Customer details
                </p>
                <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600">
                  <p>{customerDetails.fullName}</p>
                  <p>{customerDetails.email}</p>
                  <p>{customerDetails.phone}</p>
                  {customerDetails.company ? <p>{customerDetails.company}</p> : null}
                  {customerDetails.location ? <p>{customerDetails.location}</p> : null}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Selected service
                </p>
                <p className="mt-2 text-xl font-black text-slate-950">
                  {selectedCategory.label}
                </p>
              </div>

              <div className="print:break-inside-avoid">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Selected options
                </p>
                <div className="mt-3 grid gap-2">
                  {result.selectedOptions.map((option) => (
                    <p
                      key={option}
                      className="rounded-2xl border border-blue-100 bg-white/90 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm shadow-blue-100/25"
                    >
                      {option}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-white/90 p-5 shadow-sm shadow-blue-100/40 print:break-inside-avoid">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Pricing breakdown
                </p>
                <div className="mt-4 grid gap-2">
                  {result.breakdownItems.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl border border-blue-100/70 bg-blue-50/70 px-4 py-3 text-sm font-bold text-slate-700 print:border print:border-blue-100 print:bg-white"
                    >
                      <span>
                        <span className="block text-slate-950">{item.label}</span>
                        <span className="block text-xs text-slate-500">{item.value}</span>
                      </span>
                      <span>{formatMoney(item.price, currency, usdInrRate)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 border-t border-blue-100 pt-4 text-sm font-black text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Estimated subtotal</span>
                    <span>{formatMoney(result.subtotal, currency, usdInrRate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{selectedCategory.multiplierGroup.label} multiplier</span>
                    <span>
                      {result.multiplierLabel} / {result.multiplier.toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-white/90 p-5 shadow-sm shadow-blue-100/40 print:break-inside-avoid">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Estimated total
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {formatMoney(result.total, currency, usdInrRate)}
                </p>
              </div>

              <p className="text-sm font-semibold leading-6 text-slate-500">
                Notes: This is an estimated quote. Final pricing may vary after project discussion.
                This estimate is for planning only and does not include taxes, hosting,
                third-party subscriptions, or ad spend unless discussed.
              </p>

              {customerDetails.notes ? (
                <div className="rounded-[1.5rem] border border-blue-100 bg-white/90 p-5 text-sm font-semibold leading-6 text-slate-600 shadow-sm shadow-blue-100/40 print:break-inside-avoid">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    Project notes / requirements
                  </p>
                  <p className="mt-3 whitespace-pre-line">{customerDetails.notes}</p>
                </div>
              ) : null}

              {submitMessage ? (
                <p
                  aria-live="polite"
                  role={submitStatus === "error" ? "alert" : "status"}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold print:hidden ${
                    submitStatus === "success"
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-red-100 bg-red-50 text-red-700"
                  }`}
                >
                  {submitMessage}
                </p>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3 print:hidden">
                <Link
                  href="/start-project"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Project
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-sm shadow-blue-100/40 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Print / Save as PDF
                </button>
                <button
                  type="button"
                  onClick={sendEstimateRequest}
                  disabled={submitStatus === "loading"}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-500 bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitStatus === "loading" ? "Sending..." : "Send Estimate Request"}
                </button>
              </div>
            </div>
          </div>
        )}
        </aside>
      </div>
    </div>
  );
}
