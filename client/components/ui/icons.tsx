import {
  Loader2,
  Mail,
  User,
  Lock,
  LogOut,
  Settings,
  UserPlus,
  Users,
  Building,
  CreditCard,
  Activity,
  BarChart,
  DollarSign,
  Download,
  FileText,
  HelpCircle,
  Home,
  Laptop,
  LayoutDashboard,
  Moon,
  SunMedium,
  Twitter,
  Wand2,
  Rocket,
  BarChart3,
  ShoppingBag,
  Layout,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  spinner: Loader2,
  mail: Mail,
  user: User,
  lock: Lock,
  logout: LogOut,
  settings: Settings,
  userplus: UserPlus,
  users: Users,
  building: Building,
  creditcard: CreditCard,
  activity: Activity,
  chart: BarChart,
  dollar: DollarSign,
  download: Download,
  file: FileText,
  help: HelpCircle,
  home: Home,
  laptop: Laptop,
  dashboard: LayoutDashboard,
  moon: Moon,
  sun: SunMedium,
  twitter: Twitter,
  google: ({ ...props }: LucideIcon) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  ),
  tiktok: ({ ...props }: LucideIcon) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="tiktok"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"
      ></path>
    </svg>
  ),
  wand: Wand2,
  rocket: Rocket,
  chart: BarChart3,
  shop: ShoppingBag,
  template: Layout,
  automation: Settings,
}; 