import React, { useState } from 'react';
import { Course, UserProgress } from '../types';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Heart,
  Download
} from 'lucide-react';
import { InteractiveCoursePlayer } from './InteractiveCoursePlayer';
import { downloadCurriculumGuide } from '../utils/downloadHelpers';

interface CoursesSectionProps {
  courses: Course[];
  userProgress: UserProgress;
  onCompleteLesson: (lessonId: string, quizScore: number, courseId: string, courseTitle: string) => void;
  onToggleLikeCourse?: (courseId: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  userProgress,
  onCompleteLesson,
  onToggleLikeCourse
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedGradeTab, setSelectedGradeTab] = useState<string>('All');

  const gradeTabs = ['All', 'Class 3-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'];

  const likedCourseIds = userProgress.likedCourseIds || [];
  const likedCoursesCount = courses.filter(c => 
    likedCourseIds.includes(c.id) || c.isLiked
  ).length;

  const filteredCourses = selectedGradeTab === 'All' 
    ? courses 
    : selectedGradeTab === 'Liked'
      ? courses.filter(c => likedCourseIds.includes(c.id) || c.isLiked)
      : courses.filter(c => c.gradeLevel === selectedGradeTab);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        {/* Background Image with Ambient Blend */}
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Classroom Students"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay pointer-events-none"
        />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-white text-xs font-bold backdrop-blur-xs">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>NEP 2020 Experiential Learning Framework</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Grade-Progressive Interactive Course Modules
          </h1>
          <p className="text-sm md:text-base text-amber-50 leading-relaxed">
            Hands-on learning tailored to every stage of Indian schooling (Classes 3–12). Master circuits, obstacle-avoiding rovers, IoT telemetry, and autonomous drones with our built-in virtual circuit simulators, live quizzes, and verifiable certificates.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-amber-100 font-medium">
            <span>✓ Aligned with Atal Tinkering Labs (AIM)</span>
            <span>✓ Verifiable School Certificates</span>
            <span>✓ Built-in Code & Circuit Runner</span>
          </div>

          <div className="pt-3">
            <button
              id="btn-download-complete-curriculum"
              onClick={() => downloadCurriculumGuide()}
              className="px-5 py-2.5 bg-white hover:bg-amber-50 text-slate-900 text-xs font-bold rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>Download NEP 2020 ATL Complete Curriculum & Syllabus (PDF/HTML)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grade Level Selector and Liked Items Filter */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {gradeTabs.map((tab) => (
            <button
              key={tab}
              id={`tab-grade-${(tab || '').toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedGradeTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedGradeTab === tab
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab === 'All' ? 'All Classes (3–12)' : tab}
            </button>
          ))}
        </div>

        {/* Quick Liked Items Filter Pill */}
        <button
          id="btn-filter-liked-courses"
          onClick={() => setSelectedGradeTab(selectedGradeTab === 'Liked' ? 'All' : 'Liked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-xs ${
            selectedGradeTab === 'Liked'
              ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${selectedGradeTab === 'Liked' || likedCoursesCount > 0 ? 'fill-current' : ''}`} />
          <span>Client Liked Courses</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
            selectedGradeTab === 'Liked' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-800'
          }`}>
            {likedCoursesCount}
          </span>
        </button>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Liked Courses Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You haven't liked any courses yet. Click the heart icon on any course card to add it to your client favorites section!
          </p>
          <button
            onClick={() => setSelectedGradeTab('All')}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const completedCount = course.lessons.filter(l => userProgress.completedLessonIds.includes(l.id)).length;
            const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
            const isLiked = (userProgress.likedCourseIds && userProgress.likedCourseIds.includes(course.id)) || course.isLiked;
            const likesCount = course.likesCount ?? (isLiked ? 140 : 120);

            return (
              <div
                key={course.id}
                id={`course-${course.id}`}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-500/40 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg">
                      {course.gradeLevel}
                    </div>

                    {/* Client Liked Course Toggle Icon */}
                    <button
                      id={`btn-like-course-${course.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleLikeCourse) {
                          onToggleLikeCourse(course.id);
                        }
                      }}
                      title={isLiked ? 'Remove from client liked items' : 'Add to client liked items'}
                      aria-label={isLiked ? `Liked course ${course.title}` : `Like course ${course.title}`}
                      className={`absolute top-3 right-3 px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-md backdrop-blur-md cursor-pointer z-10 ${
                        isLiked 
                          ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105 ring-2 ring-white/70' 
                          : 'bg-slate-900/75 text-slate-200 hover:text-white hover:bg-slate-900/95'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? 'fill-current text-white' : 'text-slate-200'}`} />
                      <span className="text-[11px] font-bold">{likesCount}</span>
                    </button>

                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{course.totalHours} Tinkering Hours</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>
                      {isLiked && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                          <span>Liked</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.overview}
                    </p>

                    {/* NEP Competencies */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Target NEP 2020 Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {course.nepCompetencies.map((comp, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            • {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar if started */}
                    {completedCount > 0 && (
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600">Your Progress</span>
                          <span className="text-amber-600 font-bold">{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPercent}%` }}
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{course.enrolledStudents.toLocaleString('en-IN')} students enrolled</span>
                  </div>

                  <button
                    id={`btn-open-course-${course.id}`}
                    onClick={() => setSelectedCourse(course)}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{completedCount > 0 ? 'Resume Course' : 'Start Interactive Lab'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Player Modal */}
      {selectedCourse && (
        <InteractiveCoursePlayer
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          userProgress={userProgress}
          onCompleteLesson={onCompleteLesson}
        />
      )}
    </div>
  );
};
