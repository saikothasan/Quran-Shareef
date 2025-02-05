# Quran Shareef

A modern, responsive Quran application built with Next.js 14, featuring Arabic text, translations, and audio recitations.

![Quran Shareef](https://sjc.microlink.io/rnOiqdQVqwjhq4ySNOee98E43B879uoQ7bwoaTcj0m62ZX4Ma3MoOuffslK-AxTS8Qz3A586GXFX13YCBVT8_Q.jpeg)

## Features

- 📖 Complete Quran text with Arabic and Bengali translations
- 🎧 Audio recitations with player controls
- 🔍 Search functionality for Surahs
- 📱 Responsive design for all devices
- ⚡ Fast page loads with Edge Runtime
- 🌙 Clean, modern UI with Tailwind CSS
- ♿ Accessibility features

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Quran.com API](https://quran.api-docs.io/) - Quran data
- [Vercel](https://vercel.com) - Deployment

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/saikothasan/Quran-Shareef.git
cd Quran-Shareef
```

Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
Quran-Shareef/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   └── surah/[id]/        # Dynamic surah pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── audio-player.tsx  # Custom audio player
├── lib/                  # Utility functions
│   └── quran.ts         # Quran API functions
├── public/              # Static files
└── styles/             # Global styles
```

## API Integration

The application uses the Quran.com API for fetching:
- List of all surahs
- Surah details and verses
- Translations
- Audio recitations

## Deployment

The project is configured for deployment on Vercel or Cloudflare Pages with Edge Runtime support.

To deploy on Vercel:

```bash
vercel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Quran.com](https://quran.com) for providing the API
- [Islamic Network](https://islamic.network) for additional audio sources
- [shadcn](https://twitter.com/shadcn) for the amazing UI components

## Author

- Saikot Hasan ([@saikothasan](https://github.com/saikothasan))

## Support

If you find this project helpful, please consider giving it a ⭐️
