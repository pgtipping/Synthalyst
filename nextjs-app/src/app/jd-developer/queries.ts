// Groq query to fetch job information from the Groq database.  This query will fetch all jobs that match the provided job title.
export const fetchJobQuery = (jobTitle: string) =>
  `*[_type == "jobs" && jobTitle == "${jobTitle}" ]{
    jobTitle,
    responsibilities,
    requiredSkills[]
  }`;

// Llama-3.2-1B-preview prompt template for generating a job description.  This template will use the job information fetched from Groq to generate a job description.
export interface JobData {
  jobTitle: string;
  responsibilities: string;
  requiredSkills: string[];
}

export const generateJobDescriptionPrompt = (
  jobData: JobData
) => `Generate a job description based on the following information:

Job Title: ${jobData.jobTitle}
Responsibilities: ${jobData.responsibilities}
Required Skills: ${jobData.requiredSkills}
`;
