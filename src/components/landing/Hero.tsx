import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[hsl(var(--gradient-start)/0.15)] blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[hsl(var(--gradient-end)/0.12)] blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--gradient-mid)/0.08)] blur-[150px]" />

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--gradient-end))] animate-pulse" />
            Built for developers who ship fast
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
          >
            <span className="gradient-text">Code.</span>{" "}
            <span className="text-foreground">Preview.</span>{" "}
            <span className="gradient-text">Ship.</span>
          </motion.h1>

          {/* Sub headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The real-time frontend playground that runs entirely in your browser.
            Write HTML, CSS & JS — see results instantly. Import npm packages. Simulate devices. Share with a link.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-13 px-8 text-base font-semibold bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-mid))] hover:opacity-90 transition-all duration-300 shadow-[0_0_30px_hsl(var(--gradient-start)/0.3)] hover:shadow-[0_0_50px_hsl(var(--gradient-start)/0.4)] rounded-xl"
            >
              <Link to="/editor">
                <Play className="w-4 h-4 mr-1" />
                Start Coding
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-semibold glass hover:bg-secondary/60 rounded-xl"
            >
              <a href="#features">
                See Features
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Floating code snippet */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="glass rounded-2xl p-1 shadow-2xl shadow-[hsl(var(--gradient-start)/0.1)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-[hsl(45,90%,55%)]/70" />
                <div className="w-3 h-3 rounded-full bg-[hsl(140,70%,45%)]/70" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">playground.js</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div>
                <span className="text-[hsl(var(--gradient-start))]">const</span>{" "}
                <span className="text-[hsl(var(--gradient-end))]">playground</span>{" "}
                <span className="text-muted-foreground">=</span>{" "}
                <span className="text-[hsl(var(--gradient-start))]">{"{"}</span>
              </div>
              <div className="ml-6">
                <span className="text-foreground">editor</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-[hsl(140,70%,55%)]">'real-time'</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-6">
                <span className="text-foreground">preview</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-[hsl(140,70%,55%)]">'instant'</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-6">
                <span className="text-foreground">npm</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-[hsl(45,90%,55%)]">true</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="ml-6">
                <span className="text-foreground">devices</span>
                <span className="text-muted-foreground">:</span>{" "}
                <span className="text-muted-foreground">[</span>
                <span className="text-[hsl(140,70%,55%)]">'mobile'</span>
                <span className="text-muted-foreground">,</span>{" "}
                <span className="text-[hsl(140,70%,55%)]">'tablet'</span>
                <span className="text-muted-foreground">,</span>{" "}
                <span className="text-[hsl(140,70%,55%)]">'desktop'</span>
                <span className="text-muted-foreground">]</span>
              </div>
              <div>
                <span className="text-[hsl(var(--gradient-start))]">{"}"}</span>
                <span className="text-muted-foreground">;</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
