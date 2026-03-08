import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 py-12">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] flex items-center justify-center">
              <span className="text-sm font-black text-primary-foreground">C</span>
            </div>
            <span className="font-bold text-lg">
              CodePlayground <span className="text-muted-foreground font-normal text-sm">by azhar0i0</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} azhar0i0. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/azhar0i0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/azhar0i0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
