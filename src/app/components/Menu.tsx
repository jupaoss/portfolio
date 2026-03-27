import { Link } from "react-router";
import svgPaths from "../../imports/svg-za68zag2ck";
import { CtaIn } from "./CtaIn";
import { CtaBe } from "./CtaBe";
import { CtaMail } from "./CtaMail";

type MenuProps = {
  className?: string;
  property1?: "1" | "2";
};

export function Menu({ className, property1 = "1" }: MenuProps) {
  const is1 = property1 === "1";
  const is2 = property1 === "2";
  return (
    <div className={className || "h-[80px] relative w-[1392px]"}>
      <Link to="/" className={`absolute h-[20px] left-0 w-[58.962px] ${is2 ? "bottom-[29px]" : "top-[24px]"}`} data-name="logo">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.9619 20">
          <g id="logo">
            <path d={svgPaths.p79ef5c0} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, #404040)"} id="J ." />
            <g id="PO">
              <path d={svgPaths.p23e9dd00} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, #404040)"} />
              <path d={svgPaths.p37f5c380} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, #404040)"} />
            </g>
            <path d={svgPaths.p3f2ef180} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, #404040)"} id="L" />
            <path d={svgPaths.p3d018e00} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, #404040)"} id="L_2" />
            <path d={svgPaths.p35174f00} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, #404040)"} id="J ._2" />
          </g>
        </svg>
      </Link>
      <div className={`absolute content-stretch flex font-['Space_Grotesk',sans-serif] font-normal gap-[24px] items-center justify-end leading-[normal] right-0 text-[12px] tracking-[0.48px] uppercase whitespace-nowrap ${is2 ? "bottom-[32px]" : "top-[24px]"}`} data-name="options">
        {is1 && (
          <>
            <CtaIn className="h-[24px] overflow-clip relative shrink-0 w-[11px]" />
            <CtaBe className="h-[24px] overflow-clip relative shrink-0 w-[15px]" />
            <CtaMail className="h-[24px] overflow-clip relative shrink-0 w-[29px]" />
          </>
        )}
        {is2 && (
          <>
            <div className="h-[24px] overflow-clip relative shrink-0 w-[11px]" data-name="CTA/In">
              <p className="absolute left-0 text-[#404040] top-[calc(50%-8px)]">I</p>
              <p className="absolute left-[2.67px] text-[#404040] top-[calc(50%-8px)]">N</p>
              <p className="absolute left-0 text-black top-[calc(50%+12px)]">I</p>
              <p className="absolute left-[2.67px] text-black top-[calc(50%+17px)]">N</p>
            </div>
            <div className="h-[24px] overflow-clip relative shrink-0 w-[15px]" data-name="CTA/Be">
              <p className="absolute left-0 text-[#404040] top-[calc(50%-8px)]">b</p>
              <p className="absolute left-[7.68px] text-[#404040] top-[calc(50%-8px)]">e</p>
              <p className="absolute left-0 text-black top-[23.85px]">b</p>
              <p className="absolute left-[7.68px] text-black top-[28.85px]">e</p>
            </div>
            <div className="h-[24px] overflow-clip relative shrink-0 w-[29px]" data-name="CTA/Mail">
              <p className="absolute left-0 text-[#404040] top-[calc(50%-8px)]">M</p>
              <p className="absolute left-[10.79px] text-[#404040] top-[calc(50%-8px)]">A</p>
              <p className="absolute left-[19px] text-[#404040] top-[calc(50%-8px)]">I</p>
              <p className="absolute left-[22px] text-[#404040] top-[calc(50%-8px)]">L</p>
              <p className="absolute left-0 text-black top-[24px]">M</p>
              <p className="absolute left-[10.79px] text-black top-[29px]">A</p>
              <p className="absolute left-[19px] text-black top-[34px]">I</p>
              <p className="absolute left-[22px] text-black top-[39px]">L</p>
            </div>
          </>
        )}
      </div>
      <div className={`absolute contents left-[1059px] ${is2 ? "bottom-[31px]" : "top-[24px]"}`} data-name="location">
        <p className={`absolute font-['Space_Grotesk',sans-serif] font-normal leading-[normal] left-[1078px] text-[12px] uppercase whitespace-nowrap ${is2 ? "bottom-[46px] text-white translate-y-full" : "text-black top-[24px]"}`}>MDE, COL</p>
        <div className={`absolute h-[13px] left-[1059px] w-[11px] ${is2 ? "bottom-[32px]" : "top-[25px]"}`}>
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
            <path d={svgPaths.p122a1c00} fill={is2 ? "var(--fill-0, white)" : "var(--fill-0, black)"} id="Ellipse 4405" />
          </svg>
        </div>
      </div>
      <div className={`absolute font-['Space_Grotesk',sans-serif] font-normal leading-[normal] left-[235px] text-[12px] uppercase whitespace-nowrap ${is2 ? "bottom-[51px] text-white translate-y-full" : "text-black top-[24px]"}`}>
        <p className="mb-0">{`Software & Experience`}</p>
        <p>Designer.</p>
      </div>
    </div>
  );
}
