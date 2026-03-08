import { motion } from "framer-motion";
import { Code2, Eye, Package, Share2, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Real-Time Editor",
    description: "Write HTML, CSS & JavaScript with instant live preview. No compilation, no waiting.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your changes render in real-time in a sandboxed iframe as you type.",
  },
  {
    icon: Package,
    title: "NPM Imports",
    description: "Import any npm package directly via unpkg or skypack CDN. No build step required.",
  },
  {
    icon: Smartphone,
    title: "Device Simulation",
    description: "Preview your project on mobile, tablet, and desktop viewports with one click.",
  },
  {
    icon: Share2,
    title: "Instant Sharing",
    description: "Generate shareable links to your projects. Anyone can view or fork your work.",
  },
  {
    icon: Zap,
    title: "Zero Setup",
    description: "No installation, no configuration. Open the browser and start building immediately.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4 block">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Everything you need to{" "}
            <span className="gradient-text">prototype fast</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A complete frontend playground with professional-grade tools, all running in your browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass rounded-2xl p-8 hover:bg-secondary/40 transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(var(--gradient-start)/0.05)]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--gradient-start)/0.2)] to-[hsl(var(--gradient-end)/0.1)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-[hsl(var(--gradient-start))]" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
