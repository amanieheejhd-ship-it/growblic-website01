"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
};

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

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

function formatMoney(value: number) {
  return moneyFormatter.format(Math.round(value));
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
  const [selectValues, setSelectValues] = useState<Record<string, string>>(initialSelections.selectValues);
  const [numberValues, setNumberValues] = useState<Record<string, number>>(initialSelections.numberValues);
  const [featureValues, setFeatureValues] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<Estimate | null>(null);

  function updateCategory(categoryId: string) {
    const nextCategory = categories.find((item) => item.id === categoryId) ?? categories[0];
    const nextSelections = getInitialSelections(nextCategory);

    setSelectedCategoryId(categoryId);
    setSelectValues(nextSelections.selectValues);
    setNumberValues(nextSelections.numberValues);
    setFeatureValues([]);
    setEstimate(null);
  }

  const result = useMemo(() => {
    let subtotal = selectedCategory.basePrice;
    const selectedOptions: string[] = [`Base estimate: ${formatMoney(selectedCategory.basePrice)}`];

    selectedCategory.selectGroups.forEach((group) => {
      const option = group.options.find((item) => item.label === selectValues[group.key]) ?? group.options[0];
      if (!option) return;
      subtotal += option.price;
      selectedOptions.push(`${group.label}: ${option.label}`);
    });

    selectedCategory.numberGroups.forEach((group) => {
      const value = numberValues[group.key] ?? group.defaultValue;
      const billableUnits = Math.max(0, value - group.included);
      const price = billableUnits * group.pricePerUnit;
      subtotal += price;
      selectedOptions.push(`${group.label}: ${value} ${group.unit}`);
    });

    selectedCategory.features.forEach((feature) => {
      if (featureValues.includes(feature.label)) {
        subtotal += feature.price;
        selectedOptions.push(`${selectedCategory.featureLabel}: ${feature.label}`);
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
    };
  }, [featureValues, numberValues, selectValues, selectedCategory]);

  function toggleFeature(feature: string) {
    setEstimate(null);
    setFeatureValues((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    );
  }

  function generateEstimate() {
    const date = new Date();
    setEstimate({
      id: `GB-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
        date.getDate(),
      ).padStart(2, "0")}-${date.getTime().toString().slice(-5)}`,
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_0.72fr] lg:items-start">
      <section className="rounded-[2.4rem] border border-blue-100/80 bg-white/90 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-7">
        <div className="grid gap-3">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
            Step 01 / Select service
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => updateCategory(category.id)}
                className={`rounded-2xl border px-4 py-4 text-left text-sm font-black leading-5 transition hover:-translate-y-0.5 ${
                  selectedCategory.id === category.id
                    ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                    : "border-blue-100 bg-white text-slate-700 shadow-sm shadow-blue-100/40 hover:border-blue-200 hover:text-blue-700"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-blue-100 bg-[#fbfdff] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                Step 02 / Configure
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {selectedCategory.label}
              </h2>
            </div>
            <p className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600">
              Starts at {formatMoney(selectedCategory.basePrice)}
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
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
                  className="accent-blue-600"
                />
                <span className="text-xs font-bold text-slate-500">
                  Includes {group.included} {group.unit}; additional {formatMoney(group.pricePerUnit)} each
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
                className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
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
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition hover:-translate-y-0.5 ${
                    featureValues.includes(feature.label)
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100"
                      : "border-blue-100 bg-white text-slate-700 hover:border-blue-200"
                  }`}
                >
                  <span className="block">{feature.label}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">
                    + {formatMoney(feature.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="sticky top-28 rounded-[2.4rem] border border-blue-100/80 bg-white/92 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
          Step 03 / Estimate
        </p>
        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-slate-700">
            <span>Subtotal</span>
            <span>{formatMoney(result.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 ring-1 ring-blue-100">
            <span>{selectedCategory.multiplierGroup.label} multiplier</span>
            <span>{result.multiplier.toFixed(2)}x</span>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Estimated total
            </p>
            <p className="mt-2 text-4xl font-black tracking-tight">
              {formatMoney(result.total)}
            </p>
          </div>
          <p className="text-sm font-semibold leading-6 text-slate-500">
            Final pricing may vary after project discussion.
          </p>
          <button
            type="button"
            onClick={generateEstimate}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-slate-950"
          >
            Generate Estimate
          </button>
        </div>

        {estimate && (
          <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-blue-100 bg-[#fbfdff]">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">
              <p className="text-3xl font-black">Growblic</p>
              <p className="mt-2 text-sm font-semibold text-white/85">
                Website: www.growblic.com
              </p>
              <p className="text-sm font-semibold text-white/85">
                Email: hello@growblic.com
              </p>
            </div>

            <div className="grid gap-5 p-5">
              <div className="grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2">
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

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Selected service
                </p>
                <p className="mt-2 text-xl font-black text-slate-950">
                  {selectedCategory.label}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Selected options
                </p>
                <div className="mt-3 grid gap-2">
                  {result.selectedOptions.map((option) => (
                    <p
                      key={option}
                      className="rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-slate-600"
                    >
                      {option}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 ring-1 ring-blue-100">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Estimated total
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {formatMoney(result.total)}
                </p>
              </div>

              <p className="text-sm font-semibold leading-6 text-slate-500">
                Notes: Final pricing may vary after project discussion. This estimate is for planning only and does not include taxes, hosting, third-party subscriptions, or ad spend unless discussed.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 print:hidden">
                <Link
                  href="/start-project"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Project
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:text-blue-700"
                >
                  Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
