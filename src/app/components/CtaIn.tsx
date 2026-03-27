type CtaInProps = {
  className?: string;
  property1?: "2" | "1";
};

export function CtaIn({ className, property1 = "1" }: CtaInProps) {
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
