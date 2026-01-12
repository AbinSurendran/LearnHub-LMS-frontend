import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { coursesAPI } from "../../services/api";
import "./Courses.css";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      const allCourses = response.data.filter((c) => c.status === "active");
      setCourses(allCourses);

      const uniqueCategories = [
        "All",
        ...new Set(allCourses.map((c) => c.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="courses-page">
      <div className="container">
        <div className="courses-header">
          <h1 className="courses-title">Browse Courses</h1>
          <p className="courses-subtitle">
            Discover courses that match your learning goals.
          </p>
        </div>

        <div className="courses-filters">
          <div className="search-bar">
            <span className="search-icon">
              <SearchIcon fontSize="medium" />
            </span>

            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            <div className="filter-icon">
              <FilterListIcon fontSize="medium" />
            </div>

            <div className="category-tags">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-tag ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="no-courses">
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="course-card"
              >
                <div className="course-thumbnail-wrapper">
                  <img
                    src={
                      course.thumbnail ||
                      "https://via.placeholder.com/400x250?text=Course+Image"
                    }
                    alt={course.title}
                    className="course-thumbnail"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Course+Image";
                    }}
                  />
                </div>
                {/* <div className="course-content">
                  <span className="course-category">{course.category}</span>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>👨‍🏫 {course.instructorName}</span>
                    <span>⏱️ {course.duration}</span>
                  </div>
                </div> */}

                <div className="course-content">
                  <span className="course-category">{course.category}</span>

                  <h3 className="course-title">{course.title}</h3>

                  <p className="course-description">{course.description}</p>

                  <div className="course-meta">
                    <span className="course-meta-item">
                      <SchoolIcon fontSize="small" /> {course.instructorName}
                    </span>

                    <span className="course-meta-item">
                      <AccessTimeIcon fontSize="small" /> {course.duration}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
