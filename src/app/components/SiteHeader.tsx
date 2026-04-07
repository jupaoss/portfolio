import React from "react";
import { SlotCta } from "./SlotCta";
import svgPaths from "@/assets/headerPaths";

interface SiteHeaderLightProps {
  variant: "light";
  onLogoClick?: () => void;
}

interface SiteHeaderDynamicProps {
  variant: "dynamic";
  isDarkLogo?: boolean;
  isDarkText?: boolean;
  isDarkMenu?: boolean;
  isDarkLocation?: boolean;
  logoRef?: React.Ref<HTMLButtonElement>;
  textRef?: React.Ref<HTMLDivElement>;
  menuRef?: React.Ref<HTMLDivElement>;
  locationRef?: React.Ref<HTMLDivElement>;
  onLogoClick?: () => void;
}

type SiteHeaderProps = SiteHeaderLightProps | SiteHeaderDynamicProps;

export function SiteHeader(props: SiteHeaderProps) {
  const isDynamic = props.variant === "dynamic";
  const d = isDynamic ? (props as SiteHeaderDynamicProps) : null;

  const logoColor = isDynamic ? (d!.isDarkLogo ? "black" : "white") : "#000000";
  const textColor = isDynamic
    ? (d!.isDarkText ? "text-black" : "text-white")
    : "text-black";
  const menuColor = isDynamic
    ? (d!.isDarkMenu ? "text-black" : "text-white")
    : "text-black";
  const locationColor = isDynamic
    ? (d!.isDarkLocation ? "black" : "white")
    : "black";
  const locationTextColor = isDynamic
    ? (d!.isDarkLocation ? "text-black" : "text-white")
    : "text-black";

  const transition = isDynamic ? "transition-colors duration-300" : "";

  return (
    <div
      className="fixed left-4 right-4 lg:left-6 lg:right-6 top-0 z-[110] flex items-start pt-[24px] pb-[24px]"
      data-name="site-header"
    >
      {/* Logo */}
      <button
        ref={d?.logoRef}
        onClick={props.onLogoClick}
        className={`h-[20px] w-[58.962px] shrink-0 cursor-pointer hover:opacity-70 ${transition}`}
        data-name="logo"
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.9619 20">
          <g id="logo">
            <path d={svgPaths.p79ef5c0} fill={logoColor} id="J ." className={transition} />
            <g id="PO">
              <path d={svgPaths.p23e9dd00} fill={logoColor} className={transition} />
              <path d={svgPaths.p37f5c380} fill={logoColor} className={transition} />
            </g>
            <path d={svgPaths.p3f2ef180} fill={logoColor} id="L" className={transition} />
            <path d={svgPaths.p3d018e00} fill={logoColor} id="L_2" className={transition} />
            <path d={svgPaths.p35174f00} fill={logoColor} id="J ._2" className={transition} />
          </g>
        </svg>
      </button>

      {/* Software & Experience Designer */}
      <div
        ref={d?.textRef}
        className={`absolute left-[232px] hidden sm:block font-['Space_Grotesk',sans-serif] font-normal leading-[1.3] text-[12px] uppercase whitespace-nowrap ${textColor} ${transition}`}
        data-name="subtitle"
      >
        <p className="mb-0">Software &amp; Experience</p>
        <p>Designer.</p>
      </div>

      {/* MDE, COL */}
      <div
        ref={d?.locationRef}
        className="absolute hidden min-[960px]:flex items-center gap-[8px]"
        style={{ left: "75%" }}
        data-name="location"
      >
        <div className="h-[13px] w-[11px] relative shrink-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
            <path d={svgPaths.p122a1c00} fill={locationColor} id="Ellipse 4405" className={transition} />
          </svg>
        </div>
        <p className={`font-['Space_Grotesk',sans-serif] font-normal leading-none text-[12px] uppercase whitespace-nowrap ${locationTextColor} ${transition}`}>
          MDE, COL
        </p>
      </div>

      {/* IN BE MAIL */}
      <div
        ref={d?.menuRef}
        className={`absolute right-0 flex font-['Space_Grotesk',sans-serif] font-normal gap-[24px] items-start leading-none text-[12px] tracking-[0.48px] uppercase whitespace-nowrap ${menuColor} ${transition}`}
        data-name="options"
      >
        <SlotCta text="IN" as="a" href="https://www.linkedin.com" />
        <SlotCta text="BE" as="a" href="https://www.behance.net" />
      </div>
    </div>
  );
}
