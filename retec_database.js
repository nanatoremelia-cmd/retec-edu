// RETEC Database Loader - Updated to load BOTH mapping databases
// This file loads career_database, curriculum_database, mappings_database, AND expanded_mappings_database

class RETECDatabase {
    constructor() {
        this.careers = [];
        this.curriculum = [];
        this.mappings = []; // Will contain COMBINED mappings from both files
    }

    async initialize() {
        try {
            console.log('📚 RETEC Database: Starting to load...');
            
            // Load Careers Database
            console.log('⏳ Loading careers...');
            const careersResponse = await fetch('career_database.js');
            if (!careersResponse.ok) {
                throw new Error(`Failed to load careers: ${careersResponse.status}`);
            }
            const careersData = await careersResponse.json();
            this.careers = careersData.careers;
            console.log(`✅ Loaded ${this.careers.length} careers`);

            // Load Curriculum Database
            console.log('⏳ Loading curriculum...');
            const curriculumResponse = await fetch('curriculum_database.js');
            if (!curriculumResponse.ok) {
                throw new Error(`Failed to load curriculum: ${curriculumResponse.status}`);
            }
            const curriculumData = await curriculumResponse.json();
            this.curriculum = curriculumData.subjects;
            console.log(`✅ Loaded ${this.curriculum.length} subjects`);

            // Load ORIGINAL Mappings Database
            console.log('⏳ Loading original mappings...');
            const mappingsResponse = await fetch('mappings_database.js');
            if (!mappingsResponse.ok) {
                throw new Error(`Failed to load mappings: ${mappingsResponse.status}`);
            }
            const mappingsData = await mappingsResponse.json();
            let originalMappings = mappingsData.mappings;
            console.log(`✅ Loaded ${originalMappings.length} original mappings`);

            // Load EXPANDED Mappings Database (NEW!)
            console.log('⏳ Loading expanded mappings...');
            let expandedMappings = [];
            try {
                const expandedResponse = await fetch('expanded_mappings_database.json');
                if (expandedResponse.ok) {
                    const expandedData = await expandedResponse.json();
                    expandedMappings = expandedData.mappings;
                    console.log(`✅ Loaded ${expandedMappings.length} expanded mappings`);
                } else {
                    console.warn('⚠️ expanded_mappings_database.json not found, using original mappings only');
                }
            } catch (expandedError) {
                console.warn('⚠️ Could not load expanded mappings:', expandedError.message);
                console.log('   Using original mappings only');
            }

            // COMBINE both mapping arrays
            this.mappings = [...originalMappings, ...expandedMappings];
            console.log(`🎉 TOTAL MAPPINGS AVAILABLE: ${this.mappings.length}`);
            console.log(`   - Original: ${originalMappings.length}`);
            console.log(`   - Expanded: ${expandedMappings.length}`);
            console.log('✅ RETEC Database: Ready!');

            return true;
        } catch (error) {
            console.error('❌ RETEC Database: Error loading database:', error);
            alert('Error loading database. Please check console for details.');
            return false;
        }
    }

    getCareerProfile(careerSearch) {
        const searchLower = careerSearch.toLowerCase().trim();
        
        // Find matching career
        const career = this.careers.find(c => 
            c.career_name.toLowerCase().includes(searchLower) ||
            c.career_id.toLowerCase().includes(searchLower) ||
            c.career_cluster.toLowerCase().includes(searchLower)
        );

        if (!career) {
            // Suggest similar careers
            const suggestions = this.careers
                .filter(c => c.career_name.toLowerCase().includes(searchLower.split(' ')[0]))
                .slice(0, 3)
                .map(c => c.career_name)
                .join(', ');

            return {
                found: false,
                message: suggestions 
                    ? `Career "${careerSearch}" not found. Did you mean: ${suggestions}?`
                    : `Career "${careerSearch}" not found. Try: Teacher, Nurse, Entrepreneur, Civil Engineer, Software Developer, Accountant, etc.`
            };
        }

        // Get ALL mappings for this career (from COMBINED array)
        const careerMappings = this.mappings.filter(m => m.career_id === career.career_id);
        
        if (careerMappings.length === 0) {
            return {
                found: true,
                career: career,
                relevant_subjects: [],
                total_relevant_topics: 0,
                related_careers: [],
                message: 'No curriculum mappings found for this career yet.'
            };
        }

        // Group mappings by subject
        const subjectGroups = {};
        careerMappings.forEach(mapping => {
            const subjectKey = mapping.subject_id;
            if (!subjectGroups[subjectKey]) {
                subjectGroups[subjectKey] = {
                    subject_id: mapping.subject_id,
                    subject_name: this.getSubjectName(mapping.subject_id),
                    topics: []
                };
            }
            subjectGroups[subjectKey].topics.push(mapping);
        });

        const relevant_subjects = Object.values(subjectGroups);
        
        // Sort subjects by average relevance
        relevant_subjects.forEach(subject => {
            subject.topics.sort((a, b) => b.relevance_score - a.relevance_score);
        });
        relevant_subjects.sort((a, b) => {
            const avgA = a.topics.reduce((sum, t) => sum + t.relevance_score, 0) / a.topics.length;
            const avgB = b.topics.reduce((sum, t) => sum + t.relevance_score, 0) / b.topics.length;
            return avgB - avgA;
        });

        // Get related careers
        const relatedIds = career.related_careers || [];
        const related_careers = relatedIds
            .map(id => this.careers.find(c => c.career_id === id))
            .filter(c => c);

        return {
            found: true,
            career: career,
            relevant_subjects: relevant_subjects,
            total_relevant_topics: careerMappings.length,
            related_careers: related_careers
        };
    }

    getSubjectName(subjectId) {
        // Extract readable subject name from subject_id
        if (subjectId.includes('math')) return 'Mathematics';
        if (subjectId.includes('science')) return 'Integrated Science';
        if (subjectId.includes('social')) return 'Social Studies';
        if (subjectId.includes('ict')) return 'ICT (Information & Communication Technology)';
        if (subjectId.includes('bdt')) return 'Basic Design & Technology';
        if (subjectId.includes('english')) return 'English Language';
        
        // Fallback: capitalize first letter
        return subjectId.charAt(0).toUpperCase() + subjectId.slice(1).replace(/_/g, ' ');
    }

    // Get all careers
    getAllCareers() {
        return this.careers;
    }

    // Get all mappings
    getAllMappings() {
        return this.mappings;
    }

    // Search careers
    searchCareers(query) {
        const searchLower = query.toLowerCase();
        return this.careers.filter(c => 
            c.career_name.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower) ||
            c.career_cluster.toLowerCase().includes(searchLower)
        );
    }
}

// Make it available globally
window.RETECDatabase = RETECDatabase;
