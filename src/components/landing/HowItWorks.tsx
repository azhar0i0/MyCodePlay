import { motion } from "framer-motion";
import { PenLine, Eye, Rocket } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    step: "01",
    title: "Write Your Code",
    description: "Open the editor and start writing HTML, CSS, and JavaScript in separate panels.",
  },
  {
    icon: Eye,
    step: "02",
    title: "See It Live",
    description: "Your code renders instantly in the live preview pane. Toggle between device sizes.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Save & Share",
    description: "Save your project locally or generate a shareable link to send to anyone.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-32 overflow-hidden">
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
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Three steps to{" "}
            <span className="gradient-text">launch</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl glass flex items-center justify-center relative">
                <item.icon className="w-10 h-10 text-[hsl(var(--gradient-start))]" />
                <span className="absolute -top-2 -right-2 text-xs font-bold text-muted-foreground bg-secondary rounded-full w-7 h-7 flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
