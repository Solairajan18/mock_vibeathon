# Hackathon Presentation Notes: Policy Assist AI

*Use this document to prepare your slides and talk track for the Byte Brains pitch.*

---

## 1. Solution Approach & Architecture

Our solution, **Policy Assist AI**, bridges the gap between complex insurance systems and user-friendly customer experiences. 

**The Architecture Breakdown:**
1. **Frontend (The Interface):** A highly responsive, glassmorphic Next.js Dashboard. It features a seamless "Role Switcher" allowing immediate toggling between the Client Portfolio and the Agent Admin Portal.
2. **Context Engine (RAG Pipeline):** We implemented an intelligent Retrieval-Augmented Generation (RAG) system. When a user asks a question, the backend retrieves their *live, specific* policy and claim data from the PostgreSQL database, alongside curated FAQs from the Knowledge Base.
3. **The LLM Brain:** We utilize OpenRouter to pipe this context directly into our chosen Large Language Model. The LLM generates concise, highly accurate answers grounded entirely in the user's actual data.
4. **Continuous Learning Loop:** The UI includes native feedback mechanisms (Thumbs up/down). This data flows directly back to the Admin Portal, empowering agents to review AI interactions and continuously improve the Knowledge Base over time.

---

## 2. Bill of Materials (Tech Stack)

We chose a cutting-edge, production-ready stack to ensure high performance and seamless deployment:

*   **Framework:** **Next.js 14** (App Router) for Server-Side Rendering and robust API routes.
*   **Language:** **TypeScript** for end-to-end type safety.
*   **Styling:** **TailwindCSS** to rapidly build a premium, responsive UI.
*   **Database:** **PostgreSQL** managed by Vercel Postgres for scalable, relational data storage.
*   **ORM:** **Prisma** for type-safe database querying and schema management.
*   **AI Integration:** **OpenRouter API** serving `liquid/lfm-2.5-1.2b-instruct:free` combined with a custom **RAG** (Retrieval-Augmented Generation) pipeline.
*   **Deployment:** **Vercel** Edge Network for zero-configuration, global CI/CD deployment.
