const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const RoadmapPhase = require('../models/RoadmapPhase');
const Topic = require('../models/Topic');
const DailyTask = require('../models/DailyTask');
const Milestone = require('../models/Milestone');
const Resource = require('../models/Resource');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/genai_roadmap';

const phasesData = [
  {
    phaseNumber: 1,
    title: 'Foundation & Core CS',
    description: 'Master essential computer science concepts, operating systems, networking, APIs, Linux CLI, databases, and Data Structures & Algorithms.',
    startDay: 1,
    endDay: 20,
    duration: 20,
    studyHours: 100,
    theme: 'blue',
    icon: 'Terminal',
    order: 1,
    topics: [
      'Computer Basics',
      'Operating Systems',
      'Networking',
      'HTTP/HTTPS',
      'APIs',
      'Git/GitHub',
      'Linux/CLI',
      'DSA',
      'OOP',
      'SQL',
      'Databases'
    ]
  },
  {
    phaseNumber: 2,
    title: 'Python Advanced',
    description: 'Deep dive into Python programming, object-oriented concepts, async programming, and data manipulation with NumPy & Pandas.',
    startDay: 21,
    endDay: 45,
    duration: 25,
    studyHours: 150,
    theme: 'green',
    icon: 'Code',
    order: 2,
    topics: [
      'Core Python',
      'OOP',
      'File Handling',
      'Decorators',
      'Async Programming',
      'NumPy',
      'Pandas',
      'Matplotlib',
      'Seaborn',
      'Pydantic'
    ]
  },
  {
    phaseNumber: 3,
    title: 'Mathematics for AI',
    description: 'Essential mathematical foundations including Linear Algebra, Calculus, Probability, and Statistical Inference required for AI.',
    startDay: 46,
    endDay: 60,
    duration: 15,
    studyHours: 90,
    theme: 'purple',
    icon: 'Calculator',
    order: 3,
    topics: [
      'Linear Algebra',
      'Calculus',
      'Probability',
      'Statistics'
    ]
  },
  {
    phaseNumber: 4,
    title: 'Machine Learning',
    description: 'Supervised and Unsupervised Learning algorithms, model evaluation, feature engineering, Scikit-Learn, and ML experiment tracking.',
    startDay: 61,
    endDay: 90,
    duration: 30,
    studyHours: 180,
    theme: 'orange',
    icon: 'Cpu',
    order: 4,
    topics: [
      'Supervised Learning',
      'Unsupervised Learning',
      'ML Algorithms',
      'Model Evaluation',
      'Feature Engineering',
      'Scikit-learn',
      'MLflow'
    ]
  },
  {
    phaseNumber: 5,
    title: 'Deep Learning',
    description: 'Neural networks architecture, Backpropagation, CNNs, RNNs, LSTMs, Attention mechanisms, and frameworks like PyTorch & TensorFlow.',
    startDay: 91,
    endDay: 120,
    duration: 30,
    studyHours: 180,
    theme: 'pink',
    icon: 'Network',
    order: 5,
    topics: [
      'Neural Networks',
      'CNN',
      'RNN',
      'LSTM',
      'Transformers',
      'PyTorch',
      'TensorFlow'
    ]
  },
  {
    phaseNumber: 6,
    title: 'Computer Vision & NLP',
    description: 'Image processing with OpenCV & YOLO, OCR, Natural Language Processing fundamentals, Tokenization, TF-IDF, and Word Embeddings.',
    startDay: 121,
    endDay: 150,
    duration: 30,
    studyHours: 180,
    theme: 'cyan',
    icon: 'Eye',
    order: 6,
    topics: [
      'OpenCV',
      'YOLO',
      'Image Processing',
      'OCR',
      'NLP Basics',
      'Text Preprocessing',
      'TF-IDF',
      'Word Embeddings'
    ]
  },
  {
    phaseNumber: 7,
    title: 'Transformers & LLMs',
    description: 'Transformer architectures, Self-Attention, GPT, Llama, Tokenizers, Context Windows, and API integrations with OpenAI, Gemini, & Claude.',
    startDay: 151,
    endDay: 180,
    duration: 30,
    studyHours: 180,
    theme: 'indigo',
    icon: 'Sparkles',
    order: 7,
    topics: [
      'Attention',
      'GPT',
      'Llama',
      'Tokenizers',
      'Context Window',
      'OpenAI APIs',
      'Gemini APIs',
      'Claude APIs',
      'LLM APIs'
    ]
  },
  {
    phaseNumber: 8,
    title: 'RAG & Vector Databases',
    description: 'Retrieval Augmented Generation (RAG), Vector Embeddings, FAISS, Chroma, Pinecone, LangChain, and LlamaIndex orchestration.',
    startDay: 181,
    endDay: 200,
    duration: 20,
    studyHours: 120,
    theme: 'blue',
    icon: 'Database',
    order: 8,
    topics: [
      'Embeddings',
      'Vector Databases',
      'FAISS',
      'Chroma',
      'Pinecone',
      'RAG Pipeline',
      'LangChain',
      'LlamaIndex'
    ]
  },
  {
    phaseNumber: 9,
    title: 'AI Agents & MCP',
    description: 'Autonomous AI Agents architecture, Tool Calling, LangGraph, Model Context Protocol (MCP), Multi-Agent collaboration, & Tool integration.',
    startDay: 201,
    endDay: 220,
    duration: 20,
    studyHours: 120,
    theme: 'green',
    icon: 'Bot',
    order: 9,
    topics: [
      'Agent Architecture',
      'Tool Calling',
      'LangGraph',
      'MCP',
      'Multi-Agent Systems',
      'Web Tools',
      'Database Tools'
    ]
  },
  {
    phaseNumber: 10,
    title: 'Voice AI & Multimodal + Projects',
    description: 'Speech recognition, Text-to-Speech synthesis, LiveKit WebRTC, Voice Agents, Vision/Video/Audio multimodal models, and building 3-4 flagship projects.',
    startDay: 221,
    endDay: 299,
    duration: 79,
    studyHours: 474,
    theme: 'purple',
    icon: 'Mic',
    order: 10,
    topics: [
      'Speech-to-Text',
      'Text-to-Speech',
      'LiveKit',
      'WebRTC',
      'Voice Agents',
      'Image Understanding',
      'Video Understanding',
      'Audio Understanding',
      'Multimodal AI',
      'Production AI Applications',
      '3-4 Real Projects'
    ]
  }
];

const milestonesData = [
  { title: 'Python & DSA Strong', description: 'Mastered Core CS, Data Structures, Algorithms, and Advanced Python concepts.', phaseNumber: 2, condition: 'PHASE_2_COMPLETE', order: 1 },
  { title: 'ML & Deep Learning Done', description: 'Built and evaluated classical ML models and deep neural networks in PyTorch.', phaseNumber: 5, condition: 'PHASE_5_COMPLETE', order: 2 },
  { title: 'LLM + RAG Project Built', description: 'Successfully implemented end-to-end RAG application with vector database integration.', phaseNumber: 8, condition: 'PHASE_8_COMPLETE', order: 3 },
  { title: 'AI Agent Working', description: 'Engineered autonomous AI Agent utilizing tool calling and Model Context Protocol (MCP).', phaseNumber: 9, condition: 'PHASE_9_COMPLETE', order: 4 },
  { title: 'Voice AI + Multimodal Project', description: 'Created real-time Voice AI assistant with multimodal understanding capabilities.', phaseNumber: 10, condition: 'PHASE_10_COMPLETE', order: 5 },
  { title: 'Portfolio Ready', description: 'Deployed 4 production-grade AI projects with live demos and active GitHub repos.', phaseNumber: 10, condition: 'PORTFOLIO_READY', order: 6 },
  { title: 'Start Applying', description: 'Resume finalized, target roles specified, ready for AI/ML Engineer interviews!', phaseNumber: 10, condition: 'START_APPLYING', order: 7 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Seed: Connected to MongoDB...');

    // 1. Upsert Single Owner Account safely from env
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@genai.com';
    const ownerPassword = process.env.OWNER_PASSWORD || 'OwnerSecurePassword2026!';

    let owner = await User.findOne({ role: 'OWNER' });
    if (!owner) {
      owner = await User.create({
        name: 'Roadmap Owner',
        email: ownerEmail,
        password: ownerPassword,
        role: 'OWNER',
        college: '3rd B.Sc Computer Science',
        degree: 'Bachelor of Science in Computer Science',
        year: '3rd Year',
        graduationYear: '2026-2027',
        targetRole: 'AI Engineer',
        studyHoursPerDay: 5,
        studyDaysPerWeek: 5,
        targetDate: new Date(Date.now() + 299 * 24 * 60 * 60 * 1000)
      });
      console.log(`Seed: Created single OWNER account (${ownerEmail})`);
    } else {
      owner.email = ownerEmail;
      owner.password = ownerPassword;
      await owner.save();
      console.log(`Seed: Updated OWNER credentials safely (${ownerEmail})`);
    }

    // 2. Safe Upsert for Roadmap Phases & Daily Tasks
    for (const phaseItem of phasesData) {
      const createdPhase = await RoadmapPhase.findOneAndUpdate(
        { phaseNumber: phaseItem.phaseNumber },
        phaseItem,
        { upsert: true, new: true, runValidators: true }
      );

      // Create/Upsert Topics for Phase
      for (let i = 0; i < phaseItem.topics.length; i++) {
        const topicName = phaseItem.topics[i];
        await Topic.findOneAndUpdate(
          { phaseId: createdPhase._id, name: topicName },
          {
            phaseId: createdPhase._id,
            phaseNumber: createdPhase.phaseNumber,
            name: topicName,
            description: `Mastering ${topicName} concepts, hands-on tutorials, and practical implementation.`,
            subtopics: [`Introduction to ${topicName}`, `Core Principles`, `Best Practices & Debugging`, `Hands-on Project`],
            estimatedHours: Math.round(createdPhase.studyHours / phaseItem.topics.length),
            difficulty: i % 3 === 0 ? 'Beginner' : i % 3 === 1 ? 'Intermediate' : 'Advanced',
            order: i + 1
          },
          { upsert: true }
        );
      }

      // Generate/Upsert 299 Days
      for (let dayNum = phaseItem.startDay; dayNum <= phaseItem.endDay; dayNum++) {
        const topicIndex = (dayNum - phaseItem.startDay) % phaseItem.topics.length;
        const topicName = phaseItem.topics[topicIndex];

        await DailyTask.findOneAndUpdate(
          { dayNumber: dayNum },
          {
            dayNumber: dayNum,
            phaseId: createdPhase._id,
            phaseNumber: createdPhase.phaseNumber,
            topicName: topicName,
            title: `Day ${dayNum}: ${topicName} Fundamentals & Practice`,
            description: `Detailed study plan for Day ${dayNum} focusing on ${topicName}.`,
            tasksList: [
              `Understand core theory behind ${topicName}`,
              `Review key documentation and code examples`,
              `Write sample code & test implementations`,
              `Solve 2-3 practical exercises`
            ],
            estimatedHours: Math.round(createdPhase.studyHours / createdPhase.duration),
            practiceTask: `Build a mini demo / project script for ${topicName}.`,
            revisionTask: `Spend 20 minutes reviewing notes and concepts learned today.`,
            order: dayNum
          },
          { upsert: true }
        );
      }
    }

    console.log('Seed: Upserted 10 Phases & 299 Daily Tasks cleanly!');

    // 3. Upsert Milestones
    for (const m of milestonesData) {
      await Milestone.findOneAndUpdate({ title: m.title }, m, { upsert: true });
    }

    // 4. Default Resources
    const sampleResources = [
      { title: 'Linux Command Line Basics', url: 'https://beej.us/guide/bgnet/', type: 'Documentation', phaseNumber: 1, topicName: 'Linux/CLI', description: 'Essential Linux & CLI reference guide.' },
      { title: 'Python Official Documentation', url: 'https://docs.python.org/3/', type: 'Documentation', phaseNumber: 2, topicName: 'Core Python', description: 'Official Python 3 reference manual.' },
      { title: '3Blue1Brown Linear Algebra Series', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'Video', phaseNumber: 3, topicName: 'Linear Algebra', description: 'Visual intuition behind vectors, matrices, and transformations.' },
      { title: 'Scikit-Learn Machine Learning Guide', url: 'https://scikit-learn.org/stable/', type: 'Documentation', phaseNumber: 4, topicName: 'Scikit-learn', description: 'Comprehensive guide to algorithms in Scikit-Learn.' },
      { title: 'PyTorch Deep Learning Course', url: 'https://pytorch.org/tutorials/', type: 'Course', phaseNumber: 5, topicName: 'PyTorch', description: 'Official PyTorch tutorials and neural network building.' },
      { title: 'OpenCV Computer Vision Bootcamp', url: 'https://docs.opencv.org/', type: 'Documentation', phaseNumber: 6, topicName: 'OpenCV', description: 'Computer vision algorithms & real-time image processing.' },
      { title: 'Hugging Face Transformers Guide', url: 'https://huggingface.co/docs/transformers', type: 'Documentation', phaseNumber: 7, topicName: 'Transformers', description: 'State-of-the-art Natural Language Processing and LLM pipelines.' },
      { title: 'LangChain & Vector DB RAG Tutorial', url: 'https://python.langchain.com/', type: 'Documentation', phaseNumber: 8, topicName: 'LangChain', description: 'Building context-aware LLM apps with Chroma & Pinecone.' },
      { title: 'LangGraph & Model Context Protocol (MCP)', url: 'https://github.com/modelcontextprotocol', type: 'GitHub', phaseNumber: 9, topicName: 'MCP', description: 'Standard protocol for connecting AI models to data and tools.' },
      { title: 'LiveKit Voice AI SDK Documentation', url: 'https://docs.livekit.io/', type: 'Documentation', phaseNumber: 10, topicName: 'LiveKit', description: 'Real-time WebRTC audio & voice AI pipeline infrastructure.' }
    ];

    for (const r of sampleResources) {
      await Resource.findOneAndUpdate({ title: r.title }, r, { upsert: true });
    }

    console.log('Seed: COMPLETED SAFELY WITHOUT DATA LOSS! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDB();
