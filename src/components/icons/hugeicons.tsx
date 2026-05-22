// HugeIcons (Free, Rounded Stroke) drop-in wrappers exposing a lucide-react-like API.
// Usage: import { Home, ArrowRight } from "@/components/icons/hugeicons";
import { HugeiconsIcon, type HugeiconsProps } from "@hugeicons/react";
import {
  Facebook01FreeIcons,
  NewTwitterFreeIcons,
  YoutubeFreeIcons,
  Linkedin01FreeIcons,
  Download01FreeIcons,
  BubbleChatFreeIcons,
  Message01FreeIcons,
  GlobalFreeIcons,
  ArrowUpRight01FreeIcons,
  TargetFreeIcons,
  FlashFreeIcons,
  RocketFreeIcons,
  ArrowLeft01FreeIcons,
  ArrowRight01FreeIcons,
  ArrowDown01FreeIcons,
  ArrowDownRight01Icon,
  LockIcon,
  LockedIcon,
  Home01FreeIcons,
  UserIcon,
  Briefcase01FreeIcons,
  Mail01FreeIcons,
  Layers01FreeIcons,
  PaintBoardFreeIcons,
  ChartUpFreeIcons,
  Setting07FreeIcons,
  KitchenUtensilsFreeIcons,
  PrinterFreeIcons,
  Location01Icon,
  IdeaIcon,
  SourceCodeIcon,
  Shield01Icon,
  FavouriteIcon,
  AlertCircleIcon,
  Cancel01Icon,
  File01Icon,
  UserGroupIcon,
  Door01Icon,
  Sun01Icon,
  SparklesIcon,
  ComputerTerminal01Icon,
  Activity01Icon,
  CircleIcon,
  Loading03Icon,
  CheckmarkCircle01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import type { ComponentProps, ComponentType } from "react";

type IconNode = HugeiconsProps["icon"];
export type IconProps = Omit<ComponentProps<"svg">, "ref"> & {
  size?: number | string;
  strokeWidth?: number;
  color?: string;
};
export type IconComponent = ComponentType<IconProps>;
// Alias for lucide-react drop-in compatibility
export type LucideIcon = IconComponent;

const make = (icon: IconNode): IconComponent => {
  const C = ({ size = 24, strokeWidth = 1.5, color, className, ...rest }: IconProps) => (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color={color ?? "currentColor"}
      className={className}
      {...(rest as Record<string, unknown>)}
    />
  );
  return C;
};

export const Facebook = make(Facebook01FreeIcons);
export const Twitter = make(NewTwitterFreeIcons);
export const Youtube = make(YoutubeFreeIcons);
export const Linkedin = make(Linkedin01FreeIcons);
export const Download = make(Download01FreeIcons);
export const MessageCircle = make(BubbleChatFreeIcons);
export const MessageSquare = make(Message01FreeIcons);
export const Globe = make(GlobalFreeIcons);
export const ArrowUpRight = make(ArrowUpRight01FreeIcons);
export const ArrowDownRight = make(ArrowDownRight01Icon);
export const Target = make(TargetFreeIcons);
export const Zap = make(FlashFreeIcons);
export const Rocket = make(RocketFreeIcons);
export const ChevronLeft = make(ArrowLeft01FreeIcons);
export const ChevronRight = make(ArrowRight01FreeIcons);
export const ChevronDown = make(ArrowDown01FreeIcons);
export const ArrowRight = make(ArrowRight01FreeIcons);
export const Lock = make(LockIcon);
export const Unlock = make(LockedIcon);
export const Home = make(Home01FreeIcons);
export const User = make(UserIcon);
export const Briefcase = make(Briefcase01FreeIcons);
export const Mail = make(Mail01FreeIcons);
export const Layers = make(Layers01FreeIcons);
export const Palette = make(PaintBoardFreeIcons);
export const TrendingUp = make(ChartUpFreeIcons);
export const Settings = make(Setting07FreeIcons);
export const UtensilsCrossed = make(KitchenUtensilsFreeIcons);
export const Printer = make(PrinterFreeIcons);

// Extra mappings to cover existing lucide usage across sections
export const MapPin = make(Location01Icon);
export const Lightbulb = make(IdeaIcon);
export const Code = make(SourceCodeIcon);
export const Shield = make(Shield01Icon);
export const Heart = make(FavouriteIcon);
export const AlertCircle = make(AlertCircleIcon);
export const Ban = make(Cancel01Icon);
export const FileText = make(File01Icon);
export const Users = make(UserGroupIcon);
export const DoorOpen = make(Door01Icon);
export const Sun = make(Sun01Icon);
export const Sparkles = make(SparklesIcon);
export const Terminal = make(ComputerTerminal01Icon);
export const Activity = make(Activity01Icon);
export const X = make(Cancel01Icon);
export const Circle = make(CircleIcon);
export const Loader2 = make(Loading03Icon);
export const CheckCircle2 = make(CheckmarkCircle01Icon);
export const CreditCard = make(CreditCardIcon);
