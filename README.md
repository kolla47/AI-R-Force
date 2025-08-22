# 🚀 SmartKB: AI-Powered Knowledge Automation for Airline Support

**Team**: AI-R Force | **Hackathon 2025**

> **Automating knowledge, empowering agents.**  
> SmartKB uses AI to auto-generate knowledge base articles from resolved cases and delivers real-time resolution guidance to airline support agents — reducing resolution time by up to 40%.

---

## 🎯 Problem

Airline customer service teams face a critical challenge:

- Agents take **hours** to manually searching through outdated or unstructured knowledge bases.
- Recurring issues are resolved inconsistently due to lack of standardized solutions.
- High agent turnover and training costs compound the problem.

**Result**: Slow responses, frustrated customers, and burned-out agents.

---

## 💡 Solution: SmartKB

**SmartKB** is an end-to-end AI system that **automatically creates, maintains, and surfaces actionable knowledge** in real time. It transforms historical support data into living, intelligent knowledge — so agents can resolve issues faster and more consistently.

### ✅ Key Features

- 🔍 **Auto-Generated Knowledge Base**: Turns clusters of resolved cases into structured KB articles.
- ⚡ **Real-Time KB Suggestions**: Surfaces the most relevant help content when a new case arrives.
- 🤖 **AI-Powered Resolution Guide**: Generates step-by-step instructions tailored to the current issue.
- 🔐 **Enterprise Ready**: Includes SME approval workflows and PII redaction.
- 🔐 **Multilingual**: Supports multiple languages.
- 🔐 **consistent and intelligent Response**: Includes SME approval workflows and PII redaction.

---

## ⚙️ How It Works

### 1. **Auto-KB Generator** (Knowledge Creation)

Automatically builds and updates the knowledge base:

1. **Clustering**: Embeds historical resolved cases using GPT and groups them by similarity.
2. **Benchmarking**: Filters clusters by frequency and validity to identify high-impact patterns.
3. **Generation**: Uses GPT to draft structured KB articles (title, symptoms, steps, etc.).
4. **Approval**: Articles are sent to SMEs for review before publication.

### 2. **AI Agent Assistant** (Real-Time Support)

Helps agents resolve new cases instantly:

1. **Hybrid Search**: New queries trigger semantic + keyword search in **Azure AI Search**.
2. **Top Matches**: Top 3 relevant KBs are retrieved.
3. **Smart Guidance**: GPT combines the best KB + case details to generate a personalized resolution plan.
4. **Agent Action**: Agent follows clear, contextual steps — no more guesswork.

---

## 🛠️ Tech Stack

| Component         | Technology                                             |
| ----------------- | ------------------------------------------------------ |
| **AI Models**     | Azure OpenAI (`gpt-4o-mini`, `text-embedding-3-small`) |
| **Vector Search** | Azure AI Search (Hybrid: Semantic + Keyword)           |
| **Frontend**      | React, Material UI (MUI), Framer Motion                |
| **Cloud**         | Microsoft Azure                                        |

---

## 📈 Impact & Benefits

| Benefit                  | Outcome                              |
| ------------------------ | ------------------------------------ |
| ⏱️ **KB Creation Time**  | Reduced from **hours → seconds**     |
| 📉 **Resolution Time**   | Cut by **up to 40%**                 |
| 🧠 **Agent Consistency** | High-quality, standardized responses |
| 🔁 **Scalability**       | Automatically adapts to new issues   |
| 👥 **Agent Experience**  | Less burnout, faster onboarding      |

> **SmartKB turns raw knowledge into institutional intelligence.**

---

## 🧪 Future Enhancements

- Integrate with live CRM systems (e.g., MS Dynamics)
- Predictive case routing based on KB relevance
- Feedback loop: use agent interactions to improve KBs

---

## 🤝 Team: AI-R Force

- Akhil Kolla
- Shipra Singh
- Rajvinder Kaur
- Venkata Ramayya
- Treutelaar, Max
- Kishore N

---

## 🏁 Built With ❤️ at Hackathon 2025

Let’s revolutionize customer support — one smart KB at a time.
