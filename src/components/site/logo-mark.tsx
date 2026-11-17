const lamps = {
  day: [
    { x: "30.05%", y: "16.57%" },
    { x: "73.34%", y: "21.74%" },
  ],
  night: [
    { x: "29.13%", y: "14.79%" },
    { x: "73.49%", y: "21.18%" },
  ],
} as const;

export function LogoMark({
  variant,
  className = "",
  alt = "Gibeza Property Investments",
}: {
  variant: "day" | "night";
  className?: string;
  alt?: string;
}) {
  return (
    <span className={"inline-block align-top " + className}>
      <span className="relative inline-block h-full align-top leading-none">
        <img
          src={variant === "night" ? "/logo-night.webp" : "/logo.webp"}
          alt={alt}
          decoding="async"
          loading="lazy"
          className="block h-full w-auto"
        />
        {lamps[variant].map((lamp, index) => (
          <span key={lamp.x} className="logo-lamp" style={{ left: lamp.x, top: lamp.y, animationDelay: index ? "0.62s" : "0s" }} />
        ))}
      </span>
    </span>
  );
}
