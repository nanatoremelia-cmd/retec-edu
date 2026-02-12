// RETEC Platform - Database Query Engine
// This handles all searches and filtering operations

class RETECDatabase {
    constructor() {
        this.careers = null;
        this.curriculum = null;
        this.mappings = null;
        this.loaded = false;
    }

    // Load all database files
    async initialize() {
        try {
            const [careersRes, curriculumRes, mappingsRes] = await Promise.all([
                fetch('careers_database.json'),
                fetch('curriculum_database.json'),
                fetch('mappings_database.json')
            ]);

            this.careers = await careersRes.json();
            this.curriculum = await curriculumRes.json();
            this.mappings = await mappingsRes.json();
            this.loaded = true;
            
            console.log('✅ RETEC Database loaded successfully');
            console.log(`📊 ${this.careers.total_careers} careers`);
            console.log(`📚 ${this.curriculum.total_subjects} subjects`);
            console.log(`🔗 ${this.mappings.total_mappings} career-curriculum mappings`);
            
            return true;
        } catch (error) {
            console.error('❌ Error loading database:', error);
            return false;
        }
    }

    // Main search: Find career by name or partial match
    searchCareer(searchTerm) {
        if (!this.loaded) throw new Error('Database not initialized');
        
        const term = searchTerm.toLowerCase().trim();
        
        // First try exact match
        let career = this.careers.careers.find(c => 
            c.career_name.toLowerCase() === term
        );
        
        // Then try partial match
        if (!career) {
            career = this.careers.careers.find(c => 
                c.career_name.toLowerCase().includes(term) ||
                c.description.toLowerCase().includes(term) ||
                c.key_skills.some(skill => skill.toLowerCase().includes(term))
            );
        }
        
        return career;
    }

    // Get all careers in a cluster
    getCareersByCluster(cluster) {
        if (!this.loaded) throw new Error('Database not initialized');
        
        return this.careers.careers.filter(c => c.career_cluster === cluster);
    }

    // Get relevant curriculum for a career
    getRelevantCurriculum(careerId, minRelevance = 7) {
        if (!this.loaded) throw new Error('Database not initialized');
        
        // Find all mappings for this career
        const careerMappings = this.mappings.mappings.filter(m => 
            m.career_id === careerId && m.relevance_score >= minRelevance
        );
        
        // Group by subject
        const subjectGroups = {};
        
        careerMappings.forEach(mapping => {
            const subjectId = mapping.subject_id;
            
            if (!subjectGroups[subjectId]) {
                // Find subject details
                const subject = this.curriculum.subjects.find(s => s.subject_id === subjectId);
                subjectGroups[subjectId] = {
                    subject_id: subjectId,
                    subject_name: subject ? subject.subject_name : 'Unknown',
                    topics: []
                };
            }
            
            // Find topic details
            const subject = this.curriculum.subjects.find(s => s.subject_id === subjectId);
            const topic = subject?.topics.find(t => t.topic_id === mapping.topic_id);
            
            subjectGroups[subjectId].topics.push({
                topic_id: mapping.topic_id,
                topic_name: mapping.topic_name,
                week_number: topic?.week_number,
                relevance_score: mapping.relevance_score,
                real_world_application: mapping.real_world_application,
                example_scenario: mapping.example_scenario,
                required_for: mapping.required_for,
                learning_objectives: topic?.learning_objectives || []
            });
        });
        
        // Sort topics by relevance within each subject
        Object.values(subjectGroups).forEach(subject => {
            subject.topics.sort((a, b) => b.relevance_score - a.relevance_score);
        });
        
        return Object.values(subjectGroups);
    }

    // Get comprehensive career profile with curriculum
    getCareerProfile(careerInput) {
        const career = this.searchCareer(careerInput);
        
        if (!career) {
            return {
                found: false,
                message: `Career "${careerInput}" not found in database. Try: Engineer, Teacher, Entrepreneur, Marketer, etc.`
            };
        }
        
        const relevantCurriculum = this.getRelevantCurriculum(career.career_id);
        const relatedCareers = career.related_careers.map(id => 
            this.careers.careers.find(c => c.career_id === id)
        ).filter(Boolean);
        
        return {
            found: true,
            career: career,
            relevant_subjects: relevantCurriculum,
            total_relevant_topics: relevantCurriculum.reduce((sum, subj) => sum + subj.topics.length, 0),
            related_careers: relatedCareers,
            cluster: career.career_cluster
        };
    }

    // Reverse search: Find careers that use a specific topic
    getCareersUsingTopic(topicId) {
        if (!this.loaded) throw new Error('Database not initialized');
        
        const topicMappings = this.mappings.mappings.filter(m => 
            m.topic_id === topicId
        );
        
        return topicMappings.map(mapping => {
            const career = this.careers.careers.find(c => c.career_id === mapping.career_id);
            return {
                career: career,
                relevance_score: mapping.relevance_score,
                application: mapping.real_world_application,
                example: mapping.example_scenario
            };
        }).sort((a, b) => b.relevance_score - a.relevance_score);
    }

    // Get all available career clusters
    getCareerClusters() {
        if (!this.loaded) throw new Error('Database not initialized');
        
        const clusters = [...new Set(this.careers.careers.map(c => c.career_cluster))];
        return clusters.map(cluster => ({
            name: cluster,
            career_count: this.careers.careers.filter(c => c.career_cluster === cluster).length
        }));
    }

    // Search careers by skill
    getCareersBySkill(skill) {
        if (!this.loaded) throw new Error('Database not initialized');
        
        const skillLower = skill.toLowerCase();
        return this.careers.careers.filter(c => 
            c.key_skills.some(s => s.toLowerCase().includes(skillLower))
        );
    }

    // Get learning pathway for a career (ordered by relevance)
    getLearningPathway(careerId) {
        const curriculum = this.getRelevantCurriculum(careerId);
        
        // Flatten and sort all topics by relevance
        const allTopics = [];
        curriculum.forEach(subject => {
            subject.topics.forEach(topic => {
                allTopics.push({
                    subject_name: subject.subject_name,
                    ...topic
                });
            });
        });
        
        // Sort by relevance score (highest first)
        allTopics.sort((a, b) => b.relevance_score - a.relevance_score);
        
        return allTopics;
    }

    // Suggest careers based on interests/skills
    suggestCareers(interests = [], preferredCluster = null) {
        let matches = this.careers.careers;
        
        if (preferredCluster) {
            matches = matches.filter(c => c.career_cluster === preferredCluster);
        }
        
        if (interests.length > 0) {
            matches = matches.map(career => {
                const matchScore = interests.filter(interest => 
                    career.career_name.toLowerCase().includes(interest.toLowerCase()) ||
                    career.description.toLowerCase().includes(interest.toLowerCase()) ||
                    career.key_skills.some(skill => skill.toLowerCase().includes(interest.toLowerCase()))
                ).length;
                
                return { career, matchScore };
            }).filter(m => m.matchScore > 0)
              .sort((a, b) => b.matchScore - a.matchScore)
              .map(m => m.career);
        }
        
        return matches.slice(0, 10);
    }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.RETECDatabase = RETECDatabase;
}

// For Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RETECDatabase;
}
