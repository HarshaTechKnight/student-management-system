# CampusAI - Student Information System

This is a NextJS application built with shadcn components and integrated with Genkit for AI features. It serves as a Student Information System with modules for managing student data, tracking grades, recording attendance, and providing AI-driven insights.

## Features

- **Student Management:** View and manage student profiles.
- **Gradebook:** Record and track student grades.
- **Attendance:** Monitor student attendance.
- **AI Insights:** Utilize AI integrations powered by Genkit for features like dropout risk prediction and performance forecasting.
- **Shadcn Components:** Built with a modern and responsive UI using shadcn components.
- **NextJS:** Server-rendered React application for performance and SEO.
- **Genkit:** Integrated for AI model orchestration and development.

## Installation

1. Clone the repository:
   
```bash
git clone <repository_url>
```
2. Install dependencies:
   
```bash
npm install
   # or
   yarn install
   # or
   pnpm install
```
3. Set up environment variables: Create a `.env.local` file in the root directory and add necessary environment variables (e.g., API keys for AI services).
4. Run the development server:
   
```bash
npm run dev
   # or
   yarn dev
   # or
   pnpm dev
```

## Running AI Flows (with Genkit)

If you are developing or running the AI features, you will need to work with Genkit.

1. Ensure you have Genkit installed and configured. Refer to the [Genkit documentation](https://genkit.ai/docs) for installation and setup instructions.
2. The Genkit flows are located in the `src/ai/flows` directory.
3. You can run, test, and deploy these flows using the Genkit CLI.

## Project Structure

```
.
├── public          # Public assets
├── src
│   ├── ai          # Genkit AI integrations and flows
│   │   ├── flows
│   │   └── ...
│   ├── app         # NextJS pages and routing
│   │   ├── ai-insights
│   │   ├── attendance
│   │   ├── gradebook
│   │   ├── students
│   │   └── ...
│   ├── components  # Reusable UI components (shadcn)
│   │   ├── layout
│   │   ├── shared
│   │   └── ui
│   ├── hooks       # Custom React hooks
│   └── lib         # Utility functions and libraries
├── components.json # shadcn component configuration
├── next.config.ts  # NextJS configuration
├── package.json    # Project dependencies
├── postcss.config.mjs # PostCSS configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json   # TypeScript configuration
└── README.md       # This file
```

## Contributing

Contributions are welcome! Please follow the standard GitHub pull request process.

## License

This project is licensed under the [MIT License](LICENSE).

## Screesnshots

![Screenshot-1](https://github.com/user-attachments/assets/87be4a2d-bec5-4c91-b820-5cb0b5cdfc5f)
![Screenshot-2](https://github.com/user-attachments/assets/9872ebc3-a991-4fbd-bd30-b43a5871dec9)
![Screenshot-3](https://github.com/user-attachments/assets/d7c4abd3-be9e-4d44-b536-4eaac49e2180)
![Screenshot-5](https://github.com/user-attachments/assets/a6fae7c8-2440-469a-a1fd-a3c0d55885d4)
![Screenshot-4](https://github.com/user-attachments/assets/92f30d6c-9b90-465b-a54c-dc50c9d6cea8)
![Screenshot-6](https://github.com/user-attachments/assets/773bceaa-4aaa-49b3-9dee-72e5f55c856e)
