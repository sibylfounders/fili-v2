import * as React from "react";
import { createIcon } from "./create-icon";

export { createIcon } from "./create-icon";
export type { IconProps } from "./create-icon";

/**
 * Jeu d'icônes @fili/react — dessiné au trait, idiome Lucide (24×24, stroke 2, arrondi).
 * Regroupé par famille. Toutes héritent `currentColor` et se dimensionnent via `size`.
 * Ce n'est pas un portage 1:1 de Lucide (dépendance non récupérable dans l'environnement) :
 * ce sont des glyphes maison à la même grammaire visuelle, remplaçables plus tard par le
 * vrai paquet Lucide sans changer l'API (`<Icon size=… />`).
 */

/* ── Direction ─────────────────────────────────────────────────────────── */
export const ArrowRight = createIcon("ArrowRight", <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const ArrowLeft = createIcon("ArrowLeft", <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>);
export const ArrowUp = createIcon("ArrowUp", <><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></>);
export const ArrowDown = createIcon("ArrowDown", <><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></>);
export const ChevronRight = createIcon("ChevronRight", <path d="m9 18 6-6-6-6" />);
export const ChevronLeft = createIcon("ChevronLeft", <path d="m15 18-6-6 6-6" />);
export const ChevronDown = createIcon("ChevronDown", <path d="m6 9 6 6 6-6" />);
export const ChevronUp = createIcon("ChevronUp", <path d="m18 15-6-6-6 6" />);
export const ChevronsUpDown = createIcon("ChevronsUpDown", <><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>);

/* ── Actions ───────────────────────────────────────────────────────────── */
export const Check = createIcon("Check", <path d="M20 6 9 17l-5-5" />);
export const X = createIcon("X", <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const Plus = createIcon("Plus", <><path d="M5 12h14" /><path d="M12 5v14" /></>);
export const Minus = createIcon("Minus", <path d="M5 12h14" />);
export const Search = createIcon("Search", <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const Trash = createIcon("Trash", <><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M10 11v6" /><path d="M14 11v6" /></>);
export const Edit = createIcon("Edit", <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
export const Copy = createIcon("Copy", <><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>);
export const Download = createIcon("Download", <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>);
export const Upload = createIcon("Upload", <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>);
export const Filter = createIcon("Filter", <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />);
export const Settings = createIcon("Settings", <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>);
export const RefreshCw = createIcon("RefreshCw", <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>);

/* ── Feedback / statut ─────────────────────────────────────────────────── */
export const Info = createIcon("Info", <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>);
export const AlertTriangle = createIcon("AlertTriangle", <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>);
export const AlertCircle = createIcon("AlertCircle", <><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></>);
export const CheckCircle = createIcon("CheckCircle", <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);
export const XCircle = createIcon("XCircle", <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>);
export const HelpCircle = createIcon("HelpCircle", <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>);
export const Loader = createIcon("Loader", <path d="M21 12a9 9 0 1 1-6.219-8.56" />);

/* ── Objets / navigation ───────────────────────────────────────────────── */
export const Mail = createIcon("Mail", <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>);
export const User = createIcon("User", <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
export const Eye = createIcon("Eye", <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOff = createIcon("EyeOff", <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="m2 2 20 20" /></>);
export const Calendar = createIcon("Calendar", <><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>);
export const Clock = createIcon("Clock", <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>);
export const Bell = createIcon("Bell", <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>);
export const Heart = createIcon("Heart", <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />);
export const Star = createIcon("Star", <path d="M11.5 2.5 14 8l6.1.5-4.6 4 1.4 6-5.4-3.2L6.1 18.5l1.4-6-4.6-4L9 8Z" />);
export const ExternalLink = createIcon("ExternalLink", <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>);
export const LinkIcon = createIcon("Link", <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>);
export const Lock = createIcon("Lock", <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>);
export const Menu = createIcon("Menu", <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>);
export const MoreHorizontal = createIcon("MoreHorizontal", <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>);
export const MoreVertical = createIcon("MoreVertical", <><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></>);
export const Home = createIcon("Home", <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>);
