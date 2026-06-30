import Image from "next/image";

type ProductGalleryProps = {
  product: {
    title: string;
    category?: string;
    shortDescription?: string;
    description?: string;
    imageSlides?: string[];
  };
};

function getProductPreviewCards(product: ProductGalleryProps["product"]) {
  const productText = `${product.title} ${product.category ?? ""} ${product.shortDescription ?? ""} ${product.description ?? ""}`.toLowerCase();

  const images = product.imageSlides?.filter(Boolean) ?? [];

  const imageFor = (index: number) => {
    if (images.length === 0) return null;
    return images[index % images.length];
  };

  let cards = [
    {
      title: "Workspace Overview",
      text: "A clean overview screen for tracking important product activity, records, and daily status.",
    },
    {
      title: "Smart Dashboard",
      text: "Organized metrics, workflows, and business data arranged in one connected interface.",
    },
    {
      title: "Management Flow",
      text: "Tools for users, teams, tasks, reports, approvals, and daily operations.",
    },
    {
      title: "Reports & Insights",
      text: "Clear reporting screens designed to help teams make better business decisions.",
    },
  ];

  if (productText.includes("crm")) {
    cards = [
      {
        title: "Lead Pipeline",
        text: "Track leads, deal stages, client movement, and follow-up activity in one focused CRM view.",
      },
      {
        title: "Deal Tracking",
        text: "Monitor opportunities, revenue progress, sales activity, and team ownership with cleaner visibility.",
      },
      {
        title: "Customer Workspace",
        text: "Keep customer records, notes, conversations, tasks, and status updates organized for your team.",
      },
      {
        title: "Follow-up Automation",
        text: "Automate reminders, next steps, and sales workflows so important leads do not get missed.",
      },
    ];
  } else if (
    productText.includes("school") ||
    productText.includes("learning") ||
    productText.includes("education") ||
    productText.includes("class")
  ) {
    cards = [
      {
        title: "Student Records",
        text: "Manage student profiles, classes, notes, fees, attendance, and academic activity cleanly.",
      },
      {
        title: "Class Dashboard",
        text: "A clear workspace for teachers, admins, students, batches, and daily school operations.",
      },
      {
        title: "Fee & Notice Flow",
        text: "Handle fees, notices, reminders, communication, and parent updates from one place.",
      },
      {
        title: "Learning Workspace",
        text: "Organize lessons, content, progress, and student engagement in a polished interface.",
      },
    ];
  } else if (
    productText.includes("hr") ||
    productText.includes("payroll") ||
    productText.includes("employee")
  ) {
    cards = [
      {
        title: "Employee Records",
        text: "Manage employees, roles, documents, attendance, leaves, and team details in one system.",
      },
      {
        title: "Payroll Dashboard",
        text: "Track salary cycles, payouts, deductions, payroll status, and monthly activity clearly.",
      },
      {
        title: "Attendance Flow",
        text: "Keep attendance, leaves, shifts, approvals, and daily workforce activity connected.",
      },
      {
        title: "Team Management",
        text: "Give admins and teams a clean workspace for people operations and internal workflows.",
      },
    ];
  } else if (
    productText.includes("billing") ||
    productText.includes("inventory") ||
    productText.includes("invoice") ||
    productText.includes("gst")
  ) {
    cards = [
      {
        title: "Invoice Workspace",
        text: "Create and manage invoices, customers, payments, tax details, and billing records efficiently.",
      },
      {
        title: "Inventory Control",
        text: "Track stock, products, pricing, quantity updates, and business inventory from one dashboard.",
      },
      {
        title: "Customer Records",
        text: "Keep customer details, transactions, purchase history, and payment activity organized.",
      },
      {
        title: "Business Reports",
        text: "View clean reports for sales, billing, payments, stock, and daily business decisions.",
      },
    ];
  } else if (
    productText.includes("mobile") ||
    productText.includes("app")
  ) {
    cards = [
      {
        title: "App Home Screen",
        text: "A polished mobile-first experience that helps users start quickly and clearly.",
      },
      {
        title: "User Flow",
        text: "Simple user journeys designed for actions, engagement, repeat usage, and smooth navigation.",
      },
      {
        title: "Activity Dashboard",
        text: "Track activity, updates, notifications, and important app events in one place.",
      },
      {
        title: "Mobile Experience",
        text: "Clean screens built for speed, usability, and a modern product feel.",
      },
    ];
  }

  return cards.map((card, index) => ({
    ...card,
    image: imageFor(index),
  }));
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const previewCards = getProductPreviewCards(product);

  return (
    <section className="relative overflow-hidden bg-[#f5f7fb] px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_90%_70%,rgba(6,182,212,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
            Product Preview
          </p>
          <h2 className="mt-5 text-balance text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">
            Product screens built for real workflows.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {previewCards.map((preview) => (
            <article
              key={preview.title}
              className="group flex h-full min-h-[410px] flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white/84 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_34px_95px_rgba(37,99,235,0.15)]"
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-3">
                {preview.image ? (
                  <Image
                    src={preview.image}
                    alt={preview.title}
                    width={520}
                    height={360}
                    className="h-48 w-full rounded-[1.2rem] object-cover shadow-[0_18px_55px_rgba(15,23,42,0.12)]"
                  />
                ) : (
                  <div className="grid h-48 place-items-center rounded-[1.2rem] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                    <span className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
                      Growblic
                    </span>
                  </div>
                )}
              </div>

              <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-slate-950">
                {preview.title}
              </h3>

              <p className="mt-4 line-clamp-4 text-sm font-semibold leading-7 text-slate-600">
                {preview.text}
              </p>

              <div className="mt-auto pt-6">
                <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  {product.title}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
