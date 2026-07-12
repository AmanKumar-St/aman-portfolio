import { personalData } from '../../data/content';

export default function Footer() {
  return (
    <footer
      data-section="footer"
      className="relative z-10 border-t border-frost/5 px-4 py-12"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <span className="font-heading text-lg font-semibold text-frost">
            AK<span className="text-amber">.</span>
          </span>
          <p className="mt-1 font-body text-xs text-frost/30">
            Crafted with code & curiosity
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={personalData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="font-body text-sm text-frost/40 transition-colors duration-300 hover:text-amber"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${personalData.email || ''}`}
            aria-label="Send email"
            className="font-body text-sm text-frost/40 transition-colors duration-300 hover:text-amber"
          >
            {personalData.email || 'aman@example.com'}
          </a>
        </div>

        <p className="font-body text-xs text-frost/20">
          © {new Date().getFullYear()} Aman Kumar
        </p>
      </div>
    </footer>
  );
}
