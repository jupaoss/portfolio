import clsx from "clsx";
import svgPaths from "./svg-za68zag2ck";
import imgImage from "@/assets/c89e008f1c0974e021ee6f4e45d74cff3d25471b.png";
import imgImage1 from "@/assets/a1c3d66841196f222ab7f2429d1463ad6f482626.png";
import imgImage2 from "@/assets/66753dc5cdf2d62e732060e73330ba4a5119d0a5.png";
import imgPic from "@/assets/f96a2097a09e69642c6f236837ada216df1f304d.png";
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={additionalClassNames}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return <Wrapper1 additionalClassNames={clsx("-translate-x-1/2 -translate-y-1/2 absolute h-[476px] left-1/2 w-[380px]", additionalClassNames)}>{children}</Wrapper1>;
}

function HomeDesktopImage() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img alt="" className="absolute h-[128.63%] left-[-60.96%] max-w-none top-[-15.81%] w-[220.25%]" src={imgImage} />
    </div>
  );
}

function Row() {
  return (
    <div className="h-[2px] relative shrink-0 w-[1370px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1370 2">
        <g id="row">
          <circle cx="1" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4453" r="1" />
          <circle cx="115" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4454" r="1" />
          <circle cx="229" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4455" r="1" />
          <circle cx="343" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4456" r="1" />
          <circle cx="457" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4457" r="1" />
          <circle cx="571" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4458" r="1" />
          <circle cx="685" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4459" r="1" />
          <circle cx="799" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4460" r="1" />
          <circle cx="913" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4461" r="1" />
          <circle cx="1027" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4462" r="1" />
          <circle cx="1141" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4463" r="1" />
          <circle cx="1255" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4464" r="1" />
          <circle cx="1369" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4465" r="1" />
        </g>
      </svg>
    </div>
  );
}
type CtaMailProps = {
  className?: string;
  property1?: "1" | "2";
};

function CtaMail({ className, property1 = "1" }: CtaMailProps) {
  const is2 = property1 === "2";
  return (
    <div className={className || `h-[24px] relative w-[29px] ${is2 ? "" : 'font-['Space_Grotesk',sans-serif] font-normal'}`}>
      <p className={`absolute left-0 ${is2 ? 'font-["Test_Söhne_Mono:Buch",sans-serif] not-italic text-black top-[calc(50%-28px)]' : "text-[#404040] top-[calc(50%-8px)]"}`}>M</p>
      <p className={`absolute ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal left-[9.68px] text-black top-[calc(50%-33px)]' : "left-[10.79px] text-[#404040] top-[calc(50%-8px)]"}`}>A</p>
      <p className={`absolute ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal left-[18.35px] text-black top-[calc(50%-38px)]' : "left-[19px] text-[#404040] top-[calc(50%-8px)]"}`}>I</p>
      <p className={`absolute left-[22px] ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal text-black top-[calc(50%-43px)]' : "text-[#404040] top-[calc(50%-8px)]"}`}>L</p>
      <p className={`absolute left-0 ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[24px]"}`}>M</p>
      <p className={`absolute left-[10.79px] ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[29px]"}`}>A</p>
      <p className={`absolute left-[19px] ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[34px]"}`}>I</p>
      <p className={`absolute left-[22px] ${is2 ? 'font-['Space_Grotesk',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[39px]"}`}>L</p>
    </div>
  );
}
type CtaBeProps = {
  className?: string;
  property1?: "2" | "1";
};

function CtaBe({ className, property1 = "1" }: CtaBeProps) {
  const is2 = property1 === "2";
  return (
    <div className={className || "h-[24px] relative w-[15px]"}>
      <p className={`absolute left-0 ${is2 ? "text-black top-[-15px]" : "text-[#404040] top-[calc(50%-8px)]"}`}>b</p>
      <p className={`absolute text-[#404040] top-[calc(50%-8px)] ${is2 ? "left-0" : "left-[7.68px]"}`}>{is2 ? "b" : "e"}</p>
      <p className={`absolute text-black ${is2 ? "left-[7.68px] top-[-20px]" : "left-0 top-[23.85px]"}`}>{is2 ? "e" : "b"}</p>
      <p className={`absolute left-[7.68px] ${is2 ? "text-[#404040] top-[calc(50%-8px)]" : "text-black top-[28.85px]"}`}>e</p>
    </div>
  );
}
type CtaInProps = {
  className?: string;
  property1?: "2" | "1";
};

function CtaIn({ className, property1 = "1" }: CtaInProps) {
  const is2 = property1 === "2";
  return (
    <div className={className || "h-[24px] relative w-[11px]"}>
      <p className={`absolute left-0 ${is2 ? "text-black top-[calc(50%-28px)]" : "text-[#404040] top-[calc(50%-8px)]"}`}>I</p>
      <p className={`absolute left-[2.67px] ${is2 ? "text-black top-[calc(50%-32px)]" : "text-[#404040] top-[calc(50%-8px)]"}`}>N</p>
      <p className={`absolute left-0 ${is2 ? "text-[#404040] top-[calc(50%-8px)]" : "text-black top-[calc(50%+12px)]"}`}>I</p>
      <p className={`absolute left-[2.67px] ${is2 ? "text-[#404040] top-[calc(50%-8px)]" : "text-black top-[calc(50%+17px)]"}`}>N</p>
    </div>
  );
}
type MenuProps = {
  className?: string;
  property1?: "1" | "2";
};

function Menu({ className, property1 = "1" }: MenuProps) {
  const is1 = property1 === "1";
  const is2 = property1 === "2";
  return (
    <div className={className || "h-[80px] relative w-[1392px]"}>
      <div className={`absolute h-[20px] left-0 w-[58.962px] ${is2 ? "bottom-[29px]" : "top-[24px]"}`} data-name="logo">
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
      </div>
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
      <div className={`absolute font-['Space_Grotesk',sans-serif] font-normal leading-[1.3] left-[232px] text-[12px] uppercase whitespace-nowrap ${is2 ? "bottom-[51px] text-white translate-y-full" : "text-black top-[24px]"}`}>
        <p className="mb-0">{`Software & Experience`}</p>
        <p>Designer.</p>
      </div>
    </div>
  );
}

export default function HomeDesktop() {
  return (
    <div className="bg-white relative size-full" data-name="Home - Desktop">
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[112px] items-start left-1/2 top-[62px] w-[1370px]" data-name="dots">
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
      <div className="absolute bottom-[37px] flex flex-col font-['Space_Grotesk',sans-serif] font-['Test_Söhne_Mono:Leicht',sans-serif] font-normal justify-end leading-[normal] left-[calc(16.67%+19px)] not-italic text-[0px] text-[12px] text-black uppercase whitespace-nowrap">
        <p className="mb-0">available for freelance</p>
        <p className="[text-decoration-skip-ink:none] decoration-solid underline">julianpatinoossa@gmail.com</p>
      </div>
      <div className="absolute bottom-[37px] flex flex-col font-['Space_Grotesk',sans-serif] font-normal justify-end leading-[0] left-[24px] text-[12px] text-black uppercase whitespace-nowrap">
        <p className="leading-[normal]">©2025</p>
      </div>
      <Wrapper additionalClassNames="top-1/2">
        <div className="absolute bg-black inset-0" />
        <HomeDesktopImage />
      </Wrapper>
      <Wrapper additionalClassNames="top-[calc(50%-603px)]">
        <div className="absolute bg-black inset-0" />
        <HomeDesktopImage />
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgImage1} />
      </Wrapper>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[476px] left-1/2 top-[calc(50%+603px)] w-[380px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[20px] items-start left-[256px] top-1/2 w-[451px]" data-name="project name">
        <p className="font-['Space_Grotesk',sans-serif] font-bold leading-[62px] relative shrink-0 text-[#131313] text-[80px] w-full">BETTER TOGETHER</p>
        <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[14px] text-black uppercase w-full">
          <p className="leading-[normal]">— Android</p>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-[calc(75%+77px)] top-1/2 w-[24px]" data-name="slider">
        <div className="content-stretch flex gap-[10px] h-[16px] items-center justify-end relative shrink-0 w-full" data-name="Selected">
          <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-black uppercase whitespace-nowrap">01</p>
          <div className="bg-black h-[2px] shrink-0 w-[24px]" />
        </div>
        <div className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
          <div className="bg-black h-[2px] shrink-0 w-[6px]" />
        </div>
        <div className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
          <div className="bg-black h-[2px] shrink-0 w-[6px]" />
        </div>
        <div className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
          <div className="bg-black h-[2px] shrink-0 w-[6px]" />
        </div>
        <div className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
          <div className="bg-black h-[2px] shrink-0 w-[6px]" />
        </div>
        <div className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
          <div className="bg-black h-[2px] shrink-0 w-[6px]" />
        </div>
      </div>
      <div className="absolute left-[calc(75%-7px)] size-[76px] top-[187px]" data-name="Dragger">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 76">
          <g id="Dragger">
            <circle cx="38" cy="38" id="Ellipse 4451" r="37.5" stroke="var(--stroke-0, #404040)" />
            <circle cx="38" cy="38" id="Ellipse 4452" r="12.5" stroke="var(--stroke-0, #404040)" />
            <path d={svgPaths.p13ab2380} fill="var(--fill-0, black)" id="Polygon 1" />
            <path d={svgPaths.p271d3b80} fill="var(--fill-0, black)" id="Polygon 2" />
          </g>
        </svg>
      </div>
      <div className="absolute content-stretch flex gap-[8px] items-center justify-end right-[24px] top-[757px]" data-name="about">
        <Wrapper1 additionalClassNames="relative shrink-0 size-[16px]">
          <div className="absolute bg-[#d9d9d9] inset-0" />
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[133.58%] left-0 max-w-none top-[-4.16%] w-full" src={imgPic} />
          </div>
        </Wrapper1>
        <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-normal justify-end leading-[0] relative shrink-0 text-[12px] text-black uppercase whitespace-nowrap">
          <p className="leading-[normal]">ABOUT</p>
        </div>
      </div>
      <div className="absolute bottom-0 h-[810px] left-[24px] pointer-events-none top-0">
        <Menu className="h-[80px] pointer-events-auto sticky top-0 w-[1392px]" />
      </div>
      <div className="absolute flex items-center justify-center left-[calc(66.67%-1px)] size-[78.384px] top-[394px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-15">
          <div className="relative size-[64px]" data-name="face">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
              <path clipRule="evenodd" d={svgPaths.p10d67600} fill="var(--fill-0, #131313)" fillRule="evenodd" id="face" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}