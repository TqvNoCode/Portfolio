import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { ProjectShowcase } from './components/ProjectShowcase/ProjectShowcase';
import { TechnicalArsenal } from './components/TechnicalArsenal/TechnicalArsenal';
import { DotfilesExplorer } from './components/DotfilesExplorer/DotfilesExplorer';
import { EngineeringNotes } from './components/EngineeringNotes/EngineeringNotes';
import { ListeningRoom } from './components/listening-room/ListeningRoom';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { OnekoCursor } from './components/oneko/OnekoCursor';

export const App: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="portfolio-app">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop Companion Cat (Oneko) */}
      <OnekoCursor />

      {/* Header */}
      <Header onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <ProjectShowcase />
        <TechnicalArsenal />
        <DotfilesExplorer />
        <EngineeringNotes />
        <ListeningRoom />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default App;
