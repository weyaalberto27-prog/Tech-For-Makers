const fs = require('fs');

let welcomeCode = fs.readFileSync('src/components/WelcomeScreen.tsx', 'utf8');
// Just inject a generic guest button in the welcome screen since handleGuestSignIn isn't there anymore
welcomeCode = welcomeCode.replace(/<\/button>\s*<\/p>\s*<\/div>\s*<\/motion\.div>/g, `</button>
          </p>
          <div className="mt-4 pt-4 border-t border-[#2d2d33] flex justify-center">
            <button
                onClick={() => { (window as any).guestAuthBypass = true; onComplete(); }}
                className="text-gray-400 hover:text-white text-sm transition-colors font-medium flex items-center group"
            >
              Usar AllvaCreator sem login (Visitante)
              <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </motion.div>`);
fs.writeFileSync('src/components/WelcomeScreen.tsx', welcomeCode);

