
import React, { useState } from "react";
import { Course } from "../utils/types";
import { Flag } from "lucide-react";

interface CourseSetupProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

const CourseSetup: React.FC<CourseSetupProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCourses = searchTerm
    ? courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  return (
    <div className="card p-5">
      <h3 className="heading-3 mb-4">Select Course</h3>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a course..."
          className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-1 focus:ring-ring transition-all"
        />
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className={`w-full flex items-center p-3 rounded-lg border ${
                selectedCourseId === course.id 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-card hover:bg-secondary/50"
              } transition-colors`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`icon-container ${selectedCourseId === course.id ? "bg-primary/20" : ""}`}>
                  <Flag size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium">{course.name}</h4>
                  <p className="text-sm text-foreground/70">
                    {course.tees.length} Tee{course.tees.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No courses found
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSetup;
