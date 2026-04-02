import { useNavigate } from "react-router";
import { SlotCta } from "./SlotCta";
import headerPaths from "@/assets/headerPaths";

interface SiteFooterProps {
  onWorkClick?: () => void;
}

export function SiteFooter({ onWorkClick }: SiteFooterProps) {
  const navigate = useNavigate();

  const handleWorkClick = onWorkClick ?? (() => navigate("/"));

  return (
    <div className="fixed left-4 right-4 bottom-6 z-[110] lg:left-6 lg:right-6" data-name="Footer">
      <div className="hidden min-[768px]:block absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black" data-name="footer-year">
        <p>©2026</p>
      </div>
      {/* Mobile: available for freelance + email + location */}
      <div className="md:hidden absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal" data-name="footer-mobile">
        <p className="mb-0">available for freelance</p>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
        <div className="flex items-center gap-[8px] mt-6">
          <div className="h-[13px] w-[11px] relative shrink-0">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
              <path d={headerPaths.p122a1c00} fill="black" />
            </svg>
          </div>
          <span>MDE, COL</span>
        </div>
      </div>
      {/* Desktop: available for freelance + email */}
      <div className="hidden md:block absolute left-[232px] bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal" data-name="footer-freelance">
        <p className="mb-0">available for freelance</p>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
      </div>
      <div className="absolute flex flex-col items-end right-0 bottom-0 text-black" data-name="about">
        <SlotCta text="WORK" className="text-[12px]" onClick={handleWorkClick} />
        <SlotCta text="ABOUT" className="text-[12px]" onClick={() => navigate("/about")} />
      </div>
    </div>
  );
}
