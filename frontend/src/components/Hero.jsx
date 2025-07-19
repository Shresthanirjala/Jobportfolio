import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Sparkles,
  Star,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Filter,
  Heart,
} from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  const trendingSearches = [
    { title: "UiUx Designer", count: "1.2k+ jobs" },
    { title: "Developers", count: "3.5k+ jobs" },
    { title: "App developers", count: "2.1k+ jobs" },
    { title: "Backend Developer", count: "1.8k+ jobs" },
    { title: "QA Engineer", count: "950+ jobs" },
  ];

  // Enhanced mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Senior UiUx Designer",
      company: "TechCorp",
      location: "San Francisco",
      type: "Full-time",
      salary: "$80k-120k",
      rating: 4.8,
      applicants: 45,
      posted: "2 days ago",
      featured: true,
      skills: ["Figma", "Adobe XD", "Prototyping"],
      description:
        "Lead design projects and collaborate with cross-functional teams to create exceptional user experiences.",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "StartupXYZ",
      location: "New York",
      type: "Remote",
      salary: "$70k-100k",
      rating: 4.5,
      applicants: 78,
      posted: "1 day ago",
      featured: false,
      skills: ["React", "TypeScript", "CSS"],
      description:
        "Build responsive web applications using modern frontend technologies.",
    },
    {
      id: 3,
      title: "Backend Developer",
      company: "CloudSystems",
      location: "Seattle",
      type: "Full-time",
      salary: "$90k-130k",
      rating: 4.7,
      applicants: 32,
      posted: "3 days ago",
      featured: true,
      skills: ["Node.js", "Python", "AWS"],
      description:
        "Design and implement scalable backend systems for enterprise applications.",
    },
    {
      id: 4,
      title: "Mobile App Developer",
      company: "AppStudio",
      location: "Austin",
      type: "Hybrid",
      salary: "$75k-110k",
      rating: 4.6,
      applicants: 56,
      posted: "1 week ago",
      featured: false,
      skills: ["React Native", "Flutter", "iOS"],
      description:
        "Develop cross-platform mobile applications with focus on performance and user experience.",
    },
    {
      id: 5,
      title: "QA Engineer",
      company: "QualityFirst",
      location: "Boston",
      type: "Full-time",
      salary: "$60k-85k",
      rating: 4.4,
      applicants: 23,
      posted: "4 days ago",
      featured: false,
      skills: ["Selenium", "Jest", "Automation"],
      description:
        "Ensure product quality through comprehensive testing strategies and automation.",
    },
    {
      id: 6,
      title: "Full Stack Developer",
      company: "DevHouse",
      location: "Chicago",
      type: "Remote",
      salary: "$85k-125k",
      rating: 4.9,
      applicants: 67,
      posted: "5 days ago",
      featured: true,
      skills: ["MERN Stack", "GraphQL", "Docker"],
      description:
        "Work on full-stack applications using cutting-edge technologies in an agile environment.",
    },
  ];

  // Animated typing effect
  const phrases = [
    "Your Dream Job",
    "Perfect Opportunity",
    "Career Growth",
    "Next Position",
  ];
  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        setAnimatedText(currentPhrase.substring(0, currentCharIndex - 1));
        currentCharIndex--;
      } else {
        setAnimatedText(currentPhrase.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      }

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        setTimeout(() => (isDeleting = true), 2000);
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }

      setTimeout(typeWriter, isDeleting ? 50 : 150);
    };

    typeWriter();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      const filteredJobs = mockJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setSearchResults(filteredJobs);
      setIsSearching(false);
    }, 1500);
  };

  const handleTrendingClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    setLocation("");

    setIsSearching(true);
    setTimeout(() => {
      const filteredJobs = mockJobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredJobs);
      setIsSearching(false);
    }, 1500);
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Decorative Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#718B68] opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-[#013954] opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-20 w-28 h-28 bg-[#718B68] opacity-5 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-12 justify-center items-center px-4 md:px-10 pt-24 py-[100px]">
        <div className="w-full max-w-[1000px]">
          {/* Professional Header Section */}
          <div className="text-[#013954] text-center p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 bg-[#718B68] rounded-lg">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-[#718B68] font-semibold text-sm uppercase tracking-wide">
                Professional Job Search
              </span>
            </div>

            <h1 className="text-[36px] md:text-[52px] font-bold leading-tight mb-6 text-[#013954]">
              Find{" "}
              <span className="text-[#718B68] relative inline-block">
                {animatedText}
                <span className="animate-pulse text-[#718B68]">|</span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#718B68]"></div>
              </span>
              <br className="hidden md:block" />
              With Confidence
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with leading employers and discover career opportunities
              that align with your expertise and professional goals.
            </p>
          </div>

          {/* Professional Search Bar Section */}
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Search Input Container */}
            <div className="rounded-2xl p-6 w-full max-w-4xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Search Input */}
                <div className="flex items-center gap-4 w-full lg:flex-1">
                  <div className="p-3 bg-[#013954] rounded-lg">
                    <Search className="text-white w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs, companies, skills..."
                    className="bg-transparent outline-none text-gray-700 w-full text-lg placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-[1px] bg-gray-200 h-12"></div>
                <div className="lg:hidden w-full h-[1px] bg-gray-200"></div>

                {/* Location Input */}
                <div className="flex items-center gap-4 w-full lg:flex-1">
                  <div className="p-3 bg-[#718B68] rounded-lg">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    className="bg-transparent outline-none text-gray-700 w-full text-lg placeholder-gray-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Professional Search Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-xl w-full max-w-xs h-14 bg-[#718B68] shadow-lg text-white flex items-center justify-center text-lg font-semibold hover:bg-[#5d7355] transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSearching ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Professional Trending Searches */}
        <div className="w-full max-w-[1000px] text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-[#013954] rounded-lg">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-[#013954]">
              Popular Job Categories
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleTrendingClick(search.title)}
                className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg flex items-center justify-center mb-3 mx-auto transition-all duration-300">
                    <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#718B68]" />
                  </div>
                  <h4 className="font-semibold text-[#013954] mb-1 group-hover:text-[#718B68] transition-colors">
                    {search.title}
                  </h4>
                  <p className="text-sm text-gray-500">{search.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Professional Search Results Section */}
        {searchResults.length > 0 && (
          <div className="w-full max-w-[1000px] mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#013954] rounded-lg">
                    <Briefcase className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#013954]">
                      Search Results
                    </h2>
                    <p className="text-[#718B68] font-medium">
                      {searchResults.length} positions found
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Sort by</p>
                  <select className="bg-transparent border-b border-gray-300 text-gray-700 font-medium focus:outline-none focus:border-[#718B68]">
                    <option>Relevance</option>
                    <option>Date Posted</option>
                    <option>Salary</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6">
                {searchResults.map((job, index) => (
                  <div
                    key={job.id}
                    className="group p-6 border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50"
                  >
                    {job.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#013954] text-white text-sm font-medium rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg transition-all">
                            <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#718B68]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#013954] mb-2 group-hover:text-[#718B68] transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                              <span className="flex items-center gap-2 font-medium">
                                <div className="w-2 h-2 bg-[#718B68] rounded-full"></div>
                                {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.posted}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {job.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{job.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{job.applicants} applicants</span>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xl font-bold text-[#718B68] mb-1">
                            <DollarSign className="w-5 h-5" />
                            {job.salary}
                          </div>
                          <p className="text-sm text-gray-500">per year</p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-3 rounded-lg transition-all duration-300 ${
                              savedJobs.has(job.id)
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                savedJobs.has(job.id) ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button className="px-6 py-3 bg-[#013954] text-white rounded-lg hover:bg-[#025373] transition-all duration-300 font-medium flex items-center gap-2">
                            Apply Now
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Professional No Results Message */}
        {searchResults.length === 0 && searchQuery && !isSearching && (
          <div className="w-full max-w-[900px] mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="text-gray-300 mb-6">
                <Search className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-[#013954] mb-4">
                No positions found for "{searchQuery}"
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Try adjusting your search terms or explore our popular job
                categories above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-8 py-3 bg-[#718B68] text-white rounded-lg hover:bg-[#5d7355] transition-all duration-300 font-semibold"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
