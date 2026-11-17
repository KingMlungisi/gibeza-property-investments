import { Link } from "@tanstack/react-router";
import { tabs } from "@/components/site/header";
import { LogoMark } from "@/components/site/logo-mark";
import { email, postal } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-[#141414] text-[#f4f1ec]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <LogoMark variant="day" className="logo-day h-28 rounded-md bg-[#f4f1ec] p-2" />
          <LogoMark variant="night" className="logo-night h-28" alt="" />
          <p className="mt-3 text-sm text-[#f4f1ec]/70">Gibeza Property Investments CC.</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange">TABS</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {tabs.map((tab) => (
              <li key={tab.to}>
                <Link to={tab.to} className="text-[#f4f1ec]/80 hover:text-[#f4f1ec]">
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange">EMAIL</p>
          <a href={`mailto:${email}`} className="mt-3 block text-sm text-[#f4f1ec]/80 hover:text-[#f4f1ec]">
            {email}
          </a>
          <p className="mt-3 text-sm text-[#f4f1ec]/60">Postal: {postal}</p>
        </div>
      </div>
    </footer>
  );
}
