import Link from "next/link";
import MusicPlayer from "./MusicPlayer";

export default function Hero() {
  return (
    <section
      id="home"
      className="w-full min-h-[calc(100vh-82px)] flex items-center px-6 sm:px-[88px] pt-8 pb-24"
      style={{ backgroundColor: "#FBF9F5" }}
    >
        {/* hero sec */}
      <div className="w-full max-w-[1104px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif" }}>
        
          <div className="flex flex-col gap-1">
            <h1
              className="text-[48px] leading-[1.15] text-[#000000] tracking-tight"
              style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif", fontWeight: 700 }}
            >
              Website{" "}
              <span style={{ color: "#FF5C00", fontWeight: 700 }}>
                Portofolio
              </span>
            </h1>
            <div className="flex items-center gap-0 mt-0">
              <span
                className="text-[48px] leading-[1.15] text-[#141414] px-3 py-0.5 rounded-[8px] inline-block"
                style={{
                  backgroundColor: "#FFB800",
                  border: "2.5px solid #000",
                  fontFamily: "var(--font-fredoka), cursive, sans-serif",
                  fontWeight: 700,
                }}
              >
                Padly Padilah
              </span>
            </div>
          </div>

          <p
            className="text-[17px] leading-[26px] text-[#374151] max-w-[480px]"
            style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif", fontWeight: 400 }}
          >
            I build whatever I enjoy creating, love Music &amp;
            Model-kits &amp; Audiophile
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="#projects"
              className="h-[52px] px-7 rounded-full flex items-center gap-2 text-[16px] text-white transition-all active:translate-y-[1px] active:shadow-none"
              style={{
                backgroundColor: "#FF5C00",
                border: "2px solid #000",
                boxShadow: "3px 3px 0 0 #000",
                fontFamily: "var(--font-fredoka), cursive, sans-serif",
                fontWeight: 600,
              }}
            >
              View Projects <span>↓</span>
            </Link>

            <Link
              href="#contact"
              className="h-[52px] px-7 rounded-full flex items-center gap-2 text-[16px] text-[#141414] bg-white transition-all active:translate-y-[1px] active:shadow-none"
              style={{
                border: "2px solid #000",
                boxShadow: "3px 3px 0 0 #000",
                fontFamily: "var(--font-fredoka), cursive, sans-serif",
                fontWeight: 600,
              }}
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/*shelter */}
        <div className="flex justify-center lg:justify-end">
          <MusicPlayer />
        </div>
      </div>
    </section>
  );
}
