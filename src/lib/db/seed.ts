import {Plan, Role, TourStatus, Difficulty, BookingStatus} from "@prisma/client";
import {prisma} from "@/lib/prisma";

const DEMO_PASSWORD_HASH = "$2a$10$FMIMZ23wq7GYMA.fiWaYj.HH07sM8EA/WP8NYHObssBcW.utcoCha";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

async function createTenants() {
  const tenants = await prisma.$transaction([
    prisma.tenant.upsert({
      where: {slug: "tripsatasia"},
      update: {},
      create: {
        slug: "tripsatasia",
        name: "Trips At Asia",
        domain: "tripsatasia.local",
        plan: Plan.PRO,
        defaultCurrency: "USD",
        supportedCurrencies: ["USD", "EUR", "JPY"],
        defaultLocale: "en",
        supportedLocales: ["en", "zh", "ja"],
        contactEmail: "hello@tripsatasia.local",
        country: "Singapore",
        isActive: true,
      },
    }),
    prisma.tenant.upsert({
      where: {slug: "mongoliatours"},
      update: {},
      create: {
        slug: "mongoliatours",
        name: "Mongolia Tours",
        domain: "mongoliatours.local",
        plan: Plan.BASIC,
        defaultCurrency: "USD",
        supportedCurrencies: ["USD", "CNY"],
        defaultLocale: "en",
        supportedLocales: ["en"],
        contactEmail: "hello@mongoliatours.local",
        country: "Mongolia",
        isActive: true,
      },
    }),
  ]);

  return tenants;
}

type SeedTenantContext = {
  tenantId: string;
  slug: string;
};

async function createStaff(context: SeedTenantContext) {
  const {tenantId, slug} = context;

  const admin = await prisma.user.upsert({
    where: {email: `admin+${slug}@tripsaas.local`},
    update: {},
    create: {
      email: `admin+${slug}@tripsaas.local`,
      name: "Admin",
      role: Role.ADMIN,
      hashedPassword: DEMO_PASSWORD_HASH,
      tenant: {
        connect: {id: tenantId},
      },
    },
  });

  const sales = await prisma.user.upsert({
    where: {email: `sales+${slug}@tripsaas.local`},
    update: {},
    create: {
      email: `sales+${slug}@tripsaas.local`,
      name: "Sales",
      role: Role.SALES,
      hashedPassword: DEMO_PASSWORD_HASH,
      tenant: {
        connect: {id: tenantId},
      },
    },
  });

  const support = await prisma.user.upsert({
    where: {email: `support+${slug}@tripsaas.local`},
    update: {},
    create: {
      email: `support+${slug}@tripsaas.local`,
      name: "Support",
      role: Role.SUPPORT,
      hashedPassword: DEMO_PASSWORD_HASH,
      tenant: {
        connect: {id: tenantId},
      },
    },
  });

  return {admin, sales, support};
}

type SeedTourDescriptor = {
  title: string;
  slug: string;
  shortDescription: string;
  destinations: string[];
  countries: string[];
  categories: string[];
  tags: string[];
  duration: number;
  basePrice: number;
};

const baseToursAsia: SeedTourDescriptor[] = [
  {
    title: "Kyoto Cherry Blossom Retreat",
    slug: "kyoto-cherry-blossom-retreat",
    shortDescription: "Springtime temples, tea ceremonies, and hanami under sakura trees.",
    destinations: ["Kyoto", "Arashiyama"],
    countries: ["Japan"],
    categories: ["Cultural", "City"],
    tags: ["cherry-blossom", "japan", "culture"],
    duration: 5,
    basePrice: 189900,
  },
  {
    title: "Bali Surf and Yoga Escape",
    slug: "bali-surf-yoga-escape",
    shortDescription: "Morning waves, sunset yoga, and jungle cafes in Canggu and Uluwatu.",
    destinations: ["Canggu", "Uluwatu"],
    countries: ["Indonesia"],
    categories: ["Adventure", "Beach"],
    tags: ["bali", "surf", "yoga"],
    duration: 7,
    basePrice: 129900,
  },
  {
    title: "Northern Thailand Mountain Loop",
    slug: "northern-thailand-mountain-loop",
    shortDescription: "Chiang Mai to Pai loop with hill tribe homestays and waterfalls.",
    destinations: ["Chiang Mai", "Pai"],
    countries: ["Thailand"],
    categories: ["Adventure", "Nature"],
    tags: ["thailand", "mountains"],
    duration: 6,
    basePrice: 99900,
  },
  {
    title: "Vietnam Coastline Explorer",
    slug: "vietnam-coastline-explorer",
    shortDescription: "Hanoi to Ho Chi Minh via Ha Long Bay, Hoi An, and Nha Trang.",
    destinations: ["Hanoi", "Ha Long", "Hoi An"],
    countries: ["Vietnam"],
    categories: ["Cultural", "Adventure"],
    tags: ["vietnam", "coast"],
    duration: 10,
    basePrice: 159900,
  },
  {
    title: "Sri Lanka Tea and Wildlife Circuit",
    slug: "sri-lanka-tea-wildlife-circuit",
    shortDescription: "Kandy, Ella, and safari in Yala National Park.",
    destinations: ["Colombo", "Kandy", "Ella"],
    countries: ["Sri Lanka"],
    categories: ["Adventure", "Wildlife"],
    tags: ["safari", "tea-country"],
    duration: 8,
    basePrice: 139900,
  },
];

const baseToursMongolia: SeedTourDescriptor[] = [
  {
    title: "Gobi Desert Expedition",
    slug: "gobi-desert-expedition",
    shortDescription: "Camel treks, sand dunes, and star-filled skies in the Gobi.",
    destinations: ["Gobi Desert", "Yolyn Am"],
    countries: ["Mongolia"],
    categories: ["Adventure"],
    tags: ["desert", "gobi"],
    duration: 7,
    basePrice: 149900,
  },
  {
    title: "Khuvsgul Lake Nomad Journey",
    slug: "khuvsgul-lake-nomad-journey",
    shortDescription: "Stay with herder families on the shores of the Blue Pearl.",
    destinations: ["Khuvsgul Lake"],
    countries: ["Mongolia"],
    categories: ["Nature", "Cultural"],
    tags: ["lake", "nomad"],
    duration: 6,
    basePrice: 119900,
  },
  {
    title: "Naadam Festival Explorer",
    slug: "naadam-festival-explorer",
    shortDescription: "Celebrate wrestling, archery, and horse racing in Ulaanbaatar.",
    destinations: ["Ulaanbaatar"],
    countries: ["Mongolia"],
    categories: ["Cultural"],
    tags: ["festival"],
    duration: 4,
    basePrice: 89900,
  },
  {
    title: "Winter Eagle Hunter Experience",
    slug: "winter-eagle-hunter-experience",
    shortDescription: "Ride with Kazakh eagle hunters in western Mongolia.",
    destinations: ["Bayan-Ölgii"],
    countries: ["Mongolia"],
    categories: ["Adventure"],
    tags: ["eagle-hunter", "winter"],
    duration: 6,
    basePrice: 169900,
  },
  {
    title: "Steppe Horseback Traverse",
    slug: "steppe-horseback-traverse",
    shortDescription: "Multi-day horseback journey across the central steppe.",
    destinations: ["Arkhangai"],
    countries: ["Mongolia"],
    categories: ["Adventure"],
    tags: ["horseback"],
    duration: 8,
    basePrice: 159900,
  },
];

async function createToursForTenant(context: SeedTenantContext, isMongolia: boolean) {
  const {tenantId} = context;
  const baseList = isMongolia ? baseToursMongolia : baseToursAsia;

  const created: {id: string}[] = [];

  for (let i = 0; i < 10; i += 1) {
    const base = baseList[i % baseList.length];
    const slug = i < baseList.length ? base.slug : `${base.slug}-${i + 1}`;

    const tour = await prisma.tour.upsert({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
      update: {},
      create: {
        tenant: {connect: {id: tenantId}},
        title: base.title,
        slug,
        shortDescription: base.shortDescription,
        description: base.shortDescription,
        highlights: ["Guided experiences", "Small groups", "Local guides"],
        inclusions: ["Accommodation", "Breakfast", "Local transport"],
        exclusions: ["International flights", "Travel insurance"],
        price: base.basePrice / 100,
        compareAtPrice: base.basePrice / 100 + 100,
        currency: "USD",
        duration: base.duration,
        maxGroupSize: 16,
        minGroupSize: 2,
        difficulty: Difficulty.MODERATE,
        imageUrls: ["https://images.example.com/placeholder-1.jpg"],
        videoUrl: null,
        itinerary: [
          {
            day: 1,
            title: "Arrival and welcome",
            description: "Meet your guide and group for a welcome dinner.",
            meals: ["Dinner"],
            accommodation: "Local guesthouse",
            activities: ["Orientation", "Welcome dinner"],
          },
        ],
        destinations: base.destinations,
        countries: base.countries,
        categories: base.categories,
        tags: base.tags,
        meetingPoint: base.destinations[0],
        endPoint: base.destinations[base.destinations.length - 1],
        availableDates: [
          {
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            capacity: 16,
            bookedSeats: 0,
          },
        ],
        status: TourStatus.PUBLISHED,
        seoTitle: base.title,
        seoDescription: base.shortDescription,
        seoKeywords: base.tags,
        rating: 4.7,
        reviewCount: 0,
      },
    });

    created.push({id: tour.id});
  }

  return created;
}

async function createCustomersForTenant(context: SeedTenantContext) {
  const {tenantId, slug} = context;
  const customers: {id: string}[] = [];

  for (let i = 0; i < 30; i += 1) {
    const email = `customer${i + 1}+${slug}@example.com`;

    const customer = await prisma.customer.upsert({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
      update: {},
      create: {
        tenant: {connect: {id: tenantId}},
        email,
        firstName: "Guest",
        lastName: `${i + 1}`,
        phone: null,
        nationality: "Unknown",
        tags: [],
        marketingConsent: i % 2 === 0,
      },
    });

    customers.push({id: customer.id});
  }

  return customers;
}

async function createBookingsAndReviewsForTenant(
  context: SeedTenantContext,
  tours: {id: string}[],
  customers: {id: string}[],
) {
  const {tenantId, slug} = context;
  const bookings: {id: string; tourId: string; customerId: string}[] = [];

  for (let i = 0; i < 50; i += 1) {
    const tour = pickOne(tours);
    const customer = pickOne(customers);
    const start = new Date(Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + randomInt(3, 10) * 24 * 60 * 60 * 1000);
    const adults = randomInt(1, 4);
    const children = randomInt(0, 2);
    const infants = randomInt(0, 1);
    const totalSeats = adults + children + infants;

    const basePrice = 1000 + randomInt(0, 500);
    const discountAmount = randomInt(0, 200);
    const taxAmount = Math.round(basePrice * 0.12);
    const totalPrice = basePrice - discountAmount + taxAmount;

    const statusPool: BookingStatus[] = [
      BookingStatus.CONFIRMED,
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
    ];
    const status = pickOne(statusPool);

    const bookingNumber = `TRP-${slug.toUpperCase()}-${start.getFullYear()}-${String(i + 1).padStart(
      5,
      "0",
    )}`;

    const booking = await prisma.booking.create({
      data: {
        tenant: {connect: {id: tenantId}},
        tour: {connect: {id: tour.id}},
        customer: {connect: {id: customer.id}},
        bookingNumber,
        startDate: start,
        endDate: end,
        adults,
        children,
        infants,
        totalSeats,
        basePrice,
        discountAmount,
        taxAmount,
        totalPrice,
        currency: "USD",
        currencyRate: 1,
        extras: [],
        specialRequests: null,
        status,
        paymentsPaymentId: null,
        paymentsPaymentStatus: null,
        paymentMethod: "card",
        voucherUrl: null,
        internalNotes: null,
        confirmedAt: status === BookingStatus.CONFIRMED ? new Date() : null,
        cancelledAt: status === BookingStatus.CANCELLED ? new Date() : null,
      },
    });

    bookings.push({id: booking.id, tourId: tour.id, customerId: customer.id});
  }

  const reviewTargets = bookings.slice(0, 30);

  for (let i = 0; i < reviewTargets.length; i += 1) {
    const target = reviewTargets[i];
    const rating = randomInt(4, 5);

    await prisma.review.create({
      data: {
        tenant: {connect: {id: tenantId}},
        tour: {connect: {id: target.tourId}},
        customer: {connect: {id: target.customerId}},
        booking: {connect: {id: target.id}},
        rating,
        title: "Amazing experience",
        body: "Well organized trip with knowledgeable guides.",
        photos: [],
        isVerified: true,
        isPublished: true,
        adminResponse: null,
      },
    });
  }
}

async function main() {
  const tenants = await createTenants();

  for (const tenant of tenants) {
    const context: SeedTenantContext = {tenantId: tenant.id, slug: tenant.slug};
    const isMongolia = tenant.slug === "mongoliatours";

    const staff = await createStaff(context);
    void staff;

    const tours = await createToursForTenant(context, isMongolia);
    const customers = await createCustomersForTenant(context);
    await createBookingsAndReviewsForTenant(context, tours, customers);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
