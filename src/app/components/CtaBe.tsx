type CtaBeProps = {
  className?: string;
  property1?: "2" | "1";
};

export function CtaBe({ className, property1 = "1" }: CtaBeProps) {
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
