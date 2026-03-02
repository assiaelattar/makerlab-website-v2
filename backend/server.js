const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection (MySQL Hostinger)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'u368537880_make_go',       // Database Name (with underscores)
  process.env.DB_USER || 'u368537880_make_go_admin', // User Name (with underscores)
  process.env.DB_PASS || 'makerlab2025@Mm',          // Password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

// Test Connection & Sync
sequelize.authenticate()
  .then(() => console.log('✅ MySQL Database Connected'))
  .catch(err => console.error('❌ MySQL Connection Error:', err));

// 2. Data Models
const Program = sequelize.define('Program', {
  title: DataTypes.STRING,
  category: DataTypes.STRING,
  ageGroup: DataTypes.STRING,
  duration: DataTypes.STRING,
  price: DataTypes.STRING,
  description: DataTypes.TEXT,
  image: DataTypes.TEXT('long'), // Allow long strings for base64 images
  imagePrompt: DataTypes.TEXT,
  active: DataTypes.BOOLEAN,
  schedule: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});

// Sync Schema (Create tables if not exist)
sequelize.sync()
  .then(() => console.log('✅ Database Synced'))
  .catch(err => console.error('❌ Sync Error:', err));


// 3. Gemini AI Configuration
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 4. Routes

// GET All Programs
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE Program
app.post('/api/programs', async (req, res) => {
  try {
    const programData = req.body;
    // Ensure JSON fields are handled correctly if sent as strings
    const newProgram = await Program.create(programData);
    res.json(newProgram);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Program
app.put('/api/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: 'Program not found' });
    
    await program.update(req.body);
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Program
app.delete('/api/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: 'Program not found' });
    
    await program.destroy();
    res.json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Generate Image Proxy
app.post('/api/ai/generate-image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const styleGuide = " . Art Style: Neo-brutalist pop-art poster style. Vibrant yellow background with comic-book halftone dot pattern. 3D geometric shapes in purple and cyan. High energy, vector illustration, bold black outlines, flat shading, fun and educational tech vibe. Moroccan touch implies subtle geometric patterns if applicable.";
    
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: {
          parts: [{ text: prompt + styleGuide }]
        }
    });
    
    // Extract base64
    let imageUrl = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
    }

    if (imageUrl) {
        res.json({ imageUrl });
    } else {
        res.status(500).json({ error: 'Failed to generate image' });
    }

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'AI Generation Failed' });
  }
});

// AI Recommendation Proxy
app.post('/api/ai/recommend', async (req, res) => {
    const { age, interests } = req.body;
    try {
        const prompt = `
            Tu es un conseiller pédagogique énergique pour 'Make & Go'. 
            Enfant: ${age} ans, Intérêts: ${interests}.
            Recommande UN seul atelier parmi: Drones, 3D, Design, Jeux Vidéo, Apps, IA, Business.
            Réponse courte, fun, emoji, en Français.
        `;
        
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        res.json({ text: response.text });
    } catch (error) {
        res.status(500).json({ error: 'AI Recommendation Failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));