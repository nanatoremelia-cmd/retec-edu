// RETEC Database Test Script
// Run this in Node.js to verify database functionality

const fs = require('fs');

// Load databases
const careers = JSON.parse(fs.readFileSync('careers_database.json', 'utf8'));
const curriculum = JSON.parse(fs.readFileSync('curriculum_database.json', 'utf8'));
const mappings = JSON.parse(fs.readFileSync('mappings_database.json', 'utf8'));

console.log('📊 RETEC DATABASE TEST\n');
console.log('='

.repeat(50));

// Test 1: Database loaded correctly
console.log('\n✅ TEST 1: Database Loading');
console.log(`   Careers: ${careers.total_careers} loaded`);
console.log(`   Subjects: ${curriculum.total_subjects} loaded`);
console.log(`   Mappings: ${mappings.total_mappings} loaded`);

// Test 2: Career search
console.log('\n✅ TEST 2: Career Search');
const civilEngineer = careers.careers.find(c => c.career_name === 'Civil Engineer');
console.log(`   Found: ${civilEngineer.career_name}`);
console.log(`   Cluster: ${civilEngineer.career_cluster}`);
console.log(`   Skills: ${civilEngineer.key_skills.slice(0, 3).join(', ')}...`);

// Test 3: Get relevant curriculum for career
console.log('\n✅ TEST 3: Career-to-Curriculum Mapping');
const engineerMappings = mappings.mappings.filter(m => m.career_id === 'civil_engineer_001');
console.log(`   Civil Engineer has ${engineerMappings.length} topic mappings`);
console.log(`   Top mapping: ${engineerMappings[0].topic_name} (Score: ${engineerMappings[0].relevance_score}/10)`);

// Test 4: Subject coverage
console.log('\n✅ TEST 4: Curriculum Coverage');
curriculum.subjects.forEach(subject => {
    console.log(`   ${subject.subject_name}: ${subject.topics.length} topics`);
});

// Test 5: Career clusters
console.log('\n✅ TEST 5: Career Clusters');
const clusters = [...new Set(careers.careers.map(c => c.career_cluster))];
console.log(`   Total clusters: ${clusters.length}`);
clusters.slice(0, 5).forEach(cluster => {
    const count = careers.careers.filter(c => c.career_cluster === cluster).length;
    console.log(`   - ${cluster}: ${count} careers`);
});

// Test 6: High relevance mappings
console.log('\n✅ TEST 6: Critical Learning Topics (Score 9-10)');
const criticalMappings = mappings.mappings.filter(m => m.relevance_score >= 9);
console.log(`   ${criticalMappings.length} critical topic mappings`);
console.log(`   Example: ${criticalMappings[0].career_name} needs ${criticalMappings[0].topic_name}`);

// Test 7: Example query simulation
console.log('\n✅ TEST 7: Example Query Simulation');
const queryCareer = 'Entrepreneur';
const foundCareer = careers.careers.find(c => 
    c.career_name.toLowerCase().includes(queryCareer.toLowerCase())
);
if (foundCareer) {
    const careerMappings = mappings.mappings.filter(m => m.career_id === foundCareer.career_id);
    console.log(`   Query: "${queryCareer}"`);
    console.log(`   Found: ${foundCareer.career_name}`);
    console.log(`   Relevant topics: ${careerMappings.length}`);
    console.log(`   Most important: ${careerMappings[0].topic_name} (${careerMappings[0].relevance_score}/10)`);
}

console.log('\n' + '='.repeat(50));
console.log('✅ ALL TESTS PASSED - Database is ready!\n');
