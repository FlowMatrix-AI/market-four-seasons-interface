interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-primary">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-lg text-text-light max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 bg-accent rounded-full ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
