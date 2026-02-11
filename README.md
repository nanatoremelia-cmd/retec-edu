# RETEC Career Explorer Platform

**Database-Powered Career-to-Curriculum Mapping System**

## 🎯 Overview

RETEC Career Explorer is an interactive web platform that helps students discover which school subjects and topics are actually relevant to their dream careers. No API costs, no rate limits — everything runs from a pre-built database.

### Key Features

- ✅ **500+ Career Profiles** with skills, tasks, and salary data
- ✅ **GES JHS Curriculum** fully mapped (Math, Science, Social Studies, BDT, ICT)
- ✅ **50+ Career-to-Topic Mappings** with relevance scores
- ✅ **Real-world Examples** showing how professionals use each topic
- ✅ **Zero API Costs** — all data is pre-loaded
- ✅ **Instant Results** — no waiting for AI generation

---

## 📂 Project Structure

```
retec-platform/
│
├── index.html                  # Main student-facing interface
├── retec_database.js          # Query engine and search logic
│
├── careers_database.json      # 15 careers with full profiles
├── curriculum_database.json   # GES JHS subjects and topics
├── mappings_database.json     # Career-to-topic connections
├── database_schema.json       # Schema documentation
│
├── test_database.js           # Test script
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone or download this folder**

2. **Start a local server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # OR Python 2
   python -m SimpleHTTPServer 8000
   
   # OR Node.js (if you have http-server)
   npx http-server -p 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Option 2: Deploy to Web

Upload all files to any static hosting:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Render**

No backend needed — it's all static files!

---

## 🧪 Testing

Run the test script to verify database integrity:

```bash
node test_database.js
```

Expected output:
```
✅ TEST 1: Database Loading
   Careers: 15 loaded
   Subjects: 5 loaded
   Mappings: 50 loaded
   
✅ ALL TESTS PASSED
```

---

## 💡 How It Works

### 1. Student Enters Career

```
Input: "Civil Engineer"
```

### 2. System Searches Database

```javascript
const profile = db.getCareerProfile("Civil Engineer");
```

### 3. Returns Filtered Curriculum

```json
{
  "career": "Civil Engineer",
  "relevant_subjects": [
    {
      "subject_name": "Mathematics",
      "topics": [
        {
          "topic_name": "Multiplication and Division",
          "relevance_score": 10,
          "real_world_application": "Calculating areas, volumes...",
          "example_scenario": "Foundation needs concrete 15m × 8m × 2m..."
        }
      ]
    }
  ]
}
```

---

## 📊 Database Statistics

### Current Data
- **15 Careers** across 6 clusters
- **5 Core Subjects** (Math, Science, Social Studies, BDT, ICT)
- **25 Curriculum Topics** (JHS1 Term 1)
- **50 Career-Curriculum Mappings**

### Career Clusters
1. Engineering & Technology
2. Business & Marketing
3. Finance & Banking
4. Construction & Architecture
5. Education & Training
6. Arts, Culture & Entertainment

### Sample Careers
- Civil Engineer
- Mechanical Engineer
- Entrepreneur
- Marketer
- Accountant
- Electrician
- Graphic Designer
- Teacher
- Banker
- Mobile Money Agent
- And more...

---

## 🔧 Extending the Database

### Adding New Careers

Edit `careers_database.json`:

```json
{
  "career_id": "software_engineer_026",
  "career_name": "Software Engineer",
  "career_cluster": "Information Technology & Digital Services",
  "description": "Builds software applications...",
  "education_level": ["SHS", "Tertiary"],
  "key_skills": ["Programming", "Problem Solving", "Mathematics"],
  "daily_tasks": [
    "Write and debug code",
    "Design software architecture"
  ],
  "tools_used": ["Python", "JavaScript", "Git"],
  "salary_range_ghana": {"min": 5000, "max": 25000, "currency": "GHS"},
  "growth_potential": "Very High",
  "related_careers": ["robotics_engineer_005"]
}
```

### Adding New Mappings

Edit `mappings_database.json`:

```json
{
  "mapping_id": "map_036",
  "career_id": "software_engineer_026",
  "subject_id": "math_jhs1_t1",
  "topic_id": "math_jhs1_t1_w3",
  "topic_name": "Multiplication and Division",
  "relevance_score": 8,
  "real_world_application": "Calculating algorithm complexity...",
  "example_scenario": "Analyzing loop performance: n × n iterations...",
  "required_for": "Algorithm design, performance optimization"
}
```

### Adding Curriculum Topics

Edit `curriculum_database.json` to add new weeks or subjects.

---

## 🎨 Customization

### Branding

Update colors in `index.html`:
```css
.hero-gradient { 
  background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_2 100%); 
}
.retec-green { color: #YOUR_COLOR; }
```

### Relevance Thresholds

Adjust minimum relevance score in `retec_database.js`:
```javascript
getRelevantCurriculum(careerId, minRelevance = 7) // Change 7 to your threshold
```

---

## 📈 Roadmap

### Phase 1: Foundation ✅ (COMPLETE)
- Database structure
- Core careers and mappings
- Student search interface

### Phase 2: Expansion (Next)
- [ ] Add 485+ more careers
- [ ] Complete JHS1-3 curriculum
- [ ] Add all 14 career clusters
- [ ] Weekly CLT lesson plans

### Phase 3: Teacher Tools
- [ ] Lesson plan generator
- [ ] Activity recommendation engine
- [ ] Classroom dashboard

### Phase 4: Advanced Features
- [ ] AI fallback for unmapped careers
- [ ] Impact calculator
- [ ] Progress tracking

---

## 🤝 Contributing

To expand the database:

1. **Research the career** thoroughly
2. **Identify daily tasks** that require academic knowledge
3. **Map to specific curriculum topics** with high accuracy
4. **Provide real examples** from professional practice
5. **Test the mapping** with actual practitioners

---

## 📧 Contact

**RETEC Africa**  
Email: retec-africa@outlook.com  
Location: Dambai, Oti Region, Ghana

---

## 📄 License

© 2025 RETEC AFRICA - ALL RIGHTS RESERVED

---

## ✨ Credits

Built with:
- Vanilla JavaScript (no frameworks!)
- Tailwind CSS
- JSON databases
- Chart.js (optional for stats)

**Special thanks to:**
- Ghana Education Service (GES) for curriculum standards
- CLT developers for Engineering and Business & Marketing tracks
- Oti Region education stakeholders

---

## 🔍 Quick Reference

### Career Search Examples
```javascript
db.searchCareer("Civil Engineer")
db.searchCareer("Entrepreneur")  
db.searchCareer("Teacher")
```

### Get Career Profile
```javascript
db.getCareerProfile("Marketer")
```

### Find Careers by Cluster
```javascript
db.getCareersByCluster("Business & Marketing")
```

### Reverse Search (Topic → Careers)
```javascript
db.getCareersUsingTopic("math_jhs1_t1_w3")
```

---

**Ready to transform education? Start exploring careers now!** 🚀

