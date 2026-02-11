# RETEC Platform Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    RETEC CAREER EXPLORER                    │
│                  (Database-Powered Platform)                │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │
│   STUDENT UI     │─────▶│  QUERY ENGINE    │─────▶│   JSON DATABASE  │
│  (index.html)    │      │ (retec_db.js)    │      │   (3 files)      │
│                  │◀─────│                  │◀─────│                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         │
         │ User enters
         │ "Civil Engineer"
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      SEARCH PROCESS                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Input: "Civil Engineer"                                  │
│                                                              │
│ 2. Query Engine searches careers_database.json              │
│    → Finds career_id: "civil_engineer_001"                  │
│                                                              │
│ 3. Query mappings_database.json for career_id               │
│    → Gets 4 topic mappings with relevance scores            │
│                                                              │
│ 4. Query curriculum_database.json for topic details         │
│    → Gets learning objectives, week numbers, etc.           │
│                                                              │
│ 5. Compile & return formatted results                       │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      RESULTS DISPLAYED                      │
├─────────────────────────────────────────────────────────────┤
│ ✅ Career Overview                                          │
│    - Name, description, salary                              │
│    - Career cluster, growth potential                       │
│                                                              │
│ ✅ Relevant Subjects (grouped)                              │
│    - Mathematics (3 topics)                                 │
│    - Science (2 topics)                                     │
│                                                              │
│ ✅ Each Topic Shows:                                        │
│    - Relevance score (1-10)                                 │
│    - Real-world application                                 │
│    - Example scenario                                       │
│    - What it's required for                                 │
│                                                              │
│ ✅ Related Careers                                          │
│    - Architect, Mechanical Engineer, etc.                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Structure

```
DATABASE LAYER
├── careers_database.json (16 KB)
│   ├── 15 career profiles
│   ├── Each with: name, description, skills, tasks
│   ├── Salary ranges, growth potential
│   └── Related career links
│
├── curriculum_database.json (14 KB)
│   ├── 5 subjects (Math, Science, Social, BDT, ICT)
│   ├── 25 topics total (JHS1 Term 1)
│   ├── Learning objectives per topic
│   └── Week numbers, difficulty levels
│
└── mappings_database.json (26 KB)
    ├── 50 career-to-topic connections
    ├── Relevance scores (1-10)
    ├── Real-world applications
    └── Example scenarios
```

---

## 🔄 Data Flow

### Student Search Flow
```
Student Input
    ↓
"Civil Engineer"
    ↓
┌─────────────────┐
│  Search Career  │ → careers_database.json
└────────┬────────┘
         │ Found: civil_engineer_001
         ↓
┌─────────────────┐
│  Get Mappings   │ → mappings_database.json
└────────┬────────┘
         │ 4 topic mappings
         ↓
┌─────────────────┐
│  Get Topics     │ → curriculum_database.json
└────────┬────────┘
         │ Full topic details
         ↓
┌─────────────────┐
│  Format Results │
└────────┬────────┘
         │
         ↓
    Display to Student
```

### Reverse Search Flow (Topic → Careers)
```
Teacher Input
    ↓
"Multiplication & Division"
    ↓
┌─────────────────┐
│  Find Topic ID  │ → curriculum_database.json
└────────┬────────┘
         │ topic_id: math_jhs1_t1_w3
         ↓
┌─────────────────┐
│  Get Mappings   │ → mappings_database.json
└────────┬────────┘
         │ 8 careers use this topic
         ↓
┌─────────────────┐
│  Get Careers    │ → careers_database.json
└────────┬────────┘
         │
         ↓
Show: Engineer, Entrepreneur,
Accountant, etc. all use it
```

---

## 🎯 Key Features

### 1. Zero API Costs
```
Traditional Approach:           RETEC Approach:
User → API → AI → Response      User → JSON → Response
Cost: $0.002/request           Cost: $0.00 (free!)
Speed: 2-5 seconds             Speed: < 100ms
Limit: 100/min                 Limit: Unlimited
```

### 2. Instant Results
- No waiting for AI generation
- Pure JavaScript queries
- Cached in browser memory

### 3. Offline Capable
- All data in JSON files
- Works without internet (after initial load)
- Perfect for low-connectivity areas

---

## 🔧 Technical Stack

```
Frontend:
├── HTML5 (semantic markup)
├── Tailwind CSS (utility-first styling)
└── Vanilla JavaScript (no frameworks!)

Database:
├── JSON files (human-readable)
├── No SQL server needed
└── Version control friendly

Hosting:
├── Static files only
├── Any CDN/hosting works
└── GitHub Pages compatible
```

---

## 📈 Scalability

### Current State
- 15 careers
- 25 topics
- 50 mappings
- File size: ~57 KB total

### After Full Expansion (500 careers)
- 500 careers
- 120 topics (JHS1-3)
- 2,000+ mappings
- Estimated size: ~2 MB total
- Still loads instantly!

---

## 🚀 Performance Optimization

```javascript
// All data loaded once on page load
db.initialize() → Loads all 3 JSON files

// Subsequent searches are instant
db.searchCareer("Engineer")      // < 1ms
db.getRelevantCurriculum(...)    // < 5ms
db.getCareerProfile(...)         // < 10ms

// Total query time: < 20ms ✨
```

---

## 🔒 Security

### What's Safe
✅ All data is public (no sensitive info)
✅ No user data collected
✅ No authentication needed
✅ No server-side processing

### What to Watch
⚠️ If you add user accounts, implement proper auth
⚠️ If you add submissions, validate on backend
⚠️ If you add AI fallback, secure API keys

---

## 🎨 Customization Points

```
index.html
├── Lines 15-25: Colors & branding
├── Lines 35-50: Navigation & logo
└── Lines 200-250: Search interface

retec_database.js
├── Line 43: Minimum relevance threshold
├── Line 105: Search algorithm
└── Line 180: Results formatting

*.json files
├── Add new careers
├── Add new topics
└── Create new mappings
```

---

## 🔮 Future Architecture

```
┌─────────────────────────────────────────────┐
│         RETEC PLATFORM (Future)             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Student  │  │ Teacher  │  │  Admin   │ │
│  │ Portal   │  │ Portal   │  │  Portal  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │              │        │
│       └─────────────┼──────────────┘        │
│                     │                       │
│           ┌─────────▼────────┐              │
│           │   CORE DATABASE  │              │
│           │  (JSON + Cache)  │              │
│           └─────────┬────────┘              │
│                     │                       │
│       ┌─────────────┼──────────────┐        │
│       │             │              │        │
│  ┌────▼─────┐  ┌───▼─────┐  ┌────▼─────┐  │
│  │ CLT      │  │ AI      │  │ Impact   │  │
│  │ Lessons  │  │ Fallback│  │ Tracker  │  │
│  └──────────┘  └─────────┘  └──────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📝 Development Workflow

```
1. Research Career
   ↓
2. Add to careers_database.json
   ↓
3. Identify relevant topics
   ↓
4. Create mappings in mappings_database.json
   ↓
5. Test with test_database.js
   ↓
6. Verify in browser
   ↓
7. Deploy!
```

---

**This architecture ensures:**
- ✅ Fast performance
- ✅ Zero API costs
- ✅ Easy maintenance
- ✅ Scalable to 500+ careers
- ✅ Works offline
- ✅ Simple deployment

---

Built with 💚 by RETEC Africa
