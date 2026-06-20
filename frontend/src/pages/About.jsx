import React from "react";
import { Link } from "react-router-dom";
import { Shield, Flame, Brain, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="bg-[#0A0C10] text-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden grain">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1768106047915-d5065b18352d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxncml0dHklMjBzcGFydGFuJTIwaGVsbWV0fGVufDB8fHx8MTc4MTk4MjM5Mnww&ixlib=rb-4.1.0&q=85"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10]/40 to-[#0A0C10]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-32 pb-20">
          <div className="label mb-3">/ Origin</div>
          <h1
            data-testid="about-heading"
            className="font-display text-5xl sm:text-7xl md:text-8xl uppercase leading-none max-w-5xl"
          >
            Forged on <br /><span className="text-[#FF4500]">A Yard</span>.
          </h1>
          <p className="mt-6 text-[#9BA1B0] text-lg max-w-2xl leading-relaxed">
            Mule Creek State Prison. Level IV. The yard where the line is held
            every shift. A Yard Apparel was born from the brothers and sisters
            who walk it.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="space-y-10">
          <Block
            num="01"
            title="The Yard"
            body="A Yard at Mule Creek State Prison is a Level IV facility — California's highest security tier. Code 2 and Code 3 incidents are part of the rhythm. Attempted murders. Stabbings. Riots. The officers who report here every shift accept the weight of that reality, knowing the line they hold protects the public, their partners, and the men who reside inside."
          />
          <Block
            num="02"
            title="Why we built this"
            body="Comradery. Plain and simple. We started designing crests for the units on A Yard to give the watch something tangible — a piece of gear that says I was here. I held the line. We started with two stickers: the Dumpster Fire Response Team for Custody, and the Mental Health Team for our clinicians who walk these floors every day. They moved fast. People wanted shirts. Hoodies. Patches. So we built A Yard Apparel."
          />
          <Block
            num="03"
            title="Made by the watch, for the watch"
            body="Every design here was sketched, refined, and approved by people who actually work the yard. No corporate hand. No sanitized version. Heavyweight fabric. Sharp lines. The same grit as the stickers that started it all. Buy a tee for yourself, gift one to your partner, send one to a buddy who transferred out. Five buildings. One mission."
          />
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-[#222631] bg-[#12151C]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-20 grid md:grid-cols-3 gap-px bg-[#222631]">
          {[
            { icon: Flame, title: "A Yard Custody", body: "Dumpster Fire Response Team. Built on discipline, united as one." },
            { icon: Brain, title: "Mental Health", body: "Strength in mind. Support in action. Care behind the wall." },
            { icon: Shield, title: "All units welcome", body: "ISU, Control Booths, Medical, every yard. If you walk the line, you have a place here." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#12151C] p-8">
              <Icon className="w-7 h-7 text-[#FF4500] mb-4" />
              <h3 className="font-display text-2xl uppercase mb-3">{title}</h3>
              <p className="text-[#9BA1B0] text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-24 text-center">
        <h2 className="font-display text-4xl sm:text-6xl uppercase leading-none">
          Rep the watch.
        </h2>
        <p className="text-[#9BA1B0] mt-4 max-w-md mx-auto">
          Pick your crest. Wear it loud. Hold the line.
        </p>
        <Link
          data-testid="about-cta-shop"
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-[#FF4500] hover:bg-[#E63E00] px-8 py-4 font-mono uppercase tracking-widest text-sm font-bold"
        >
          Shop the line <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

function Block({ num, title, body }) {
  return (
    <div className="border-l-2 border-[#FF4500] pl-6 py-2">
      <div className="label mb-2 text-[#FF4500]">/ {num}</div>
      <h2 className="font-display text-3xl sm:text-4xl uppercase mb-3 leading-none">
        {title}
      </h2>
      <p className="text-[#9BA1B0] leading-relaxed text-base">{body}</p>
    </div>
  );
}
