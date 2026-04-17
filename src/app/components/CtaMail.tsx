type CtaMailProps = {
  className?: string;
  property1?: "1" | "2";
};

export function CtaMail({ className, property1 = "1" }: CtaMailProps) {
  const is2 = property1 === "2";
  return (
    <div className={className || `h-[24px] relative w-[29px] ${is2 ? "" : 'font-['Avantt',sans-serif] font-normal'}`}>
      <p className={`absolute left-0 ${is2 ? 'font-["Test_Söhne_Mono:Buch",sans-serif] not-italic text-black top-[calc(50%-28px)]' : "text-[#404040] top-[calc(50%-8px)]"}`}>M</p>
      <p className={`absolute ${is2 ? 'font-['Avantt',sans-serif] font-normal left-[9.68px] text-black top-[calc(50%-33px)]' : "left-[10.79px] text-[#404040] top-[calc(50%-8px)]"}`}>A</p>
      <p className={`absolute ${is2 ? 'font-['Avantt',sans-serif] font-normal left-[18.35px] text-black top-[calc(50%-38px)]' : "left-[19px] text-[#404040] top-[calc(50%-8px)]"}`}>I</p>
      <p className={`absolute left-[22px] ${is2 ? 'font-['Avantt',sans-serif] font-normal text-black top-[calc(50%-43px)]' : "text-[#404040] top-[calc(50%-8px)]"}`}>L</p>
      <p className={`absolute left-0 ${is2 ? 'font-['Avantt',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[24px]"}`}>M</p>
      <p className={`absolute left-[10.79px] ${is2 ? 'font-['Avantt',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[29px]"}`}>A</p>
      <p className={`absolute left-[19px] ${is2 ? 'font-['Avantt',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[34px]"}`}>I</p>
      <p className={`absolute left-[22px] ${is2 ? 'font-['Avantt',sans-serif] font-normal text-[#404040] top-[4px]' : "text-black top-[39px]"}`}>L</p>
    </div>
  );
}
