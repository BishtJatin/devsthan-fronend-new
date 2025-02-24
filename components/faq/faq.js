import { useState, useEffect } from "react";
import styles from "../faq/faq.module.css";

const FAQ = ({ faqData }) => {
  const [filteredData, setFilteredData] = useState([]); // Filtered questions based on category
  const [searchSuggestions, setSearchSuggestions] = useState([]); // Categories for search suggestions
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category to display questions
  const [expandedQuestions, setExpandedQuestions] = useState({}); // Tracks expanded questions
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controls dropdown visibility

  // Generate category suggestions on load
  useEffect(() => {
    const uniqueCategories = [
      ...new Set(faqData.map((item) => item.category)),
    ];
    setSearchSuggestions(uniqueCategories);
    setSelectedCategory(uniqueCategories[0]); // Set the first category as default
  }, [faqData]);

  // Filter questions based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = faqData.filter((item) =>
        item.category === selectedCategory
      );
      setFilteredData(filtered);
    }
  }, [selectedCategory, faqData]);

  // Toggle the expanded state of a question
  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle category click and update input
  const handleCategoryClick = (category) => {
    setSearchTerm(category); // Update input field with clicked suggestion
    setSelectedCategory(category); // Set the selected category
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className={styles["faq-container"]}>
      <h2 className={styles["faq-heading"]}>Frequently Asked Questions</h2>

      {/* Search Input */}
      <div className={styles["search-wrapper"]}>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
          onFocus={() => setIsDropdownOpen(true)} // Open dropdown when focused
        />
        {isDropdownOpen && (
          <div className={styles["custom-dropdown"]}>
            {searchSuggestions
              .filter((category) =>
                category.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((category, index) => (
                <div
                  key={index}
                  className={styles["dropdown-item"]}
                  onClick={() => handleCategoryClick(category)} // Set selected category and close dropdown
                >
                  {category}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Display Questions and Answers */}
      <ul className={styles["questions-list"]}>
        {filteredData.map((item, index) => (
          <li key={item._id} className={styles["question-item"]}>
            {/* Question with dropdown arrow aligned to the right */}
            <div
              className={styles["question"]}
              onClick={() => toggleQuestion(index)}
            >
              {item.question}
              <span className={styles["dropdown-icon"]}>
                {expandedQuestions[index] ? "▲" : "▼"}
              </span>
            </div>

            {/* Answer displayed in a separate div */}
            {expandedQuestions[index] && (
              <div className={styles["answer-container"]}>
                <p className={styles["answer"]}>{item.answer}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
