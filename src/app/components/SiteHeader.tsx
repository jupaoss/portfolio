import React from "react";
import { SlotCta } from "./SlotCta";
import svgPaths from "../../../graphic-assets/headerPaths";

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
      className="fixed left-4 right-4 lg:left-8 lg:right-8 top-0 z-[110] flex items-start pt-[24px] pb-[24px]"
      data-name="site-header"
    >
      {/* Logo */}
      <button
        ref={d?.logoRef}
        onClick={props.onLogoClick}
        className={`h-[19px] w-[59px] shrink-0 cursor-pointer hover:opacity-70 ${transition}`}
        data-name="logo"
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 59 19">
          <g id="logo">
            <path d={svgPaths.p79ef5c0} fill={logoColor} fillRule="evenodd" clipRule="evenodd" className={transition} />
            <path d={svgPaths.p3f2ef180} fill={logoColor} className={transition} />
            <path d={svgPaths.p35174f00} fill={logoColor} className={transition} />
            <path d={svgPaths.p23e9dd00} fill={logoColor} className={transition} />
            <path d={svgPaths.p37f5c380} fill={logoColor} className={transition} />
          </g>
        </svg>
      </button>

      {/* Software & Experience Designer */}
      <div
        ref={d?.textRef}
        className={`absolute left-[232px] hidden sm:block font-['Avantt',sans-serif] font-semibold leading-[1.3] text-[12px] uppercase whitespace-nowrap ${textColor} ${transition}`}
        data-name="subtitle"
      >
        <p className="mb-0">Software &amp; Experience</p>
        <p>Designer.</p>
      </div>

      {/* LOCATION / MDE, COL */}
      <div
        ref={d?.locationRef}
        className="absolute hidden min-[960px]:flex items-start gap-[8px]"
        style={{ left: "75%" }}
        data-name="location"
      >
        <div className="h-[13px] w-[11px] relative shrink-0 mt-[2px] hidden">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
            <path d={svgPaths.p122a1c00} fill={locationColor} id="Ellipse 4405" className={transition} />
          </svg>
        </div>
        <div className={`font-['Avantt',sans-serif] font-semibold leading-[1.3] text-[12px] uppercase whitespace-nowrap ${locationTextColor} ${transition}`}>
          <p className="mb-0">Location:</p>
          <p>MEDELLÍN, COL</p>
        </div>
      </div>

      {/* SOCIAL / IN BE */}
      <div
        ref={d?.menuRef}
        className={`absolute right-0 flex flex-col font-['Avantt',sans-serif] font-semibold leading-[1.3] text-[12px] tracking-[0.48px] uppercase whitespace-nowrap ${menuColor} ${transition}`}
        data-name="options"
      >
        <p className="mb-0">Social:</p>
        <div className="flex gap-[16px]">
          <SlotCta text="IN" as="a" href="https://www.linkedin.com" />
          <SlotCta text="BE" as="a" href="https://www.behance.net" />
        </div>
      </div>
    </div>
  );
}
