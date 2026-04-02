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

export function DotGrid({ fixed = false }: { fixed?: boolean }) {
  const positionClass = fixed ? "fixed" : "absolute";
  return (
    <div
      className={`-translate-x-1/2 ${positionClass} content-stretch flex flex-col gap-[112px] items-start left-1/2 top-[62px] w-[1370px] z-0 pointer-events-none opacity-[0.33]`}
      data-name="dots"
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
}
