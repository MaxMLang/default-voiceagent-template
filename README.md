# 🎙️ Build Conversational Agents in Minutes

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A versatile, full-stack template for building AI-powered voice agents. This project combines Next.js, Tailwind CSS, and Vapi's conversational AI platform to create interactive voice experiences.

If you use this template for research purposes, please cite it as follows:

```latex
@misc{maxmlang_voiceagent,
  author = {Max M. Lang},
  title = {Build Conversational Agents in Minutes},
  year = {2025},
  url = {https://github.com/MaxMLang/default-voiceagent-template},
  note = {Accessed [Date of access]}
}
```

## Demo


https://github.com/user-attachments/assets/3ed78660-55d0-465a-8c55-03fcc3955c65


## Features

- **Next.js 14** - React framework with server-side rendering
- **Tailwind CSS** - Utility-first styling for rapid UI development
- **Vapi Integration** - Seamless AI voice agent capabilities
- **Responsive Design** - Works on desktop and mobile devices
- **Easy Customization** - Modular components and clear structure
- **Docker Support** - Containerized deployment for any environment
- **Environment Variables** - Secure configuration management

## Prerequisites

The following files are required for the voice agent to work:
- `hooks/use-vapi.ts` - Custom hook for Vapi integration
- `components/orb.tsx` - The voice interface component
- `.env` - Environment configuration file (copy from `.env.example`)

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file with your credentials from the [Vapi Dashboard](https://vapi.ai/dashboard)

## Environment Configuration

The `.env.example` file includes:

```
# Vapi API credentials
# Get these from https://vapi.ai/dashboard
NEXT_PUBLIC_VAPI_API_KEY=your_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here

# Optional: Additional configuration
# NEXT_PUBLIC_VAPI_SERVER_URL=https://api.vapi.ai
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

These environment variables are essential for connecting to the Vapi platform.

## Getting Started

After setting up your environment variables, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Setup

This template includes Docker support for easy deployment in any environment:

1. Build the Docker image:
   ```bash
   docker build -t ai-voice-agent .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env ai-voice-agent
   ```

   Alternatively, specify environment variables directly:
   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_VAPI_API_KEY=your_key -e NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_id ai-voice-agent
   ```

3. Access your application at http://localhost:3000

You can also use Docker Compose for a more streamlined setup:

```bash
docker-compose up
```

## Deployment Options

This template can be deployed virtually anywhere:

- **Vercel**: One-click deployment with the [Vercel Platform](https://vercel.com/new)
- **Docker**: Deploy to any environment that supports Docker containers
- **Kubernetes**: Scale your application with Kubernetes orchestration
- **AWS/GCP/Azure**: Deploy to major cloud providers
- **Self-hosted**: Run on your own infrastructure

For production deployments, consider using environment variables through your hosting platform rather than .env files.

## Customization

This template is designed to be highly customizable:

### Voice Agent Behavior
- Modify the assistant settings in the Vapi Dashboard
- Customize conversation flows and responses
- Add domain-specific knowledge to your agent

### UI/UX
- Edit `app/page.tsx` to change the main page layout
- Modify `components/orb.tsx` to customize the voice interface
- Use Tailwind classes to style components to match your brand

### Backend Integration
- Connect to your own APIs or databases
- Add authentication for personalized experiences
- Implement webhooks for advanced functionality

## Project Structure

```
├── app/                  # Next.js app directory
│   └── page.tsx          # Main page component
├── components/           # React components
│   └── orb.tsx           # Voice interface component
├── hooks/                # Custom React hooks
│   └── use-vapi.ts       # Vapi integration hook
├── public/               # Static assets
├── styles/               # Global styles
├── .env                  # Environment variables (create this)
├── .env.example          # Example environment variables
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── ...                   # Configuration files
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vapi Documentation](https://docs.vapi.ai/)

## Security Note

Make sure to:
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use environment variables for all sensitive information

## Troubleshooting

If you encounter issues:

1. Verify your Vapi API key and Assistant ID are correct
2. Check that your environment variables are properly loaded
3. Ensure all dependencies are installed with `npm install`
4. Clear your browser cache if you see stale data

## Credits

This project was created by [MaxMLang](https://github.com/MaxMLang) and utilizes open source libraries based on work by [cameronking4](https://github.com/cameronking4).

## License

This project is licensed for **non-commercial use only**. 

Key requirements:
- You may use this software for personal, educational, or research purposes
- Commercial use is prohibited without explicit permission
- Attribution to the original author [MaxMLang](https://github.com/MaxMLang) must be maintained
- See the [LICENSE](./LICENSE) file for complete terms

For commercial licensing inquiries, please contact the copyright holder.
