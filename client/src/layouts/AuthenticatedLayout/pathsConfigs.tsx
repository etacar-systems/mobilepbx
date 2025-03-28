import { FunctionComponent, SVGAttributes } from "react";

import { ReactComponent as WebphoneIcon } from "../../Assets/Icon/call-end.svg";
import { ReactComponent as ChatIcon } from "../../Assets/Icon/chat.svg";
import { ReactComponent as PhoneBookIcon } from "../../Assets/Icon/phonebook.svg";
import { ReactComponent as WhatsAppIcon } from "../../Assets/Icon/whatsapp-svgrepo-com.svg";
import { ReactComponent as CallHistoryIcon } from "../../Assets/Icon/call-history-svgrepo-com.svg";
import { ReactComponent as CallendarIcon } from "../../Assets/Icon/calendarr.svg";
import { ReactComponent as DashboardIcon } from "../../Assets/Icon/dash_logo.svg";

import { ReactComponent as NumbersIcon } from "../../Assets/Icon/number_logo.svg";
import { ReactComponent as ExtensionsIcon } from "../../Assets/Icon/extension_logo.svg";
import { ReactComponent as GroupIcon } from "../../Assets/Icon/group_logo.svg";
// import { ReactComponent as ConferenceIcon } from "../../Assets/Icon/conference_logo.svg";
import { ReactComponent as IVRIcon } from "../../Assets/Icon/ivr_logo.svg";
import { ReactComponent as TimeConditionIcon } from "../../Assets/Icon/time_logo.svg";
import { ReactComponent as CallRecordingIcon } from "../../Assets/Icon/call_logo.svg";
import { ReactComponent as SystemRecordingIcon } from "../../Assets/Icon/system_logo.svg";
import { ReactComponent as ReportsIcon } from "../../Assets/Icon/report_logo.svg";
import { ReactComponent as IntegrationsIcon } from "../../Assets/Icon/integration-icon.svg";

import { ReactComponent as CustomersIcon } from "../../Assets/Icon/customer.svg";
import { ReactComponent as InvoicesIcon } from "../../Assets/Icon/invoices.svg";
import { ReactComponent as PSTNIcon } from "../../Assets/Icon/pstn.svg";
import { ReactComponent as OutboundRoutesIcon } from "../../Assets/Icon/outbound.svg";
import { ReactComponent as FirewallIcon } from "../../Assets/Icon/firewall.svg";
import { ReactComponent as SMTPIcon } from "../../Assets/Icon/smtp.svg";
import { ReactComponent as VideoUploadIcon } from "../../Assets/Icon/video_upload.svg";

export const agentMenuConfig = (
  company_Features: any,
  companyFeatures: any
) => {
  const config: Array<{
    name: string;
    icon?: React.FunctionComponent<React.SVGAttributes<SVGAElement>>;
    to: string;
}> = [
    {
      name: "Agent",
      // icon: "" as unknown as FunctionComponent<SVGAttributes<SVGAElement>>,
      to: "",
    },
  ];

  if (companyFeatures?.[company_Features?.phone_in_browser])
    config.push({
      name: "Webphone",
      icon: WebphoneIcon,
      to: "/webphone",
    });
  config.push(
    { name: "Chat", icon: ChatIcon, to: "/chat" },
    { name: "Phonebook", icon: PhoneBookIcon, to: "/phonebook" }
  );

  if (companyFeatures?.[company_Features?.callhistory])
    config.push({
      name: "Call History",
      icon: CallHistoryIcon,
      to: "/callhistory",
    });
  if (companyFeatures?.[company_Features?.calendar_integration])
    config.push({
      name: "Calendar",
      icon: CallendarIcon,
      to: "/calendar",
    });
  if (companyFeatures?.[company_Features?.whatsapp])
    config.push({
      name: "Whatsapp",
      icon: WhatsAppIcon,
      to: "/whatsappChat",
    });

  config.push({ name: "Dashboard", icon: DashboardIcon, to: "/dashboard" });

  return config;
};

export const adminMenuConfig = (
  company_Features: any,
  companyFeatures: any
) => {
  const config = [
    {
      name: "Admin",
      // icon: "" as unknown as FunctionComponent<SVGAttributes<SVGAElement>>,
      to: "",
    },
    { name: "Dashboard", icon: DashboardIcon, to: "/dashboard" },
    { name: "Numbers", icon: NumbersIcon, to: "/number" },
  ];

  if (companyFeatures?.[company_Features?.extension])
    config.push({
      name: "Extensions",
      icon: ExtensionsIcon,
      to: "/extension",
    });
  if (companyFeatures?.[company_Features?.ring_group])
    config.push({
      name: "Ring groups",
      icon: GroupIcon,
      to: "/ring",
    });
  if (companyFeatures?.[company_Features?.conference])
    config.push({
      name: "Conferences",
      icon: GroupIcon,
      to: "/conferences",
    });
  if (companyFeatures?.["ivr"])
    config.push({ name: "IVR", icon: IVRIcon, to: "/ivr" });

  if (companyFeatures?.[company_Features?.time_controls])
    config.push({
      name: "Time Condition",
      icon: TimeConditionIcon,
      to: "/time",
    });
  if (companyFeatures?.[company_Features.callhistory])
    config.push({
      name: "Call recordings",
      icon: CallRecordingIcon,
      to: "/call",
    });

  config.push({
    name: "System recordings",
    icon: SystemRecordingIcon,
    to: "/system",
  });

  if (companyFeatures?.[company_Features?.reportage])
    config.push({
      name: "Reports",
      icon: ReportsIcon,
      to: "/reports",
    });

  config.push({
    name: "Integrations",
    icon: IntegrationsIcon,
    to: "/integration",
  });

  return config;
};

const SupportIcon: FunctionComponent<SVGAttributes<SVGAElement>> = ({ width, height }) =>  (
  <svg width={width} 
  // fill="currentColor"
  className="icontest"
  height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m7.46 7.12l-2.78 1.15a4.982 4.982 0 0 0-2.95-2.94l1.15-2.78c2.1.8 3.77 2.47 4.58 4.57M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3M9.13 4.54l1.17 2.78a5 5 0 0 0-2.98 2.97L4.54 9.13a7.984 7.984 0 0 1 4.59-4.59M4.54 14.87l2.78-1.15a4.968 4.968 0 0 0 2.97 2.96l-1.17 2.78a7.996 7.996 0 0 1-4.58-4.59m10.34 4.59l-1.15-2.78a4.978 4.978 0 0 0 2.95-2.97l2.78 1.17a8.007 8.007 0 0 1-4.58 4.58"
    />
  </svg>
)

export const superAdminMenuConfig = [
  {
    name: "SuperAdmin",
    // icon: "" as unknown as FunctionComponent<SVGAttributes<SVGAElement>>,
    to: "",
  },
  {
    name: "Customers",
    icon: CustomersIcon,
    to: "/customers",
  },
  {
    name: "Invoices",
    icon: InvoicesIcon,
    to: "/invoices",
  },
  {
    name: "PSTN numbers",
    icon: PSTNIcon,
    to: "/pstn",
  },
  {
    name: "Trunks",
    icon: IVRIcon,
    to: "/trunk",
  },
  {
    name: "Outbound routes",
    icon: OutboundRoutesIcon,
    to: "/outbound",
  },
  {
    name: "Firewall",
    icon: FirewallIcon,
    to: "/firewall",
  },
  {
    name: "SMTP",
    icon: SMTPIcon,
    to: "/smtp",
  },
  {
    name: "Video upload",
    icon: VideoUploadIcon,
    to: "/video",
  },
  {
    name: "Support",
    icon: SupportIcon,
    to: "/support",
  },
];

