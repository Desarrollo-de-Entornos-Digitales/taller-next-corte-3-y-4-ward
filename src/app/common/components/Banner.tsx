"use client";

import Image from "next/image";
import NavBar from "./NavBar";

export default function Banner() {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden">
      <Image
        src="/assets/img-banner.svg"
        alt="WARD banner"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
        priority
      />
    </section>
  );
}