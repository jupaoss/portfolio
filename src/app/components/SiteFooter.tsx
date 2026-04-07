import { useNavigate, useLocation } from "react-router";
import { SlotCta } from "./SlotCta";
import headerPaths from "@/assets/headerPaths";

interface SiteFooterProps {
  onWorkClick?: () => void;
  /** "light" (default) = dark text, for light backgrounds. "dark" = light text, for dark/colored backgrounds. */
  theme?: "light" | "dark";
}

// Arrow SVG reused from cursor press-state — rotated 90° to point right
function NavArrow({ color }: { color: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ transform: "rotate(90deg)", flexShrink: 0 }}>
      <path d="M4 0L5.73205 3H2.26795L4 0Z" fill={color} transform="scale(1.2) translate(-0.667 -0.667)" />
    </svg>
  );
}

export function SiteFooter({ onWorkClick, theme = "light" }: SiteFooterProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage = location.pathname === "/" ? "work" : location.pathname === "/about" ? "about" : undefined;
  const handleWorkClick = onWorkClick ?? (() => navigate("/"));
  const textColor = theme === "dark" ? "text-[#eaeaea]" : "text-black";

  return (
    <div className={`fixed left-4 right-4 bottom-6 z-[110] lg:left-6 lg:right-6 ${textColor}`} data-name="Footer">
      <div className="hidden min-[768px]:block absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase" data-name="footer-year">
        <p>©2026</p>
      </div>
      {/* Mobile: available for freelance + email + location */}
      <div className="md:hidden absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase leading-normal" data-name="footer-mobile">
        <p className="mb-0">available for freelance</p>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
        <div className="flex items-center gap-[8px] mt-6">
          <div className="h-[13px] w-[11px] relative shrink-0">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
              <path d={headerPaths.p122a1c00} fill="currentColor" />
            </svg>
          </div>
          <span>MDE, COL</span>
        </div>
      </div>
      {/* Desktop: available for freelance + email */}
      <div className="hidden md:block absolute left-[232px] bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase leading-normal" data-name="footer-freelance">
        <p className="mb-0">available for freelance</p>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
      </div>
      <div className="absolute flex flex-col items-end right-0 bottom-0 gap-[8px] pb-[3px]" data-name="about">
        <div className="flex items-center gap-[4px]">
          {activePage === "work" && <NavArrow color={theme === "dark" ? "#eaeaea" : "black"} />}
          <SlotCta text="WORK" className="text-[12px]" onClick={handleWorkClick} />
        </div>
        <div className="flex items-center gap-[4px]">
          {activePage === "about" && <NavArrow color={theme === "dark" ? "#eaeaea" : "black"} />}
          <SlotCta text="ABOUT" className="text-[12px]" onClick={() => navigate("/about")} />
        </div>
      </div>
    </div>
  );
}
