import { BookOpen, GraduationCap } from "lucide-react";

type GradeOption = { label: string; board: string; grade: string };

type Props = {
  grades: GradeOption[];
  subjects: string[];
  selectedGrade: GradeOption;
  selectedSubject: string;
  onGradeChange: (g: GradeOption) => void;
  onSubjectChange: (s: string) => void;
};

const ChatFilters = ({ grades, subjects, selectedGrade, selectedSubject, onGradeChange, onSubjectChange }: Props) => (
  <div className="shrink-0 border-b bg-card px-3 py-2">
    {/* Grade row */}
    <div className="flex items-center gap-2 pb-1.5">
      <div className="flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-1">
        <GraduationCap className="h-4 w-4 text-primary" />
        <span className="font-heading text-xs font-semibold text-secondary-foreground">Class</span>
      </div>
      {grades.map((g) => (
        <button
          key={g.label}
          onClick={() => onGradeChange(g)}
          className={`shrink-0 rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-all duration-200 ${
            selectedGrade.label === g.label
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
    {/* Subject row - wrapped, no scroll */}
    <div className="flex flex-wrap items-center gap-2 pb-1">
      <div className="flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-1">
        <BookOpen className="h-4 w-4 text-accent" />
        <span className="font-heading text-xs font-semibold text-secondary-foreground">Subjects</span>
      </div>
      {subjects.map((s) => (
        <button
          key={s}
          onClick={() => onSubjectChange(selectedSubject === s ? "" : s)}
          className={`rounded-lg px-3 py-1.5 font-heading text-xs font-medium transition-all duration-200 ${
            selectedSubject === s
              ? "bg-accent text-accent-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  </div>
);

export default ChatFilters;
