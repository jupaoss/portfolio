import { useNavigate, useLocation } from "react-router";
import { SlotCta } from "./SlotCta";
import headerPaths from "../../../graphic-assets/headerPaths";

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
    <div className={`fixed left-4 right-4 bottom-6 z-[110] lg:left-8 lg:right-8 ${textColor}`} data-name="Footer">
      <div className="hidden min-[768px]:block absolute left-0 bottom-0 font-['Avantt',sans-serif] font-semibold text-[12px] uppercase" data-name="footer-year">
        <p>©2026</p>
      </div>
      {/* Mobile: available for freelance + email + location */}
      <div className="md:hidden absolute left-0 bottom-0 font-['Avantt',sans-serif] font-semibold text-[12px] uppercase leading-[1.3]" data-name="footer-mobile">
        <p className="mb-0" data-name="footer-mobile-line-1">available for freelance</p>
        <span data-name="footer-mobile-line-2" style={{ display: "inline-block" }}>
          <SlotCta text="julianpatinoossa@gmail.com" as="a" href="mailto:julianpatinoossa@gmail.com" className="underline" />
        </span>
        <div className="flex items-center gap-[8px] mt-6" data-name="footer-mobile-line-3">
          <div className="h-[13px] w-[11px] relative shrink-0">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
              <path d={headerPaths.p122a1c00} fill="currentColor" />
            </svg>
          </div>
          <span>MDE, COL</span>
        </div>
      </div>
      {/* Desktop: available for freelance + email */}
      <div className="hidden md:block absolute left-[232px] bottom-0 font-['Avantt',sans-serif] font-semibold text-[12px] uppercase leading-[1.3]" data-name="footer-freelance">
        <p className="mb-0" data-name="footer-freelance-line-1">available for freelance</p>
        <span data-name="footer-freelance-line-2" style={{ display: "inline-block" }}>
          <SlotCta text="julianpatinoossa@gmail.com" as="a" href="mailto:julianpatinoossa@gmail.com" className="underline" />
        </span>
      </div>
      <div className="absolute flex flex-col items-end right-0 bottom-0 gap-[4px] pb-[3px]" data-name="about">
        <div className="flex items-center gap-[4px]" data-name="footer-link-work">
          {activePage === "work" && <NavArrow color={theme === "dark" ? "#eaeaea" : "black"} />}
          <SlotCta text="WORK" className="text-[12px] font-semibold" onClick={handleWorkClick} isActive={activePage === "work"} />
        </div>
        <div className="flex items-center gap-[4px]" data-name="footer-link-about">
          {activePage === "about" && <NavArrow color={theme === "dark" ? "#eaeaea" : "black"} />}
          <SlotCta text="ABOUT" className="text-[12px] font-semibold" onClick={() => navigate("/about")} isActive={activePage === "about"} />
        </div>
      </div>
    </div>
  );
}
